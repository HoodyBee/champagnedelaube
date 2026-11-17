import type { StructureResolver } from "sanity/structure";

// Organisation du menu de gauche du Studio.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenus")
    .items([
      S.listItem()
        .title("Page d'accueil")
        .id("accueil")
        .child(S.document().schemaType("accueil").documentId("accueil").title("Page d'accueil")),
      S.documentTypeListItem("page").title("Pages"),
      S.divider(),
      S.documentTypeListItem("terroir").title("Terroirs"),
      S.documentTypeListItem("vigneron").title("Vignerons"),
      S.divider(),
      S.documentTypeListItem("offre").title("Offres œnotourisme"),
      S.documentTypeListItem("evenement").title("Événements"),
      S.divider(),
      S.listItem()
        .title("Réglages du site")
        .id("reglages")
        .child(S.document().schemaType("reglages").documentId("reglages").title("Réglages du site")),
    ]);
