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
export const terroirPages: { key: TerroirKey; label: string; href: AppPathname }[] = [
  { key: "cote-des-bar", label: "Côte des Bar", href: "/la-cote-des-bar" },
  { key: "les-riceys", label: "Les Riceys", href: "/les-riceys" },
  { key: "montgueux", label: "Montgueux", href: "/montgueux" },
  { key: "villenauxe", label: "Villenauxe-la-Grande", href: "/villenauxe-la-grande" },
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
  | "contact";

type NavLink = { key: NavKey; href: AppPathname };

/**
 * Menu principal, organisé par public.
 *  - Le terroir de l'Aube ▾ (page centrale + 4 terroirs)
 *  - Nos vignerons
 *  - Professionnels ▾
 *  - Entreprises & CSE
 *  - Particuliers ▾
 *  - [Contact]
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
    { key: "mariage", href: "/champagne-mariage-troyes" },
  ] satisfies NavLink[],
  contact: { key: "contact", href: "/contact" } satisfies NavLink,
};

/** Contenus éditoriaux (pied de page, et liens depuis les pages Terroir et Particuliers). */
export const contentPages: NavLink[] = [
  { key: "recettes", href: "/recettes-accords-mets-champagne" },
  { key: "toutSavoir", href: "/tout-savoir-sur-le-champagne" },
];

/** Formate un numéro français pour un lien tel: (+33…). */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.startsWith("0") ? "+33" + digits.slice(1) : "+" + digits}`;
}
