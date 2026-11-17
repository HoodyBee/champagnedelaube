import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { terroirs } from "../../../lib/brand";
import { requireFr } from "../objects/localized";

/** Les 4 terroirs de l'Aube. Leur adresse (URL) et leur couleur sont fixées par le site. */
export const terroir = defineType({
  name: "terroir",
  title: "Terroir",
  type: "document",
  icon: icon("pin"),
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "cle",
      title: "Terroir",
      description: "Détermine l'adresse de la page et la couleur du brand book. Un seul document par terroir.",
      type: "string",
      group: "contenu",
      options: {
        list: Object.entries(terroirs).map(([value, t]) => ({ title: t.label, value })),
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom(async (value, ctx) => {
          if (!value) return true;
          const id = ctx.document?._id.replace(/^drafts\./, "");
          const count = await ctx
            .getClient({ apiVersion: "2026-11-01" })
            .fetch<number>(
              `count(*[_type == "terroir" && cle == $value && !(_id in [$id, "drafts." + $id])])`,
              { value, id },
            );
          return count === 0 ? true : "Ce terroir a déjà sa fiche.";
        }),
    }),
    defineField({
      name: "nom",
      title: "Nom affiché",
      description: "Les noms de lieux ne se traduisent pas.",
      type: "string",
      group: "contenu",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accroche",
      title: "Accroche",
      description: "Une question ou un fait étonnant.",
      type: "localeString",
      group: "contenu",
      validation: requireFr,
    }),
    defineField({ name: "intro", title: "Introduction", type: "localeText", group: "contenu" }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({
      name: "chiffres",
      title: "Repères",
      description: "Quelques repères courts. Ex. : « Hectares : [À COMPLÉTER] », « Cépage principal : pinot noir ».",
      type: "array",
      group: "contenu",
      of: [
        defineArrayMember({
          type: "object",
          name: "repere",
          fields: [
            defineField({ name: "label", title: "Intitulé", type: "localeString" }),
            defineField({ name: "valeur", title: "Valeur", type: "localeString" }),
          ],
          preview: { select: { title: "label.fr", subtitle: "valeur.fr" } },
        }),
      ],
    }),
    defineField({
      name: "villages",
      title: "Villages",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({ name: "contenu", title: "Texte de la page", type: "localeRichText", group: "contenu" }),
    defineField({
      name: "galerie",
      title: "Galerie photos",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "imageAvecAlt" })],
      options: { layout: "grid" },
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "nom", subtitle: "accroche.fr", media: "image" } },
});
