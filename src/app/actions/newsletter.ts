"use server";

import { z } from "zod";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { describe, isBrevoConfigured, upsertContact } from "@/lib/brevo";
import { HONEYPOT, MIN_FILL_MS, STARTED_AT } from "@/lib/forms/definitions";
import { clientIp, rateLimited, verifyTurnstile } from "@/lib/forms/guard";
import { sendNewsletterConfirmation } from "@/lib/newsletter";
import { readToken } from "@/lib/newsletter-token";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  /** Erreurs par champ : clés newsletter.errors.<clé>. */
  errors?: Partial<Record<"email" | "majeur" | "consentement", string>>;
  message?: "invalid" | "spam" | "rate" | "captcha" | "config" | "send";
  email?: string;
  /** Heure de début du remplissage, conservée après une erreur (anti-robot). */
  startedAt?: string;
  nonce?: number;
};

const schema = z.object({
  email: z.string().trim().min(1, { error: "required" }).max(200).email({ error: "email" }),
  majeur: z.literal("on", { error: "majeur" }),
  consentement: z.literal("on", { error: "consentement" }),
});

/**
 * Inscription aux actualités (bandeau du haut de page, page Newsletter, pied de page).
 * Étape 1 : on envoie un e-mail de confirmation. Le contact n'est ajouté à la liste
 * « Newsletter » de Brevo qu'à l'étape 2 (confirmNewsletter), après son clic.
 */
export async function subscribeNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const localeRaw = String(formData.get("_locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const page = String(formData.get("_page") ?? "").slice(0, 300);
  const values = {
    email: String(formData.get("email") ?? ""),
    majeur: formData.get("majeur") ? "on" : undefined,
    consentement: formData.get("consentement") ? "on" : undefined,
  };
  const fail = (s: Omit<NewsletterState, "status" | "nonce" | "email" | "startedAt">): NewsletterState => ({
    status: "error",
    email: values.email,
    startedAt: String(formData.get(STARTED_AT) ?? ""),
    nonce: Date.now(),
    ...s,
  });

  if (String(formData.get(HONEYPOT) ?? "") !== "") return { status: "success" };
  const startedAt = Number(formData.get(STARTED_AT));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return fail({ message: "spam" });
  const ip = await clientIp();
  if (rateLimited("nl:" + ip)) return fail({ message: "rate" });
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) return fail({ message: "captcha" });

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: NewsletterState["errors"] = {};
    for (const i of parsed.error.issues) errors[i.path[0] as "email"] ??= i.message;
    return fail({ message: "invalid", errors });
  }

  if (!isBrevoConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[newsletter] (Brevo non configuré) confirmation à envoyer à ${parsed.data.email} (${locale}, ${page})`);
      return { status: "success", email: parsed.data.email };
    }
    return fail({ message: "config" });
  }
  try {
    await sendNewsletterConfirmation({ email: parsed.data.email, locale, page });
  } catch (e) {
    console.error("[newsletter] Confirmation non envoyée :", describe(e));
    return fail({ message: "send" });
  }
  return { status: "success", email: parsed.data.email };
}

export type ConfirmState = { status: "idle" | "success" | "invalid" | "expired" | "error" };

/** Étape 2 : la personne a cliqué sur le lien et confirmé. On l'ajoute à la liste « Newsletter ». */
export async function confirmNewsletter(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const token = readToken(String(formData.get("token") ?? ""));
  if (token === "invalid" || token === "expired") return { status: token };
  if (!isBrevoConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[newsletter] (Brevo non configuré) inscription confirmée : ${token.email}`);
      return { status: "success" };
    }
    return { status: "error" };
  }
  try {
    await upsertContact({
      email: token.email,
      lists: ["newsletter"],
      reactivate: true,
      attributes: {
        LANGUE: token.locale.toUpperCase(),
        PAGE_ORIGINE: token.page,
        NEWSLETTER_CONSENTEMENT: new Date().toISOString().slice(0, 10),
      },
    });
    return { status: "success" };
  } catch (e) {
    console.error("[newsletter] Inscription non enregistrée :", describe(e));
    return { status: "error" };
  }
}
