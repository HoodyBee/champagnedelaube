import { defineQuery } from "next-sanity";
import { defaultContact } from "@/lib/site";
import { sanityFetch } from "./lib/fetch";
import type { Localized } from "./lib/i18n";

export type Reglages = {
  email: string;
  telephone: string;
  instagram: string;
  ville: string;
  signature?: Localized;
  promesse?: Localized;
};

const reglagesQuery = defineQuery(`*[_id == "reglages"][0]{
  email, telephone, instagram, ville, signature, promesse
}`);

/** Réglages du site (coordonnées…), avec les valeurs par défaut si rien n'est rempli. */
export async function getReglages(): Promise<Reglages> {
  const data = await sanityFetch<Partial<Reglages>>({ query: reglagesQuery, tags: ["reglages"] });
  return {
    ...defaultContact,
    ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null && v !== "")),
  } as Reglages;
}
