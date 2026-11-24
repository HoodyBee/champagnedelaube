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

/**
 * Indexation : les pages ne sont proposées à Google que sur le site en ligne (Netlify, contexte
 * « production »), jamais sur les aperçus de PR. Pour forcer en local : SITE_INDEXABLE=1.
 *
 * La décision est prise À LA CONSTRUCTION (next.config.ts, variable SITE_INDEXABLE_BUILD) :
 * sur Netlify, CONTEXT n'existe que pendant la construction, pas quand une page est
 * calculée à la visite (c'était le cas de l'accueil, resté en noindex).
 * Les adresses en .netlify.app reçoivent en plus un « X-Robots-Tag: noindex » (src/proxy.ts).
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE_BUILD === "1" || process.env.SITE_INDEXABLE === "1";

/** Pages publiques : indexées, grandes images autorisées dans Google (Discover, Images). */
const INDEX: Metadata["robots"] = {
  index: true,
  follow: true,
  "max-image-preview": "large",
  googleBot: { index: true, follow: true, "max-image-preview": "large" },
};
export const NOINDEX: Metadata["robots"] = { index: false, follow: true };

/** Les langues masquées (et tout le site hors production) ne sont pas indexées par Google. */
export async function robotsFor(locale: Locale): Promise<Metadata["robots"]> {
  if (!SITE_INDEXABLE) return { index: false, follow: false };
  return (await getActiveLocales()).includes(locale) ? INDEX : NOINDEX;
}

/** Image de partage par défaut (logo sur fond champagne, 1200 × 630). */
export const IMAGE_PARTAGE_DEFAUT = "/og/champagne-de-l-aube-partage.jpg";
const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", nl: "nl_NL", it: "it_IT", de: "de_DE" };
const NOM_SITE = "Champagne de l'Aube";

/**
 * Balises de partage (Facebook, WhatsApp, LinkedIn : Open Graph ; X : Twitter Cards),
 * complètes sur chaque page : titre, description, image 1200 × 630, type, langue, nom du site, adresse.
 */
export async function partage(opts: {
  locale: Locale;
  url: string;
  title: string;
  description: string;
  image?: { og?: string; alt?: string } | null;
  type?: "website" | "article";
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
}): Promise<Pick<Metadata, "openGraph" | "twitter">> {
  const actives = await getActiveLocales();
  const image = { url: opts.image?.og || IMAGE_PARTAGE_DEFAUT, width: 1200, height: 630, alt: opts.image?.og ? (opts.image.alt ?? "") : NOM_SITE };
  const base = {
    siteName: NOM_SITE,
    locale: OG_LOCALE[opts.locale],
    alternateLocale: actives.filter((l) => l !== opts.locale).map((l) => OG_LOCALE[l]),
    url: opts.url,
    title: opts.title,
    description: opts.description,
    images: [image],
  };
  return {
    openGraph: opts.type === "article" ? { ...base, type: "article", ...opts.article } : { ...base, type: "website" },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [{ url: image.url, alt: image.alt }] },
  };
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
  seo?: { title?: string; description?: string; noIndex?: boolean; image?: string };
  title: string;
  description: string;
  /** Photo principale de la page : image de partage (Open Graph, 1200 × 630). */
  image?: { og?: string; alt?: string } | null;
  type?: "website" | "article";
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
}): Promise<Metadata> {
  const robots = opts.seo?.noIndex ? (SITE_INDEXABLE ? NOINDEX : { index: false, follow: false }) : await robotsFor(opts.locale);
  const title = titreCourt(opts.seo?.title || opts.title);
  const description = descriptionCourte(opts.seo?.description || opts.description);
  const alternates = await localizedAlternates(opts.href, opts.locale);
  const image = opts.seo?.image ? { og: opts.seo.image, alt: opts.image?.alt } : opts.image;
  return {
    title: { absolute: title },
    description,
    alternates,
    ...(await partage({ locale: opts.locale, url: SITE_URL + alternates!.canonical, title, description, image, type: opts.type, article: opts.article })),
    robots,
  };
}
