import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL, withSlash } from "@/i18n/metadata";
import { defaultLocale, type Locale, type StaticPathname } from "@/i18n/routing";
import { ORDRE_CEPAGES } from "@/lib/cepages-contenu";
import { terroirPages } from "@/lib/site";
import {
  getAccueil,
  getArticleLangues,
  getArticles,
  getArticleSlugs,
  getCepages,
  getEspaceEntreprises,
  getEspaceParticuliers,
  getEspacePro,
  getPageContent,
  getTerroir,
  getTerroirAube,
  getVigneronSlugs,
  PAGES_RUBRIQUE,
} from "@/sanity/content";
import type { Img } from "@/components/ui/types";
import { getActiveLocales, getReglages } from "@/sanity/queries";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Pages fixes publiées (les formats de dégustation, masqués, n'y figurent pas). */
const PAGES: StaticPathname[] = [
  "/",
  "/le-terroir-de-laube",
  "/cepages-champagne",
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
  "/communication-marketing",
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
    ...ORDRE_CEPAGES.map((cepage) => ({ pathname: "/cepages-champagne/[cepage]", params: { cepage } }) as Href),
    ...vignerons.map((slug) => ({ pathname: "/vignerons/[slug]", params: { slug } }) as Href),
    ...rubriques.map((rubrique) => ({ pathname: "/le-mag/[rubrique]", params: { rubrique } }) as Href),
    ...articles.map((article) => ({ pathname: "/[article]", params: { article } }) as Href),
  ];
  const url = (href: Href, locale: Locale) => SITE_URL + withSlash(getPathname({ href, locale }));
  // Images importantes de chaque page (plan du site des images, pour Google Images).
  const [cepagesDocs, selection, accueil, particuliers, pro, entreprises, mariage, terroirAube, ...terroirsDocs] = await Promise.all([
    getCepages(defaultLocale),
    getPageContent("vignerons", defaultLocale),
    getAccueil(defaultLocale),
    getEspaceParticuliers(defaultLocale),
    getEspacePro(defaultLocale),
    getEspaceEntreprises(defaultLocale),
    getPageContent("mariage", defaultLocale),
    getTerroirAube(defaultLocale),
    ...terroirPages.map((p) => getTerroir(p.key, defaultLocale)),
  ]);
  const src = (list: (Img | null | undefined)[]) => [...new Set(list.filter((i): i is Img => !!i).map((i) => i.src))];
  const imagesDe = new Map<string, string[]>([
    ["/", src([accueil.hero.image, accueil.degustationImage])],
    ["/tasting-troyes", src([particuliers.hero.image, particuliers.evenementsPrives.image])],
    ["/champagne-hotel-restaurants-et-cavistes", src([pro.hero.image, ...pro.profils.map((b) => b.image)])],
    ["/cse-et-cadeaux-dentreprise", src([entreprises.hero.image, entreprises.coffrets.image, entreprises.animations.image])],
    ["/champagne-mariage", src([mariage.image])],
    ["/le-terroir-de-laube", src([terroirAube.hero.image, ...terroirAube.chapitres.map((c) => c.image)])],
    ...terroirPages.map((p, i) => [p.href as string, src([terroirsDocs[i].image, ...terroirsDocs[i].galerie])] as [string, string[]]),
    ["/vignerons", src([selection.image])],
    ...cepagesDocs.map((c) => [`cepage:${c.cle}`, src([c.image, ...c.galerie])] as [string, string[]]),
    ...cartes.map((a) => [`article:${a.slug}`, src([a.image])] as [string, string[]]),
  ]);
  const cleImages = (href: Href) =>
    typeof href === "string"
      ? href
      : href.pathname === "/[article]"
        ? `article:${(href.params as { article: string }).article}`
        : href.pathname === "/cepages-champagne/[cepage]"
          ? `cepage:${(href.params as { cepage: string }).cepage}`
          : "";

  // Un article n'est listé que dans les langues où il a un texte (sinon la page affiche le français).
  const languesDe = (href: Href) => {
    const slug = typeof href === "object" && href.pathname === "/[article]" ? (href.params as { article: string }).article : null;
    return slug && langues[slug] ? locales.filter((l) => langues[slug].includes(l)) : locales;
  };
  return hrefs.flatMap((href) => {
    const ls = languesDe(href);
    const images = imagesDe.get(cleImages(href)) ?? [];
    return ls.map((locale) => ({
      url: url(href, locale),
      ...(images.length ? { images } : {}),
      alternates: {
        languages: { ...Object.fromEntries(ls.map((l) => [l, url(href, l)])), "x-default": url(href, defaultLocale) },
      },
    }));
  });
}
