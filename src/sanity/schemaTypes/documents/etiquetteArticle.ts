import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/**
 * Étiquette d'article (à ne pas confondre avec les étiquettes des photos de la Médiathèque).
 * Un article peut en avoir plusieurs. Chaque étiquette a sa section sur la page d'accueil du Mag
 * (masquée tant qu'aucun article publié ne la porte). L'adresse de l'article ne change pas.
 */
export const etiquetteArticle = defineType({
  name: "etiquetteArticle",
  title: "Étiquette d'article",
  type: "document",
  icon: icon("tag"),
  fields: [
    defineField({ name: "nom", title: "Nom de l'étiquette", type: "localeString", validation: requireFr }),
    defineField({
      name: "cle",
      title: "Code",
      description: "Court, sans espace ni accent (ex. : marketing). Sert d'ancre dans Le Mag (/le-mag/#marketing). Ne plus le changer une fois publié.",
      type: "slug",
      options: { source: "nom.fr" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Courte phrase d'introduction", type: "localeText" }),
    defineField({ name: "ordre", title: "Ordre d'affichage", description: "Les étiquettes s'affichent dans Le Mag de la plus petite à la plus grande valeur.", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: { select: { title: "nom.fr", subtitle: "cle.current" } },
});
