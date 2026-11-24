import { getPageContent } from "@/sanity/content";

/**
 * La page « Notre démarche » (anciennement « Qui suis-je ? ») existe-t-elle pour le public ?
 * Oui seulement quand Julien a PUBLIÉ le document « Page Notre démarche » dans le Studio (un brouillon ne compte pas : le site ne lit
 * que les documents publiés). Tant que ce n'est pas le cas : page introuvable, hors du plan du
 * site, et aucun lien n'y mène (pied de page, Notre sélection du moment, Dégustations privées, Contact).
 */
export async function notreDemarchePubliee() {
  const p = await getPageContent("notre-demarche", "fr");
  return !!(p.titre && p.contenu?.length);
}
