import "server-only";
import { headers } from "next/headers";

// Protections anti-spam communes aux formulaires et à l'inscription newsletter.

const hits = new Map<string, number[]>();

/**
 * Limite simple : `max` envois par adresse IP sur 10 minutes (par serveur).
 * FORMS_RATE_LIMIT permet de l'augmenter (tests automatisés).
 */
export function rateLimited(ip: string, max = Number(process.env.FORMS_RATE_LIMIT) || 5) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export async function clientIp() {
  const h = await headers();
  return (h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue";
}

/** Vérification Cloudflare Turnstile, uniquement si les clés sont configurées. */
export async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}
