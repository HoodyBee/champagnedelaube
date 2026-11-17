import { accueil } from "./documents/accueil";
import { evenement } from "./documents/evenement";
import { offre } from "./documents/offre";
import { page } from "./documents/page";
import { reglages } from "./documents/reglages";
import { terroir } from "./documents/terroir";
import { vigneron } from "./documents/vigneron";
import { imageAvecAlt } from "./objects/imageAvecAlt";
import { lieu } from "./objects/lieu";
import { localeRichText, localeString, localeText } from "./objects/localized";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";

export const schemaTypes = [
  // Documents
  reglages,
  accueil,
  page,
  terroir,
  vigneron,
  offre,
  evenement,
  // Briques
  localeString,
  localeText,
  localeRichText,
  richText,
  imageAvecAlt,
  seo,
  lieu,
];

/** Documents uniques : un seul exemplaire, impossible à supprimer ou dupliquer. */
export const singletonTypes = new Set(["reglages", "accueil"]);
