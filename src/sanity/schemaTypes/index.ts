import { accueil } from "./documents/accueil";
import { article } from "./documents/article";
import { cepage } from "./documents/cepage";
import { cuvee } from "./documents/cuvee";
import { espaceEntreprises } from "./documents/espaceEntreprises";
import { espaceParticuliers } from "./documents/espaceParticuliers";
import { espacePro } from "./documents/espacePro";
import { evenement } from "./documents/evenement";
import { experience } from "./documents/experience";
import { journeeCalendrier } from "./documents/journeeCalendrier";
import { page } from "./documents/page";
import { partenaire } from "./documents/partenaire";
import { reglages } from "./documents/reglages";
import { rubrique } from "./documents/rubrique";
import { etiquetteArticle } from "./documents/etiquetteArticle";
import { terroir } from "./documents/terroir";
import { terroirAube } from "./documents/terroirAube";
import { vigneron } from "./documents/vigneron";
import { argument, blocTexte, chiffre, faqItem, hero } from "./objects/blocs";
import { imageAvecAlt } from "./objects/imageAvecAlt";
import { lieu } from "./objects/lieu";
import { localeRichText, localeString, localeText } from "./objects/localized";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";

export const schemaTypes = [
  // Documents uniques
  reglages,
  accueil,
  espacePro,
  espaceEntreprises,
  espaceParticuliers,
  terroirAube,
  // Documents
  page,
  terroir,
  cepage,
  vigneron,
  cuvee,
  experience,
  evenement,
  journeeCalendrier,
  article,
  rubrique,
  etiquetteArticle,
  partenaire,
  // Briques
  localeString,
  localeText,
  localeRichText,
  richText,
  imageAvecAlt,
  seo,
  lieu,
  hero,
  chiffre,
  argument,
  faqItem,
  blocTexte,
];

/** Documents uniques : un seul exemplaire, impossible à supprimer ou dupliquer. */
export const singletonTypes = new Set([
  "reglages",
  "accueil",
  "espacePro",
  "espaceEntreprises",
  "espaceParticuliers",
  "terroirAube",
]);
