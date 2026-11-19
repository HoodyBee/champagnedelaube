import type { StructureBuilder, StructureResolver } from "sanity/structure";

/** Un document unique (ex. Page d'accueil), ouvert directement au clic. */
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

// Organisation du menu de gauche du Studio, dans l'ordre du site.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenus")
    .items([
      singleton(S, "accueil", "Page d'accueil"),
      S.divider(),
      singleton(S, "espacePro", "Espace Professionnels"),
      singleton(S, "espaceEntreprises", "Entreprises & CSE"),
      singleton(S, "espaceParticuliers", "Espace Particuliers"),
      S.documentTypeListItem("experience").title("Expériences (particuliers)"),
      S.documentTypeListItem("evenement").title("Événements à venir"),
      S.divider(),
      singleton(S, "terroirAube", "Le terroir de l'Aube"),
      S.documentTypeListItem("terroir").title("Terroirs"),
      S.documentTypeListItem("vigneron").title("Vignerons"),
      S.divider(),
      S.documentTypeListItem("article").title("Le Mag : articles"),
      S.documentTypeListItem("rubrique").title("Le Mag : rubriques"),
      S.documentTypeListItem("page").title("Autres pages"),
      S.documentTypeListItem("partenaire").title("Partenaires « pépites »"),
      S.divider(),
      singleton(S, "reglages", "Réglages du site"),
    ]);
