import "server-only";

/**
 * Adresse du siège administratif, affichée UNIQUEMENT dans les mentions légales et la politique
 * de confidentialité (pas dans le pied de page ni sur Contact). Modifiable dans le Studio
 * (Réglages > Contact > « Adresse du siège administratif ») ; cette valeur sert si le champ est vide.
 * Gardée ici (code serveur uniquement) et non dans messages/*.json, envoyés au navigateur sur toutes les pages.
 */
export const ADRESSE_SIEGE_PAR_DEFAUT = "rue Carré, 10000 Troyes";
export const adresseSiege = (saisie: string | undefined, locale: string) =>
  saisie || (locale === "fr" ? ADRESSE_SIEGE_PAR_DEFAUT : `${ADRESSE_SIEGE_PAR_DEFAUT}, France`);
