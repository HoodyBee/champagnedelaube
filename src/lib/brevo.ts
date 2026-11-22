// Brevo : e-mails transactionnels (formulaires) et contacts (listes, newsletter).
//
// Ce fichier n'utilise que `fetch` (pas de Next.js) : il sert aussi à la tâche
// planifiée Netlify (netlify/functions/brevo-keepalive.mts).
//
// Clé : variable d'environnement BREVO_API_KEY (Netlify). Droits nécessaires :
// « Transactional emails » et « Contacts ».
//
// Les listes et les attributs de contact sont créés automatiquement s'ils
// n'existent pas encore dans Brevo (dossier « Site internet »).

export const BREVO_LISTS = {
  pro: "Professionnels",
  entreprises: "Entreprises & CSE",
  particuliers: "Particuliers",
  vignerons: "Vignerons",
  newsletter: "Newsletter",
} as const;
export type BrevoListKey = keyof typeof BREVO_LISTS;

/** Attributs enregistrés sur chaque contact (en plus de FIRSTNAME / LASTNAME). */
export const BREVO_ATTRIBUTES = {
  LANGUE: "text",
  PAGE_ORIGINE: "text",
  PROFIL: "text",
  ETABLISSEMENT: "text",
  /** Occasion choisie dans « Organiser une dégustation privée » (libellé en français). */
  OCCASION: "text",
  NEWSLETTER_CONSENTEMENT: "date",
} as const;

const FOLDER_NAME = "Site internet";

export const brevoSender = () => ({
  name: process.env.BREVO_SENDER_NAME || "Champagne de l'Aube",
  email: process.env.BREVO_SENDER_EMAIL || "contact@champagnedelaube.fr",
});

export const isBrevoConfigured = () => !!process.env.BREVO_API_KEY;

export class BrevoError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function brevo<T = unknown>(path: string, init: RequestInit & { sandbox?: boolean } = {}): Promise<T> {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new BrevoError(0, "no_key", "BREVO_API_KEY manquante");
  const base = process.env.BREVO_API_URL || "https://api.brevo.com/v3";
  const res = await fetch(base + path, {
    ...init,
    headers: {
      "api-key": key,
      accept: "application/json",
      "content-type": "application/json",
      ...(init.sandbox ? { "X-Sib-Sandbox": "drop" } : {}),
      ...init.headers,
    },
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });
  const text = await res.text();
  const body = text ? safeJson(text) : null;
  if (!res.ok) {
    const b = (body ?? {}) as { code?: string; message?: string };
    throw new BrevoError(res.status, b.code ?? "http_" + res.status, b.message ?? text.slice(0, 200));
  }
  return body as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

// ---------------------------------------------------------------------------
// E-mails transactionnels
// ---------------------------------------------------------------------------

export async function sendEmail(opts: {
  to: string;
  toName?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  /** Mode « bac à sable » : Brevo vérifie la demande sans envoyer l'e-mail. */
  sandbox?: boolean;
}) {
  return brevo<{ messageId: string }>("/smtp/email", {
    method: "POST",
    sandbox: opts.sandbox,
    body: JSON.stringify({
      sender: brevoSender(),
      to: [{ email: opts.to, ...(opts.toName ? { name: opts.toName } : {}) }],
      ...(opts.replyTo ? { replyTo: { email: opts.replyTo } } : {}),
      subject: opts.subject,
      textContent: opts.text,
      htmlContent: opts.html ?? textToHtml(opts.text),
    }),
  });
}

/** Version HTML simple d'un texte (paragraphes, liens cliquables). */
export function textToHtml(text: string) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const linked = (s: string) => esc(s).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#8A6420">$1</a>');
  return `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#1E1E20;max-width:560px">${text
    .split(/\n{2,}/)
    .map((p) => `<p>${linked(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;
}

// ---------------------------------------------------------------------------
// Listes et attributs (créés automatiquement s'ils manquent)
// ---------------------------------------------------------------------------

type List = { id: number; name: string };
let setupPromise: Promise<Record<BrevoListKey, number>> | null = null;

/** Identifiants des 5 listes, créées si besoin. Mis en cache pour la durée de vie du serveur. */
export function getListIds(): Promise<Record<BrevoListKey, number>> {
  setupPromise ??= setup().catch((e) => {
    setupPromise = null; // on réessaiera à la prochaine demande
    throw e;
  });
  return setupPromise;
}

async function setup() {
  await ensureAttributes();
  const lists = await allLists();
  const ids = {} as Record<BrevoListKey, number>;
  let folderId: number | null = null;
  for (const [key, name] of Object.entries(BREVO_LISTS) as [BrevoListKey, string][]) {
    const found = lists.find((l) => l.name.trim().toLowerCase() === name.toLowerCase());
    if (found) {
      ids[key] = found.id;
      continue;
    }
    folderId ??= await ensureFolder();
    const created = await brevo<{ id: number }>("/contacts/lists", {
      method: "POST",
      body: JSON.stringify({ name, folderId }),
    });
    ids[key] = created.id;
  }
  return ids;
}

async function allLists(): Promise<List[]> {
  const out: List[] = [];
  for (let offset = 0; offset < 1000; offset += 50) {
    const page = await brevo<{ lists?: List[]; count?: number }>(`/contacts/lists?limit=50&offset=${offset}`);
    out.push(...(page.lists ?? []));
    if (!page.lists || page.lists.length < 50) break;
  }
  return out;
}

async function ensureFolder(): Promise<number> {
  const page = await brevo<{ folders?: { id: number; name: string }[] }>("/contacts/folders?limit=50&offset=0");
  const found = page.folders?.find((f) => f.name === FOLDER_NAME);
  if (found) return found.id;
  const created = await brevo<{ id: number }>("/contacts/folders", { method: "POST", body: JSON.stringify({ name: FOLDER_NAME }) });
  return created.id;
}

async function ensureAttributes() {
  const existing = await brevo<{ attributes?: { name: string }[] }>("/contacts/attributes");
  const names = new Set((existing.attributes ?? []).map((a) => a.name.toUpperCase()));
  for (const [name, type] of Object.entries(BREVO_ATTRIBUTES)) {
    if (names.has(name)) continue;
    try {
      await brevo(`/contacts/attributes/normal/${name}`, { method: "POST", body: JSON.stringify({ type }) });
    } catch (e) {
      // Créé entre-temps par une autre demande : sans gravité.
      if (!(e instanceof BrevoError && e.status === 400)) throw e;
    }
  }
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

/**
 * Crée ou met à jour un contact et l'ajoute aux listes indiquées (sans le retirer des autres).
 * Si Brevo refuse (liste ou attribut supprimé entre-temps), on revérifie listes et
 * attributs, puis on réessaie une fois.
 */
export async function upsertContact(opts: {
  email: string;
  fullName?: string;
  lists: BrevoListKey[];
  attributes: Partial<Record<keyof typeof BREVO_ATTRIBUTES, string>>;
  /** Consentement explicite (newsletter confirmée) : réactive un contact désinscrit auparavant. */
  reactivate?: boolean;
}) {
  const [first, ...rest] = (opts.fullName ?? "").trim().split(/\s+/);
  const attributes: Record<string, string> = {};
  if (first) attributes.FIRSTNAME = first;
  if (rest.length) attributes.LASTNAME = rest.join(" ");
  for (const [k, v] of Object.entries(opts.attributes)) if (v) attributes[k] = v;

  const send = async () => {
    const ids = await getListIds();
    return brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email: opts.email,
        attributes,
        listIds: opts.lists.map((l) => ids[l]),
        updateEnabled: true,
        ...(opts.reactivate ? { emailBlacklisted: false } : {}),
      }),
    });
  };
  try {
    return await send();
  } catch (e) {
    if (!(e instanceof BrevoError) || ![400, 404].includes(e.status)) throw e;
    setupPromise = null; // listes ou attributs à revérifier
    return send();
  }
}

// ---------------------------------------------------------------------------
// Vérification de santé (tâche planifiée hebdomadaire)
// ---------------------------------------------------------------------------

export type HealthReport = { ok: boolean; contacts: string; envoi: string; echeance: string };

/**
 * Utilise la clé (ce qui la garde active) et vérifie :
 *  1. l'accès aux contacts (lecture des listes, création des listes manquantes) ;
 *  2. l'envoi d'e-mails (en mode bac à sable : rien n'est réellement envoyé) ;
 *  3. la date d'expiration de la clé (alerte 30 jours avant).
 */
export async function brevoHealthCheck(now = new Date()): Promise<HealthReport> {
  const report: HealthReport = { ok: true, contacts: "OK", envoi: "OK", echeance: "OK" };
  try {
    setupPromise = null;
    const ids = await getListIds();
    report.contacts = `OK (${Object.keys(ids).length} listes)`;
  } catch (e) {
    report.ok = false;
    report.contacts = `ÉCHEC : ${describe(e)}`;
  }
  try {
    await sendEmail({
      to: process.env.ALERT_EMAIL || brevoSender().email,
      subject: "Vérification hebdomadaire (bac à sable, non envoyé)",
      text: "Test automatique de la clé Brevo.",
      sandbox: true,
    });
  } catch (e) {
    report.ok = false;
    report.envoi = `ÉCHEC : ${describe(e)}`;
  }
  const expires = new Date(process.env.BREVO_KEY_EXPIRES || "2027-11-18T00:00:00Z");
  const days = Math.floor((expires.getTime() - now.getTime()) / 86_400_000);
  if (days <= 30) {
    report.ok = false;
    report.echeance = days < 0 ? `La clé a expiré le ${expires.toLocaleDateString("fr-FR")}.` : `La clé expire dans ${days} jour(s), le ${expires.toLocaleDateString("fr-FR")} : à renouveler.`;
  } else {
    report.echeance = `OK (expire le ${expires.toLocaleDateString("fr-FR")}, dans ${days} jours)`;
  }
  return report;
}

export function describe(e: unknown) {
  if (e instanceof BrevoError) {
    if (e.status === 401) return "clé refusée (401) : expirée, supprimée ou incorrecte";
    if (e.status === 403) return "droits insuffisants (403) : vérifiez les permissions de la clé";
    return `${e.status} ${e.code} ${e.message}`;
  }
  return e instanceof Error ? e.message : String(e);
}
