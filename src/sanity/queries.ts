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
};

const reglagesQuery = defineQuery(`*[_id == "reglages"][0]{
  email, ville, telephone, afficherTelephone, instagramUrl, facebookUrl, linkedinUrl, signature
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
