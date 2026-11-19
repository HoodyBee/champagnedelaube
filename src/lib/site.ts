import type { StaticPathname as AppPathname } from "@/i18n/routing";
import type { TerroirKey } from "./brand";

/** Coordonnées par défaut, utilisées tant que les « Réglages du site » ne sont pas remplis dans Sanity. */
export const defaultContact = {
  email: "contact@champagnedelaube.fr",
  ville: "Troyes",
  instagramUrl: "https://www.instagram.com/champagnedelaube/",
  facebookUrl: "https://www.facebook.com/292357553960308/",
};

/** Agence qui a réalisé le site (crédit en bas du pied de page). */
export const siteCredit = { name: "Detectezmoi.com", url: "http://www.detectezmoi.com/" };

/** Terroirs : clé du brand book (couleur, picto) -> adresse de la page. Côte des Bar en premier. */
/** `short` : nom court pour la ligne graphique de l'en-tête (« Villenauxe ») ; le nom officiel reste ailleurs. */
export const terroirPages: { key: TerroirKey; label: string; short?: string; href: AppPathname }[] = [
  { key: "cote-des-bar", label: "Côte des Bar", href: "/la-cote-des-bar" },
  { key: "les-riceys", label: "Les Riceys", href: "/les-riceys" },
  { key: "montgueux", label: "Montgueux", href: "/montgueux" },
  { key: "villenauxe", label: "Villenauxe-la-Grande", short: "Villenauxe", href: "/villenauxe-la-grande" },
];

/** Clés des textes de navigation (messages/*.json, rubrique "nav"). */
export type NavKey =
  | "terroirHub"
  | "vignerons"
  | "pro"
  | "proChr"
  | "proVignerons"
  | "entreprises"
  | "particuliers"
  | "tasting"
  | "mariage"
  | "recettes"
  | "toutSavoir"
  | "mag"
  | "proEntreprises"
  | "contact";

type NavLink = { key: NavKey; href: AppPathname };

/**
 * Menu principal :
 *  - Les Terroirs Aubois ▾ (page centrale + 4 terroirs)
 *  - Notre Sélection
 *  - Nos Dégustations ▾ (Nos Dégustations, Vos Grands Événements)
 *  - Le Mag
 *  - Espace Pro & Entreprises ▾ (à droite : Professionnels, Entreprises & CSE, Vignerons)
 *  - [Contact]
 * Les URL historiques ne changent pas.
 */
export const nav = {
  terroirHub: { key: "terroirHub", href: "/le-terroir-de-laube" } satisfies NavLink,
  vignerons: { key: "vignerons", href: "/vignerons" } satisfies NavLink,
  pro: [
    { key: "proChr", href: "/champagne-hotel-restaurants-et-cavistes" },
    { key: "proVignerons", href: "/vignerons-de-laube-devenez-partenaire-de-nos-degustations" },
  ] satisfies NavLink[],
  entreprises: { key: "entreprises", href: "/cse-et-cadeaux-dentreprise" } satisfies NavLink,
  particuliers: [
    { key: "tasting", href: "/tasting-troyes" },
    { key: "mariage", href: "/champagne-mariage" },
  ] satisfies NavLink[],
  mag: { key: "mag", href: "/le-mag" } satisfies NavLink,
  contact: { key: "contact", href: "/contact" } satisfies NavLink,
};

/** Onglet « Espace Pro & Entreprises » : professionnels, entreprises, vignerons. */
export const proEntreprises: NavLink[] = [nav.pro[0], nav.entreprises, nav.pro[1]];

/** Contenus éditoriaux (pied de page, et liens depuis les pages Terroir et Particuliers). */
export const contentPages: NavLink[] = [
  { key: "recettes", href: "/recettes-accords-mets-champagne" },
  { key: "toutSavoir", href: "/tout-savoir-sur-le-champagne" },
];

/**
 * Formats de dégustation (documents « Expérience ») et rendez-vous publics : masqués.
 * L'offre est aujourd'hui une seule offre de dégustations privées sur mesure.
 * Passer à true pour les réafficher (rien n'a été supprimé).
 */
export const formatsDegustationActifs = false;

/** Formate un numéro français pour un lien tel: (+33…). */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.startsWith("0") ? "+33" + digits.slice(1) : "+" + digits}`;
}
