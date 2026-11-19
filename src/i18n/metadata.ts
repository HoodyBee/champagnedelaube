import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { getActiveLocales } from "@/sanity/queries";
import { defaultLocale, type AppPathname, type Locale } from "./routing";

// Domaine principal SANS « www » : c'est la version que Google connaît déjà.
export const SITE_URL = "https://champagnedelaube.fr";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Balises canonical et hreflang d'une page, à utiliser dans generateMetadata :
 *   alternates: await localizedAlternates("/vignerons", locale)
 * Seules les langues actives (réglage Sanity « Langues actives ») apparaissent dans hreflang.
 */
export async function localizedAlternates(href: AppPathname | Href, locale: Locale): Promise<Metadata["alternates"]> {
  const active = await getActiveLocales();
  const url = (l: Locale) => getPathname({ href: href as Href, locale: l });
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
 * Métadonnées d'une page : les réglages « Référencement » saisis dans Sanity
 * l'emportent sur les textes par défaut. Le titre est utilisé tel quel (sans suffixe).
 */
export async function pageMetadata(opts: {
  locale: Locale;
  href: AppPathname | Href;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  title: string;
  description: string;
}): Promise<Metadata> {
  const robots = opts.seo?.noIndex ? { index: false, follow: true } : await robotsFor(opts.locale);
  return {
    title: { absolute: opts.seo?.title || opts.title },
    description: opts.seo?.description || opts.description,
    alternates: await localizedAlternates(opts.href, opts.locale),
    ...(robots ? { robots } : {}),
  };
}
