import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { getActiveLocales } from "@/sanity/queries";
import { defaultLocale, type AppPathname, type Locale } from "./routing";

// Domaine principal SANS « www » : c'est la version que Google connaît déjà.
export const SITE_URL = "https://champagnedelaube.fr";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Adresses avec « / » final, comme tout le site (évite une redirection, ex. /en -> /en/). */
export const withSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

/**
 * Balises canonical et hreflang d'une page, à utiliser dans generateMetadata :
 *   alternates: await localizedAlternates("/vignerons", locale)
 * Seules les langues actives (réglage Sanity « Langues actives ») apparaissent dans hreflang.
 */
export async function localizedAlternates(href: AppPathname | Href, locale: Locale): Promise<Metadata["alternates"]> {
  const active = await getActiveLocales();
  const url = (l: Locale) => withSlash(getPathname({ href: href as Href, locale: l }));
  const languages: Record<string, string> = {};
  for (const l of active) languages[l] = url(l);
  languages["x-default"] = url(defaultLocale);
  return { canonical: url(locale), languages };
}

/** Les langues masquées ne sont pas indexées par Google. */
export async function robotsFor(locale: Locale): Promise<Metadata["robots"]> {
  return (await getActiveLocales()).includes(locale) ? undefined : { index: false, follow: true };
}

/**
 * Google affiche environ 60 caractères de titre : au-delà, on retire d'abord le nom du site
 * en suffixe (« | Champagne de l'Aube »), qui figure déjà dans les données structurées.
 */
export function titreCourt(titre: string): string {
  const m = /^(.*?)\s*[|·–-]\s*Champagne de l['’]Aube$/.exec(titre);
  return titre.length > 62 && m ? m[1] : titre;
}

/** Description limitée à ~160 caractères, coupée proprement à la fin d'un mot. */
export function descriptionCourte(texte: string): string {
  if (texte.length <= 160) return texte;
  const coupe = texte.slice(0, 157);
  return `${coupe.slice(0, coupe.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "")}…`;
}

/**
 * Métadonnées d'une page : les réglages « Référencement » saisis dans Sanity
 * l'emportent sur les textes par défaut. Le titre est utilisé tel quel (sans suffixe).
 */
export async function pageMetadata(opts: {
  locale: Locale;
  href: AppPathname | Href;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  title: string;
  description: string;
  /** Photo principale de la page : image de partage (Open Graph, 1200 × 630). */
  image?: { og?: string; alt?: string } | null;
}): Promise<Metadata> {
  const robots = opts.seo?.noIndex ? { index: false, follow: true } : await robotsFor(opts.locale);
  return {
    title: { absolute: titreCourt(opts.seo?.title || opts.title) },
    description: descriptionCourte(opts.seo?.description || opts.description),
    alternates: await localizedAlternates(opts.href, opts.locale),
    ...(opts.image?.og
      ? {
          openGraph: {
            title: titreCourt(opts.seo?.title || opts.title),
            description: descriptionCourte(opts.seo?.description || opts.description),
            images: [{ url: opts.image.og, width: 1200, height: 630, alt: opts.image.alt ?? "" }],
          },
          twitter: { card: "summary_large_image", images: [opts.image.og] },
        }
      : {}),
    ...(robots ? { robots } : {}),
  };
}
