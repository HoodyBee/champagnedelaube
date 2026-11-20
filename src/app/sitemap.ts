import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL, withSlash } from "@/i18n/metadata";
import { defaultLocale, type Locale, type StaticPathname } from "@/i18n/routing";
import { getArticleLangues, getArticles, getArticleSlugs, getVigneronSlugs, PAGES_RUBRIQUE } from "@/sanity/content";
import { getActiveLocales, getReglages } from "@/sanity/queries";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Pages fixes publiées (les formats de dégustation, masqués, n'y figurent pas). */
const PAGES: StaticPathname[] = [
  "/",
  "/le-terroir-de-laube",
  "/la-cote-des-bar",
  "/les-riceys",
  "/montgueux",
  "/villenauxe-la-grande",
  "/vignerons",
  "/tasting-troyes",
  "/champagne-mariage",
  "/champagne-hotel-restaurants-et-cavistes",
  "/cse-et-cadeaux-dentreprise",
  "/vignerons-de-laube-devenez-partenaire-de-nos-degustations",
  "/le-mag",
  "/tout-savoir-sur-le-champagne",
  "/recettes-accords-mets-champagne",
  "/contact",
  "/newsletter",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

/**
 * Plan du site pour Google : uniquement les langues actives (réglage Sanity), chaque
 * page avec ses équivalents dans les autres langues (hreflang).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locales, vignerons, articles, reglages, cartes, langues] = await Promise.all([
    getActiveLocales(),
    getVigneronSlugs(),
    getArticleSlugs(),
    getReglages(),
    getArticles(defaultLocale),
    getArticleLangues(),
  ]);
  // Pages de rubrique /le-mag/<code>/ : seulement celles qui ont des articles.
  const rubriques = [...new Set(cartes.flatMap((a) => a.rubriques))].filter((r) => !(r in PAGES_RUBRIQUE));
  const hrefs: Href[] = [
    ...PAGES,
    ...(reglages.pepitesActive ? (["/ou-trouver-nos-pepites"] as Href[]) : []),
    ...vignerons.map((slug) => ({ pathname: "/vignerons/[slug]", params: { slug } }) as Href),
    ...rubriques.map((rubrique) => ({ pathname: "/le-mag/[rubrique]", params: { rubrique } }) as Href),
    ...articles.map((article) => ({ pathname: "/[article]", params: { article } }) as Href),
  ];
  const url = (href: Href, locale: Locale) => SITE_URL + withSlash(getPathname({ href, locale }));
  // Un article n'est listé que dans les langues où il a un texte (sinon la page affiche le français).
  const languesDe = (href: Href) => {
    const slug = typeof href === "object" && href.pathname === "/[article]" ? (href.params as { article: string }).article : null;
    return slug && langues[slug] ? locales.filter((l) => langues[slug].includes(l)) : locales;
  };
  return hrefs.flatMap((href) => {
    const ls = languesDe(href);
    return ls.map((locale) => ({
      url: url(href, locale),
      alternates: {
        languages: { ...Object.fromEntries(ls.map((l) => [l, url(href, l)])), "x-default": url(href, defaultLocale) },
      },
    }));
  });
}
