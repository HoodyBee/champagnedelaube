"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { forms, HONEYPOT, isFormId, MIN_FILL_MS, STARTED_AT, type FieldDef, type FormId } from "@/lib/forms/definitions";
import { schemaFor } from "@/lib/forms/schema";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { getBrochureUrl, getReglages } from "@/sanity/queries";

export type FormState = {
  status: "idle" | "success" | "error";
  /** Erreurs par champ : clés de traduction (forms.errors.<clé>). */
  errors?: Record<string, string>;
  /** Erreur générale : clé de traduction (forms.errors.<clé>). */
  message?: "invalid" | "spam" | "captcha" | "rate" | "config" | "send";
  /** Lien de téléchargement (brochure CSE). */
  downloadUrl?: string;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne rien faire perdre au visiteur. */
  values?: Record<string, string>;
  /** Change à chaque réponse : permet de réafficher le formulaire avec ces valeurs. */
  nonce?: number;
};

// Limite simple : 5 envois par adresse IP toutes les 10 minutes (par serveur).
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // anti-spam Cloudflare pas encore configuré : honeypot + délai seulement
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

/** Reçoit un formulaire du site, le vérifie et l'envoie par e-mail. */
export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const formId = formData.get("_form");
  const localeRaw = String(formData.get("_locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  if (!isFormId(formId)) return { status: "error", message: "invalid" };

  // Valeurs saisies (renvoyées telles quelles en cas d'erreur).
  const values: Record<string, string> = {};
  for (const f of forms[formId].fields as readonly FieldDef[]) values[f.name] = String(formData.get(f.name) ?? "").slice(0, 4000);
  if (formData.get("majeur")) values.majeur = "on";
  values[STARTED_AT] = String(formData.get(STARTED_AT) ?? "");
  const fail = (state: Omit<FormState, "status" | "values" | "nonce">): FormState => ({ status: "error", values, nonce: Date.now(), ...state });

  // 1. Anti-spam : champ piège rempli (robot) -> on fait semblant d'accepter.
  if (String(formData.get(HONEYPOT) ?? "") !== "") return { status: "success" };
  // 2. Anti-spam : formulaire rempli trop vite pour un humain.
  const startedAt = Number(formData.get(STARTED_AT));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return fail({ message: "spam" });

  const h = await headers();
  const ip = (h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue";
  if (rateLimited(ip)) return fail({ message: "rate" });
  // 3. Anti-spam : vérification Cloudflare Turnstile (si configurée).
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
    return fail({ message: "captcha" });
  }

  // 4. Validation des champs.
  const raw: Record<string, unknown> = { ...values, majeur: values.majeur };
  const parsed = schemaFor(formId).safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return fail({ message: "invalid", errors });
  }
  const data = parsed.data as Record<string, string | number | undefined>;
  const context = String(formData.get("_context") ?? "").slice(0, 200);
  const page = String(formData.get("_page") ?? "").slice(0, 300);

  // 5. Envoi des e-mails.
  const reglages = await getReglages();
  const to = reglages.emailsFormulaires || reglages.email;
  const brochureUrl = formId === "brochureCse" ? await getBrochureUrl() : null;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Champagne de l'Aube <onboarding@resend.dev>";
  const owner = await ownerEmail(formId, data, { locale, context, page });

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[formulaire ${formId}] (Resend non configuré : e-mail non envoyé)\n${owner.text}`);
      return { status: "success", downloadUrl: brochureUrl ?? undefined };
    }
    console.error("[formulaire] RESEND_API_KEY manquante : demande non envoyée");
    return fail({ message: "config" });
  }

  const resend = new Resend(apiKey);
  const visitorEmail = typeof data.email === "string" ? data.email : undefined;
  const sent = await resend.emails.send({
    from,
    to,
    replyTo: visitorEmail,
    subject: owner.subject,
    text: owner.text,
  });
  if (sent.error) {
    console.error("[formulaire] Envoi impossible :", sent.error);
    return fail({ message: "send" });
  }

  // Accusé de réception au visiteur, dans sa langue (un échec ici ne bloque pas la demande).
  if (visitorEmail) {
    const ack = await visitorAck(formId, locale, brochureUrl);
    const res = await resend.emails.send({ from, to: visitorEmail, replyTo: to, subject: ack.subject, text: ack.text });
    if (res.error) console.warn("[formulaire] Accusé de réception non envoyé :", res.error);
  }

  return { status: "success", downloadUrl: brochureUrl ?? undefined };
}

/** E-mail reçu par Champagne de l'Aube (toujours en français). */
async function ownerEmail(
  formId: FormId,
  data: Record<string, string | number | undefined>,
  meta: { locale: Locale; context: string; page: string },
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
      `Âge : la personne certifie avoir 18 ans ou plus.`,
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
