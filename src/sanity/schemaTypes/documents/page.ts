import { icon } from "../../icons";
import { defineField, defineType } from "sanity";
import { faqField } from "../objects/blocs";
import { requireFr } from "../objects/localized";

/** Pages fixes du site. L'adresse (URL) est fixée par le site pour préserver le référencement. */
export const pagesFixes = [
  { title: "Notre sélection du moment", value: "vignerons" },
  { title: "Vignerons : devenez partenaire", value: "pro-vignerons" },
  { title: "Communication & marketing (photo de la page)", value: "communication" },
  { title: "Vos Grands Événements (champagne pour mariage)", value: "mariage" },
  { title: "Accords mets et champagne (rubrique du Mag)", value: "recettes" },
  { title: "Tout savoir sur le champagne (rubrique du Mag)", value: "tout-savoir" },
  { title: "Où trouver nos pépites ? (masquée)", value: "pepites" },
  { title: "Contact", value: "contact" },
  { title: "Mentions légales", value: "mentions-legales" },
  { title: "Politique de confidentialité", value: "confidentialite" },
];

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: icon("document-text"),
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "cle",
      title: "Quelle page ?",
      type: "string",
      group: "contenu",
      options: { list: pagesFixes },
      validation: (rule) =>
        rule.required().custom(async (value, ctx) => {
          if (!value) return true;
          const id = ctx.document?._id.replace(/^drafts\./, "");
          const count = await ctx
            .getClient({ apiVersion: "2026-11-01" })
            .fetch<number>(
              `count(*[_type == "page" && cle == $value && !(_id in [$id, "drafts." + $id])])`,
              { value, id },
            );
          return count === 0 ? true : "Cette page existe déjà.";
        }),
    }),
    defineField({
      name: "surTitre",
      title: "Sur-titre",
      description: "Petite ligne en capitales au-dessus du titre.",
      type: "localeString",
      group: "contenu",
    }),
    defineField({
      name: "titre",
      title: "Titre de la page (H1)",
      description: "6 mots maximum.",
      type: "localeString",
      group: "contenu",
      validation: requireFr,
    }),
    defineField({ name: "intro", title: "Introduction", type: "localeText", group: "contenu" }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({ name: "contenu", title: "Texte de la page", type: "localeRichText", group: "contenu" }),
    defineField({
      name: "collaborationCommerciale",
      title: "Collaboration commerciale",
      description: "À cocher si le contenu de la page est rémunéré (loi influence 2023).",
      type: "boolean",
      group: "contenu",
      initialValue: false,
    }),
    faqField("contenu"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "titre.fr", cle: "cle" },
    prepare: ({ title, cle }) => ({
      title: title ?? "Sans titre",
      subtitle: pagesFixes.find((p) => p.value === cle)?.title,
    }),
  },
});
