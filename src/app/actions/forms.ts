"use server";

import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { BrevoError, describe, isBrevoConfigured, sendEmail, upsertContact, type BrevoListKey } from "@/lib/brevo";
import { forms, HONEYPOT, isFormId, MIN_FILL_MS, profilParSujet, STARTED_AT, type FieldDef, type FormId } from "@/lib/forms/definitions";
import { clientIp, rateLimited, verifyTurnstile } from "@/lib/forms/guard";
import { schemaFor } from "@/lib/forms/schema";
import { sendNewsletterConfirmation } from "@/lib/newsletter";
import { getBrochureUrl, getReglages } from "@/sanity/queries";

export type FormState = {
  status: "idle" | "success" | "error";
  /** Erreurs par champ : clés de traduction (forms.errors.<clé>). */
  errors?: Record<string, string>;
  /** Erreur générale : clé de traduction (forms.errors.<clé>). */
  message?: "invalid" | "spam" | "captcha" | "rate" | "config" | "send";
  /** Lien de téléchargement (brochure CSE). */
  downloadUrl?: string;
  /** Vrai si un e-mail de confirmation d'inscription aux actualités a été envoyé. */
  newsletter?: boolean;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne rien faire perdre au visiteur. */
  values?: Record<string, string>;
  /** Change à chaque réponse : permet de réafficher le formulaire avec ces valeurs. */
  nonce?: number;
};

/** Reçoit un formulaire du site, le vérifie, l'envoie par e-mail (Brevo) et enregistre le contact. */
export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const formId = formData.get("_form");
  const localeRaw = String(formData.get("_locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  if (!isFormId(formId)) return { status: "error", message: "invalid" };

  // Valeurs saisies (renvoyées telles quelles en cas d'erreur).
  const values: Record<string, string> = {};
  for (const f of forms[formId].fields as readonly FieldDef[]) values[f.name] = String(formData.get(f.name) ?? "").slice(0, 4000);
  if (formData.get("majeur")) values.majeur = "on";
  if (formData.get("newsletter")) values.newsletter = "on";
  values[STARTED_AT] = String(formData.get(STARTED_AT) ?? "");
  const fail = (state: Omit<FormState, "status" | "values" | "nonce">): FormState => ({ status: "error", values, nonce: Date.now(), ...state });

  // 1. Anti-spam : champ piège rempli (robot) -> on fait semblant d'accepter.
  if (String(formData.get(HONEYPOT) ?? "") !== "") return { status: "success" };
  // 2. Anti-spam : formulaire rempli trop vite pour un humain.
  const startedAt = Number(formData.get(STARTED_AT));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return fail({ message: "spam" });
  const ip = await clientIp();
  if (rateLimited(ip)) return fail({ message: "rate" });
  // 3. Anti-spam : vérification Cloudflare Turnstile (si configurée).
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) return fail({ message: "captcha" });

  // 4. Validation des champs.
  const parsed = schemaFor(formId).safeParse(values);
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  // Inscription aux actualités demandée sans e-mail : impossible de confirmer.
  if (values.newsletter && !values.email) errors.email ??= "emailForNewsletter";
  if (!parsed.success || Object.keys(errors).length) return fail({ message: "invalid", errors });
  const data = parsed.data as Record<string, string | number | undefined>;

  const context = String(formData.get("_context") ?? "").slice(0, 200);
  const page = String(formData.get("_page") ?? "").slice(0, 300);
  const visitorEmail = typeof data.email === "string" ? data.email : undefined;
  const wantsNewsletter = values.newsletter === "on" && !!visitorEmail;

  // 5. Envois.
  const reglages = await getReglages();
  const ownerAddress = reglages.emailsFormulaires || reglages.email;
  const brochureUrl = formId === "brochureCse" ? await getBrochureUrl() : null;
  const owner = await ownerEmail(formId, data, { locale, context, page, newsletter: wantsNewsletter });

  if (!isBrevoConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[formulaire ${formId}] (Brevo non configuré : rien n'est envoyé)\n${owner.text}`);
      return { status: "success", downloadUrl: brochureUrl ?? undefined, newsletter: wantsNewsletter };
    }
    console.error("[formulaire] BREVO_API_KEY manquante : demande non envoyée");
    return fail({ message: "config" });
  }

  // 5a. Notification à Champagne de l'Aube : indispensable, sinon la demande est perdue.
  try {
    await sendEmail({ to: ownerAddress, replyTo: visitorEmail, subject: owner.subject, text: owner.text });
  } catch (e) {
    console.error("[formulaire] Notification non envoyée :", describe(e));
    return fail({ message: e instanceof BrevoError && e.status === 401 ? "config" : "send" });
  }

  // Les étapes suivantes ne doivent jamais faire échouer la demande du visiteur.
  if (visitorEmail) {
    // 5b. Contact Brevo, classé selon le profil.
    const profil: BrevoListKey =
      forms[formId].profil === "sujet" ? (profilParSujet[String(data.sujet)] ?? "particuliers") : forms[formId].profil;
    await upsertContact({
      email: visitorEmail,
      fullName: String(data.nom ?? ""),
      lists: [profil],
      attributes: {
        LANGUE: locale.toUpperCase(),
        PAGE_ORIGINE: page,
        PROFIL: profil,
        ETABLISSEMENT: String(data.etablissement ?? data.entreprise ?? data.domaine ?? "") || undefined,
      },
    }).catch((e) => console.error("[formulaire] Contact Brevo non enregistré :", describe(e)));

    // 5c. Accusé de réception, dans la langue du visiteur.
    const ack = await visitorAck(formId, locale, brochureUrl);
    await sendEmail({ to: visitorEmail, toName: String(data.nom ?? ""), replyTo: ownerAddress, subject: ack.subject, text: ack.text }).catch((e) =>
      console.warn("[formulaire] Accusé de réception non envoyé :", describe(e)),
    );

    // 5d. Actualités : e-mail de double confirmation (inscription seulement après le clic).
    if (wantsNewsletter) {
      await sendNewsletterConfirmation({ email: visitorEmail, locale, page }).catch((e) =>
        console.error("[formulaire] Confirmation newsletter non envoyée :", describe(e)),
      );
    }
  }

  return { status: "success", downloadUrl: brochureUrl ?? undefined, newsletter: wantsNewsletter };
}

/** E-mail reçu par Champagne de l'Aube (toujours en français). */
async function ownerEmail(
  formId: FormId,
  data: Record<string, string | number | undefined>,
  meta: { locale: Locale; context: string; page: string; newsletter: boolean },
) {
  const t = await getTranslations({ locale: "fr", namespace: "forms" });
  const lines: string[] = [];
  for (const f of forms[formId].fields as readonly FieldDef[]) {
    const v = data[f.name];
    if (v === undefined || v === "") continue;
    const value = f.type === "select" ? t(`options.${f.name}.${v}`) : String(v);
    lines.push(`${t(`fields.${f.name}`)} : ${value}`);
  }
  const nom = String(data.nom ?? "");
  return {
    subject: `[Site] ${t(`titles.${formId}`)}${meta.context ? ` · ${meta.context}` : ""} · ${nom}`,
    text: [
      `Nouvelle demande reçue sur le site : ${t(`titles.${formId}`)}`,
      meta.context ? `Concerne : ${meta.context}` : null,
      "",
      ...lines,
      "",
      "Âge : la personne certifie avoir 18 ans ou plus.",
      `Actualités : ${meta.newsletter ? "souhaite les recevoir (e-mail de confirmation envoyé)" : "non"}`,
      `Langue du visiteur : ${meta.locale.toUpperCase()}`,
      meta.page ? `Page : ${meta.page}` : null,
      "",
      "Pour répondre, utilisez simplement « Répondre » : la réponse ira au visiteur.",
    ]
      .filter((l) => l !== null)
      .join("\n"),
  };
}

/** Accusé de réception envoyé au visiteur, dans sa langue. */
async function visitorAck(formId: FormId, locale: Locale, brochureUrl: string | null) {
  const t = await getTranslations({ locale, namespace: "forms" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });
  return {
    subject: t("ack.subject"),
    text: [
      t("ack.hello"),
      "",
      t("ack.body", { form: t(`titles.${formId}`) }),
      brochureUrl ? `\n${t("ack.brochure")}\n${brochureUrl}` : null,
      "",
      t("ack.signature"),
      "Champagne de l'Aube · Troyes",
      "",
      tLegal("health"),
    ]
      .filter((l) => l !== null)
      .join("\n"),
  };
}
