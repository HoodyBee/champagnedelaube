// Redirections permanentes (301) des anciennes adresses du site WordPress.
// Les 10 pages et les 7 articles de l'ancien site gardent leur adresse : rien à faire.
// Ici, uniquement ce qui disparaît (catégories, étiquettes, flux, liens courts, page
// « Champagne de l'Aube »), vers la page la plus proche. Les anciens modèles Elementor
// (?elementor_library=…) affichent simplement l'accueil, dont l'adresse canonique est « / ». Liste établie à partir du
// sitemap de l'ancien site (novembre 2026).
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { ANCIEN_ARTICLE_CEPAGE } from "./lib/cepages-liens";

const r = (source: string, destination: string): Redirect => ({ source, destination, statusCode: 301 });

/** Anciennes pages -> nouvelles. */
const pages: Redirect[] = [
  r("/champagne-aube", "/le-terroir-de-laube/"),
  r("/category/la-cote-des-bar", "/la-cote-des-bar/"),
  r("/category/la-cote-des-bar/les-riceys", "/les-riceys/"),
  r("/category/la-cote-des-bar/le-barsequanais", "/la-cote-des-bar/"),
  r("/category/la-cote-des-bar/le-barsuraubois", "/la-cote-des-bar/"),
  r("/category/connaitre-le-champagne", "/tout-savoir-sur-le-champagne/"),
  r("/category/connaitre-le-champagne/accords-mets-et-champagne", "/recettes-accords-mets-champagne/"),
  r("/tag/accords-mets-et-champagne", "/recettes-accords-mets-champagne/"),
  // Toute autre catégorie, étiquette, page d'auteur, pagination ou flux : vers Le Mag.
  r("/category/:path*", "/le-mag/"),
  r("/tag/:path*", "/le-mag/"),
  r("/author/:path*", "/le-mag/"),
  r("/page/:n", "/le-mag/"),
  r("/feed", "/le-mag/"),
  r("/comments/feed", "/"),
  r("/:slug/feed", "/:slug/"),
  // Rubriques du Mag qui gardent leur adresse historique : une seule adresse, pas de doublon.
  r("/le-mag/tout-savoir", "/tout-savoir-sur-le-champagne/"),
  r("/le-mag/accords", "/recettes-accords-mets-champagne/"),
  r("/en/le-mag/tout-savoir", "/en/all-about-champagne/"),
  r("/en/le-mag/accords", "/en/champagne-food-pairing-recipes/"),
  // Étape 13 : rubriques fusionnées (Terroirs & cépages -> Tout savoir ; Œnotourisme -> Autres horizons).
  r("/le-mag/terroirs-cepages", "/tout-savoir-sur-le-champagne/"),
  r("/en/le-mag/terroirs-cepages", "/en/all-about-champagne/"),
  r("/le-mag/oenotourisme", "/le-mag/autres-horizons/"),
  r("/en/le-mag/oenotourisme", "/en/le-mag/autres-horizons/"),
  // Article remplacé par le marronnier 2027 (novembre 2026).
  r("/journees-du-champagne-et-des-cepages", "/marronnier-2027-calendrier-vin-gastronomie/"),
  r("/en/journees-du-champagne-et-des-cepages", "/en/marronnier-2027-calendrier-vin-gastronomie/"),
];

/** Liens courts WordPress (?p=123, ?page_id=456) -> adresse de l'article ou de la page. */
const ARTICLES: Record<string, string> = {
  "1798": "agneau-orange-champagne-meunier-recette-paques",
  "1777": "champagne-labels-et-certifications",
  "1744": "accords-mets-et-vin-pates-au-pesto-au-basilic",
  "1583": "champagne-sushis",
  "1554": "aumonieres-de-boudin-blanc-aux-pommes-champagne",
  "1477": "limportance-accords-mets-et-champagnes",
  "1471": "quest-ce-quun-cepage-comprendre-la-base-du-vin-et-du-champagne",
};
const PAGES: Record<string, string> = {
  "1922": "tasting-troyes",
  "1908": "vignerons-de-laube-devenez-partenaire-de-nos-degustations",
  "1893": "cse-et-cadeaux-dentreprise",
  "1879": "champagne-hotel-restaurants-et-cavistes",
  "1600": "recettes-accords-mets-champagne",
  "1497": "tout-savoir-sur-le-champagne",
  "1444": "villenauxe-la-grande",
  "1422": "montgueux",
  "1381": "la-cote-des-bar",
  "540": "le-terroir-de-laube",
};
const liensCourts: Redirect[] = [
  ...Object.entries(ARTICLES).map(([id, slug]) => ({
    source: "/",
    has: [{ type: "query" as const, key: "p", value: id }],
    destination: `/${slug}/`,
    statusCode: 301 as const,
  })),
  ...Object.entries(PAGES).map(([id, slug]) => ({
    source: "/",
    has: [{ type: "query" as const, key: "page_id", value: id }],
    destination: `/${slug}/`,
    statusCode: 301 as const,
  })),
];

/** Étape 13 : chaque cépage a sa page ; les anciens articles du Mag y redirigent directement (FR et EN, sans chaîne). */
const cepages: Redirect[] = Object.entries(ANCIEN_ARTICLE_CEPAGE).flatMap(([cle, slug]) => [
  r(`/${slug}`, `/cepages-champagne/${cle}/`),
  r(`/en/${slug}`, `/en/champagne-grape-varieties/${cle}/`),
]);

export const redirections: Redirect[] = [...pages, ...cepages, ...liensCourts];
