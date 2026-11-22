import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/**
 * Thème d'article (nom technique « etiquetteArticle », gardé pour ne rien casser ; à ne pas confondre
 * avec les étiquettes des photos de la Médiathèque). Un article peut en avoir plusieurs.
 * Affichés sous le chapeau de l'article. « Champagne & art » a sa page dans Le Mag (/le-mag/theme/…) ;
 * « Marketing » est présenté dans l'Espace Pro (page Communication & marketing). L'adresse de l'article ne change pas.
 */
export const etiquetteArticle = defineType({
  name: "etiquetteArticle",
  title: "Thème",
  type: "document",
  icon: icon("tag"),
  fields: [
    defineField({ name: "nom", title: "Nom du thème", type: "localeString", validation: requireFr }),
    defineField({
      name: "cle",
      title: "Code",
      description: "Court, sans espace ni accent (ex. : marketing). Sert dans l'adresse de la page du thème (ex. : /le-mag/theme/champagne-art/). Ne plus le changer une fois publié.",
      type: "slug",
      options: { source: "nom.fr" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Courte phrase d'introduction", type: "localeText" }),
    defineField({ name: "ordre", title: "Ordre d'affichage", description: "Les thèmes s'affichent de la plus petite à la plus grande valeur.", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: { select: { title: "nom.fr", subtitle: "cle.current" } },
});
