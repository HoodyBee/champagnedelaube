import { getPathname } from "./navigation";
import { withSlash } from "./metadata";
import { locales, routing, type Locale, type StaticPathname } from "./routing";

/**
 * Lien saisi dans un texte ou dans le Studio (/la-cote-des-bar, /en/la-cote-des-bar/, https://…)
 * -> adresse exacte dans la langue de la page (/en/la-cote-des-bar/, /en/winemakers/…).
 * Évite les redirections intermédiaires, mauvaises pour le référencement.
 */
export function lienLocalise(lien: string | undefined, locale: Locale): string | undefined {
  if (!lien) return undefined;
  if (!lien.startsWith("/") || lien.startsWith("//")) return lien;
  const [chemin, suite = ""] = lien.split(/(?=[?#])/);
  let seg = `/${chemin.replace(/^\/+|\/+$/g, "")}`;
  // Préfixe de langue déjà présent (/en/…) : on le retire, la langue de la page fait foi.
  for (const l of locales) if (seg === `/${l}` || seg.startsWith(`/${l}/`)) seg = seg.slice(l.length + 1) || "/";
  const pages = routing.pathnames as Record<string, string | Record<string, string>>;
  if (seg === "/" || seg in pages) return withSlash(getPathname({ href: seg as StaticPathname, locale })) + suite;
  // Adresse traduite saisie à la main (/winemakers) : on retrouve la page.
  const traduite = Object.entries(pages).find(([k, v]) => !k.includes("[") && typeof v !== "string" && Object.values(v).includes(seg));
  if (traduite) return withSlash(getPathname({ href: traduite[0] as StaticPathname, locale })) + suite;
  // Fiche vigneron (/vignerons/slug) ou article du Mag (/mon-article).
  const vigneron = /^\/(?:vignerons|winemakers|wijnmakers|vignaioli|winzer)\/([^/]+)$/.exec(seg);
  if (vigneron) return withSlash(getPathname({ href: { pathname: "/vignerons/[slug]", params: { slug: vigneron[1] } }, locale })) + suite;
  // Page d'un cépage (/cepages-champagne/pinot-noir, ou son adresse traduite).
  const cepage = /^\/(?:cepages-champagne|champagne-grape-varieties|champagne-druivenrassen|vitigni-champagne|champagner-rebsorten)\/([^/]+)$/.exec(seg);
  if (cepage) return withSlash(getPathname({ href: { pathname: "/cepages-champagne/[cepage]", params: { cepage: cepage[1] } }, locale })) + suite;
  if (/^\/[^/]+$/.test(seg)) return withSlash(getPathname({ href: { pathname: "/[article]", params: { article: seg.slice(1) } }, locale })) + suite;
  return withSlash(seg) + suite;
}
