import type { StructureBuilder, StructureResolver } from "sanity/structure";

/** Un document unique (ex. Page d'accueil), ouvert directement au clic. */
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

/** Une page fixe (document « page » repéré par sa clé), ouverte directement au clic. */
const pageFixe = (S: StructureBuilder, cle: string, title: string) =>
  S.listItem()
    .title(title)
    .id(`page-${cle}`)
    .child(S.documentList().title(title).schemaType("page").filter('_type == "page" && cle == $cle').params({ cle }));

/** Un dossier qui regroupe plusieurs entrées, comme les menus déroulants du site. */
const dossier = (S: StructureBuilder, id: string, title: string, items: ReturnType<StructureBuilder["listItem"]>[]) =>
  S.listItem().title(title).id(id).child(S.list().title(title).items(items));

/**
 * Menu de gauche du Studio, avec les mêmes noms et le même ordre que le menu du site :
 * Notre Terroir · Notre sélection du moment · Dégustations privées · Vos Grands Événements ·
 * Le Mag du Champagne · Espace Pro & Entreprises · Contact et pages légales · Réglages.
 * Ce qui est masqué sur le site est rangé dans « Masqué sur le site » (rien n'est supprimé).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenus")
    .items([
      singleton(S, "accueil", "Page d'accueil"),
      S.divider(),
      dossier(S, "notre-terroir", "Notre Terroir", [
        singleton(S, "terroirAube", "Les terroirs de l'Aube (page centrale)"),
        S.documentTypeListItem("terroir").title("Côte des Bar, Les Riceys, Montgueux, Villenauxe-la-Grande"),
        S.documentTypeListItem("cepage").title("Les cépages (une fiche par cépage)"),
      ]),
      dossier(S, "notre-selection", "Notre sélection du moment", [
        pageFixe(S, "vignerons", "Page « Notre sélection du moment »"),
        S.documentTypeListItem("vigneron").title("Vignerons (fiches)"),
        S.documentTypeListItem("cuvee").title("Cuvées (« Les pépites du moment » de l'accueil)"),
      ]),
      singleton(S, "espaceParticuliers", "Dégustations privées"),
      pageFixe(S, "mariage", "Vos Grands Événements"),
      S.documentTypeListItem("evenement").title("Mes événements (calendrier)"),
      S.divider(),
      dossier(S, "le-mag", "Le Mag du Champagne", [
        S.documentTypeListItem("article").title("Articles"),
        S.documentTypeListItem("journeeCalendrier").title("Marronnier : journées du calendrier"),
        S.documentTypeListItem("rubrique").title("Rubriques (pour en ajouter ou les renommer)"),
        S.documentTypeListItem("etiquetteArticle").title("Thèmes"),
        pageFixe(S, "tout-savoir", "Page « Tout savoir sur le champagne »"),
        pageFixe(S, "recettes", "Page « Accords mets et champagne »"),
      ]),
      dossier(S, "espace-pro-entreprises", "Espace Pro & Entreprises", [
        singleton(S, "espacePro", "Restaurants, cavistes, hôtels"),
        singleton(S, "espaceEntreprises", "Entreprises & CSE"),
        pageFixe(S, "pro-vignerons", "Vignerons : devenez partenaire"),
        pageFixe(S, "communication", "Communication & marketing"),
      ]),
      S.divider(),
      dossier(S, "contact-legal", "Contact et pages légales", [
        pageFixe(S, "contact", "Contact"),
        pageFixe(S, "qui-suis-je", "Page Qui suis-je"),
        pageFixe(S, "mentions-legales", "Mentions légales"),
        pageFixe(S, "confidentialite", "Politique de confidentialité"),
      ]),
      S.documentTypeListItem("page").title("Toutes les pages fixes"),
      singleton(S, "reglages", "Réglages du site"),
      S.divider(),
      dossier(S, "masque", "Masqué sur le site (conservé)", [
        S.documentTypeListItem("experience").title("Formats de dégustation (masqués : offre unique de dégustations privées)"),
        S.documentTypeListItem("partenaire").title("Partenaires « Où trouver nos pépites ? » (page masquée tant que l'interrupteur des Réglages est éteint)"),
        pageFixe(S, "pepites", "Page « Où trouver nos pépites ? »"),
      ]),
    ]);
