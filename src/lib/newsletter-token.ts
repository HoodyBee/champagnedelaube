import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Lien de confirmation de la newsletter (double opt-in) : les informations sont
// signées pour qu'on ne puisse pas inscrire quelqu'un d'autre à sa place.
// Clé de signature : NEWSLETTER_SECRET (ou, à défaut, BREVO_API_KEY).

export type NewsletterToken = { email: string; locale: string; page: string; exp: number };

const VALIDITY_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function secret() {
  const s = process.env.NEWSLETTER_SECRET || process.env.BREVO_API_KEY;
  if (!s) throw new Error("NEWSLETTER_SECRET ou BREVO_API_KEY manquante");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function createToken(data: Omit<NewsletterToken, "exp">, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ ...data, exp: now + VALIDITY_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Renvoie les données si le lien est authentique et non expiré, sinon la raison du refus. */
export function readToken(token: string, now = Date.now()): NewsletterToken | "invalid" | "expired" {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return "invalid";
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as NewsletterToken;
    if (typeof data.email !== "string" || typeof data.exp !== "number") return "invalid";
    return data.exp < now ? "expired" : data;
  } catch {
    return "invalid";
  }
}
