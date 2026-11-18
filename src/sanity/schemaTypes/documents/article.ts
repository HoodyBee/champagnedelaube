import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/** Article (recette, accord, pédagogie). Publié à la racine du site : /mon-article/. */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: icon("book"),
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({ name: "titre", title: "Titre (H1)", type: "localeString", group: "contenu", validation: requireFr }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Donne champagnedelaube.fr/adresse/. Pour les anciens articles, garder exactement l'adresse actuelle.",
      type: "slug",
      group: "contenu",
      options: { source: "titre.fr" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rubrique",
      title: "Rubrique",
      type: "string",
      group: "contenu",
      options: {
        list: [
          { title: "Recettes & accords mets-champagne", value: "recettes" },
          { title: "Comprendre le champagne", value: "comprendre" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Date de publication", type: "date", group: "contenu", initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: "extrait", title: "Résumé (cartes et Google)", type: "localeText", group: "contenu" }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({ name: "contenu", title: "Texte de l'article", type: "localeRichText", group: "contenu" }),
    defineField({
      name: "vignerons",
      title: "Vignerons cités",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "reference", to: [{ type: "vigneron" }] })],
    }),
    defineField({
      name: "collaborationCommerciale",
      title: "Collaboration commerciale",
      description: "À cocher seulement si l'article est rémunéré ou réalisé contre des produits offerts (loi influence 2023).",
      type: "boolean",
      group: "contenu",
      initialValue: false,
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "titre.fr", rubrique: "rubrique", media: "image" },
    prepare: ({ title, rubrique, media }) => ({
      title,
      subtitle: rubrique === "recettes" ? "Recettes & accords" : rubrique === "comprendre" ? "Comprendre le champagne" : "",
      media,
    }),
  },
});
