import { defineQuery, type PortableTextBlock } from "next-sanity";
import { defaultActiveLocales, isLocale, locales, type Locale } from "@/i18n/routing";
import { defaultContact } from "@/lib/site";
import { sanityFetch } from "./lib/fetch";
import type { Localized } from "./lib/i18n";

export type Reglages = {
  email: string;
  ville: string;
  telephone?: string;
  afficherTelephone?: boolean;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  signature?: Localized;
  /** Interrupteur de la page « Où trouver nos pépites ? » (éteint par défaut). */
  pepitesActive?: boolean;
  /** Adresse qui reçoit les formulaires. */
  emailsFormulaires?: string;
  /** Langues proposées aux visiteurs et ouvertes à Google. */
  languesActives?: string[];
};

const reglagesQuery = defineQuery(`*[_id == "reglages"][0]{
  email, ville, telephone, afficherTelephone, instagramUrl, facebookUrl, linkedinUrl, signature, pepitesActive, emailsFormulaires, languesActives
}`);

/** Réglages du site (coordonnées, réseaux…), avec les valeurs par défaut si rien n'est rempli. */
export async function getReglages(): Promise<Reglages> {
  const data = await sanityFetch<Partial<Reglages>>({ query: reglagesQuery, tags: ["reglages"] });
  return {
    ...defaultContact,
    ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null && v !== "")),
  } as Reglages;
}

/** Langues actives (réglage Sanity), dans l'ordre du site ; le français est toujours inclus. */
export async function getActiveLocales(): Promise<Locale[]> {
  const r = await getReglages();
  const chosen = (r.languesActives ?? []).filter(isLocale);
  const set = new Set<Locale>(chosen.length ? ["fr", ...chosen] : defaultActiveLocales);
  return locales.filter((l) => set.has(l));
}

/** Adresse du catalogue PDF « Notre sélection », s'il a été téléversé dans Sanity. */
export async function getCatalogueUrl(): Promise<string | null> {
  return sanityFetch<string>({ query: defineQuery(`*[_id == "reglages"][0].catalogue.asset->url`), tags: ["reglages"] });
}

/** Liens des réseaux sociaux à afficher (LinkedIn seulement s'il est rempli). */
export type SocialLinks = { instagram?: string; facebook?: string; linkedin?: string };

export function socialLinks(r: Reglages): SocialLinks {
  return { instagram: r.instagramUrl, facebook: r.facebookUrl, linkedin: r.linkedinUrl };
}

const brochureQuery = defineQuery(`*[_id == "espaceEntreprises"][0].brochure.asset->url`);

/** Adresse du PDF de la brochure CSE, si elle a été téléversée dans Sanity. */
export async function getBrochureUrl(): Promise<string | null> {
  return sanityFetch<string>({ query: brochureQuery, tags: ["espaceEntreprises"] });
}

export type PageDoc = {
  titre?: Localized;
  surTitre?: Localized;
  intro?: Localized;
  contenu?: Localized<PortableTextBlock[]>;
  seo?: { title?: Localized; description?: Localized; noIndex?: boolean };
};

/** Une « page fixe » saisie dans le Studio (Contact, Mentions légales…), par sa clé. */
export async function getPage(cle: string): Promise<PageDoc | null> {
  return sanityFetch<PageDoc>({
    query: defineQuery(`*[_type == "page" && cle == $cle][0]{ titre, surTitre, intro, contenu, seo }`),
    params: { cle },
    tags: ["page"],
  });
}
