import type { StaticPathname as AppPathname } from "@/i18n/routing";
import type { TerroirKey } from "./brand";

/** Coordonnées par défaut, utilisées tant que les « Réglages du site » ne sont pas remplis dans Sanity. */
export const defaultContact = {
  email: "contact@champagnedelaube.fr",
  telephone: "06 50 96 45 59",
  instagram: "champagnedelaube",
  ville: "Troyes",
};

/** Terroirs : clé du brand book (couleur, picto) -> adresse de la page. */
export const terroirPages: { key: TerroirKey; label: string; href: AppPathname }[] = [
  { key: "cote-des-bar", label: "Côte des Bar", href: "/la-cote-des-bar" },
  { key: "les-riceys", label: "Les Riceys", href: "/les-riceys" },
  { key: "montgueux", label: "Montgueux", href: "/montgueux" },
  { key: "villenauxe", label: "Villenauxe", href: "/villenauxe-la-grande" },
];

/** Clés des textes de navigation (messages/*.json, rubrique "nav"). */
export type NavKey =
  | "vignerons"
  | "tasting"
  | "proChr"
  | "proCse"
  | "proVignerons"
  | "recettes"
  | "toutSavoir"
  | "contact";

export const proPages: { key: NavKey; href: AppPathname }[] = [
  { key: "proChr", href: "/champagne-hotel-restaurants-et-cavistes" },
  { key: "proCse", href: "/cse-et-cadeaux-dentreprise" },
  { key: "proVignerons", href: "/vignerons-de-laube-devenez-partenaire-de-nos-degustations" },
];

export const contentPages: { key: NavKey; href: AppPathname }[] = [
  { key: "recettes", href: "/recettes-accords-mets-champagne" },
  { key: "toutSavoir", href: "/tout-savoir-sur-le-champagne" },
];

/** Formate un numéro français pour un lien tel: (+33…). */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.startsWith("0") ? "+33" + digits.slice(1) : "+" + digits}`;
}
