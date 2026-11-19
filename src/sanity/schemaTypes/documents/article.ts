import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/** Article du Mag (recette, accord, pédagogie, portrait). Publié à la racine du site : /mon-article/. */
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
      name: "rubriques",
      title: "Rubriques du Mag",
      description:
        "Une ou plusieurs. Sans rubrique créée dans « Rubriques du Mag », utilisez les codes prêts à l'emploi : tout-savoir, accords, portraits.",
      type: "array",
      group: "contenu",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Tout savoir sur le champagne", value: "tout-savoir" },
          { title: "Accords mets & champagne", value: "accords" },
          { title: "Portraits de vignerons", value: "portraits" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "autresRubriques",
      title: "Autres rubriques",
      description: "Les rubriques que vous avez ajoutées vous-même dans « Rubriques du Mag ».",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "reference", to: [{ type: "rubrique" }] })],
    }),
    defineField({
      name: "rubrique",
      title: "Rubrique (ancien site)",
      description: "Repris de l'ancien site. Remplacé par « Rubriques du Mag » ci-dessus.",
      type: "string",
      group: "contenu",
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
    defineField({ name: "date", title: "Date de publication", type: "date", group: "contenu", initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: "extrait", title: "Résumé (cartes et Google)", type: "localeText", group: "contenu" }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({ name: "contenu", title: "Texte de l'article", type: "localeRichText", group: "contenu" }),
    defineField({
      name: "vignerons",
      title: "Vignerons cités",
      description: "L'article s'affiche aussi sur leur fiche (« Ils en parlent dans Le Mag »).",
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
    select: { title: "titre.fr", rubriques: "rubriques", date: "date", media: "image" },
    prepare: ({ title, rubriques, date, media }) => ({
      title,
      subtitle: [date, ...(rubriques ?? [])].filter(Boolean).join(" · "),
      media,
    }),
  },
});
