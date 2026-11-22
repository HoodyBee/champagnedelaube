import { getPageContent } from "@/sanity/content";

/**
 * La page « Qui suis-je ? » existe-t-elle pour le public ? Oui seulement quand Julien a PUBLIÉ
 * le document « Page Qui suis-je » dans le Studio (un brouillon ne compte pas : le site ne lit
 * que les documents publiés). Tant que ce n'est pas le cas : page introuvable, hors du plan du
 * site, et aucun lien n'y mène (pied de page, Dégustations privées, Contact).
 */
export async function quiSuisJePubliee() {
  const p = await getPageContent("qui-suis-je", "fr");
  return !!(p.titre && p.contenu?.length);
}
