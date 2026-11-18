import { defineQuery } from "next-sanity";
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
};

const reglagesQuery = defineQuery(`*[_id == "reglages"][0]{
  email, ville, telephone, afficherTelephone, instagramUrl, facebookUrl, linkedinUrl, signature, pepitesActive, emailsFormulaires
}`);

/** Réglages du site (coordonnées, réseaux…), avec les valeurs par défaut si rien n'est rempli. */
export async function getReglages(): Promise<Reglages> {
  const data = await sanityFetch<Partial<Reglages>>({ query: reglagesQuery, tags: ["reglages"] });
  return {
    ...defaultContact,
    ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null && v !== "")),
  } as Reglages;
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
  seo?: { title?: Localized; description?: Localized; noIndex?: boolean };
};

/** Une « page fixe » saisie dans le Studio (Contact, Mentions légales…), par sa clé. */
export async function getPage(cle: string): Promise<PageDoc | null> {
  return sanityFetch<PageDoc>({
    query: defineQuery(`*[_type == "page" && cle == $cle][0]{ titre, surTitre, intro, seo }`),
    params: { cle },
    tags: ["page"],
  });
}
