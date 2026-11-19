import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { defaultLocale, indexedLocales, type AppPathname, type Locale } from "./routing";

// Domaine principal SANS « www » : c'est la version que Google connaît déjà.
export const SITE_URL = "https://champagnedelaube.fr";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Balises canonical et hreflang d'une page, à utiliser dans generateMetadata :
 *   alternates: localizedAlternates("/vignerons", locale)
 * Seules les langues publiées (indexedLocales) apparaissent dans hreflang.
 */
export function localizedAlternates(
  href: AppPathname | Href,
  locale: Locale,
): Metadata["alternates"] {
  const url = (l: Locale) => getPathname({ href: href as Href, locale: l });
  const languages: Record<string, string> = {};
  for (const l of indexedLocales) languages[l] = url(l);
  languages["x-default"] = url(defaultLocale);
  return { canonical: url(locale), languages };
}

/** Les langues non publiées ne sont pas indexées par Google. */
export function robotsFor(locale: Locale): Metadata["robots"] {
  return indexedLocales.includes(locale) ? undefined : { index: false, follow: true };
}

/**
 * Métadonnées d'une page : les réglages « Référencement » saisis dans Sanity
 * l'emportent sur les textes par défaut. Le titre est utilisé tel quel (sans suffixe).
 */
export function pageMetadata(opts: {
  locale: Locale;
  href: AppPathname | Href;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  title: string;
  description: string;
}): Metadata {
  const robots = opts.seo?.noIndex ? { index: false, follow: true } : robotsFor(opts.locale);
  return {
    title: { absolute: opts.seo?.title || opts.title },
    description: opts.seo?.description || opts.description,
    alternates: localizedAlternates(opts.href, opts.locale),
    ...(robots ? { robots } : {}),
  };
}
