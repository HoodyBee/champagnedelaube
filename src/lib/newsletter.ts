import "server-only";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { sendEmail } from "./brevo";
import { createToken } from "./newsletter-token";

/** Adresse du site qui a reçu la demande (le vrai domaine, ou la prévisualisation Netlify). */
export async function currentOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_URL;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Envoie l'e-mail de double confirmation (dans la langue du visiteur). Le contact
 * n'est ajouté à la liste « Newsletter » qu'après avoir cliqué et confirmé.
 */
export async function sendNewsletterConfirmation(opts: { email: string; locale: Locale; page: string }) {
  const t = await getTranslations({ locale: opts.locale, namespace: "newsletter.email" });
  const tLegal = await getTranslations({ locale: opts.locale, namespace: "legal" });
  const token = createToken({ email: opts.email, locale: opts.locale, page: opts.page });
  const url = `${await currentOrigin()}${getPathname({ href: "/newsletter/confirmation", locale: opts.locale })}?token=${encodeURIComponent(token)}`;

  const text = [t("hello"), "", t("body"), "", url, "", t("expiry"), t("ignore"), "", t("signature"), "", tLegal("health")].join("\n");
  const html = `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#1E1E20;max-width:560px">
<p>${esc(t("hello"))}</p><p>${esc(t("body"))}</p>
<p style="margin:32px 0"><a href="${url}" style="background:#1E1E20;color:#FFFFFF;padding:14px 24px;border-radius:4px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;letter-spacing:.08em;text-transform:uppercase">${esc(t("button"))}</a></p>
<p style="color:#5C5650;font-size:14px">${esc(t("expiry"))}<br>${esc(t("ignore"))}</p>
<p>${esc(t("signature")).replace(/\n/g, "<br>")}</p>
<p style="color:#5C5650;font-size:13px">${esc(tLegal("health"))}</p></div>`;

  return sendEmail({ to: opts.email, subject: t("subject"), text, html });
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
