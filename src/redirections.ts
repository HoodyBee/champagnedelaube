// Redirections permanentes (301) des anciennes adresses du site WordPress.
// Les 10 pages et les 7 articles de l'ancien site gardent leur adresse : rien à faire.
// Ici, uniquement ce qui disparaît (catégories, étiquettes, flux, liens courts, page
// « Champagne de l'Aube »), vers la page la plus proche. Les anciens modèles Elementor
// (?elementor_library=…) affichent simplement l'accueil, dont l'adresse canonique est « / ». Liste établie à partir du
// sitemap de l'ancien site (novembre 2026).
import type { Redirect } from "next/dist/lib/load-custom-routes";

const r = (source: string, destination: string): Redirect => ({ source, destination, permanent: true });

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
    permanent: true,
  })),
  ...Object.entries(PAGES).map(([id, slug]) => ({
    source: "/",
    has: [{ type: "query" as const, key: "page_id", value: id }],
    destination: `/${slug}/`,
    permanent: true,
  })),
];

export const redirections: Redirect[] = [...pages, ...liensCourts];
