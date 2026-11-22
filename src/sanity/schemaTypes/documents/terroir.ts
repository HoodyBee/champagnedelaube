import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { cepages, terroirs } from "../../../lib/brand";

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
      title: "Accroche (facultatif)",
      description: "Une question ou un fait étonnant, affiché sous le titre. Laissez vide si vous utilisez plutôt l'encadré « Le saviez-vous ? ».",
      type: "localeString",
      group: "contenu",
    }),
    defineField({
      name: "anecdote",
      title: "Le saviez-vous ? (facultatif)",
      description: "Une anecdote courte, affichée dans un encadré à côté du texte (sous le texte sur mobile).",
      type: "localeText",
      group: "contenu",
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
    defineField({ name: "sols", title: "Sols et géologie", type: "localeText", group: "contenu" }),
    defineField({
      name: "cepagesMajoritaires",
      title: "Cépages majoritaires",
      description:
        "Ceux qui couvrent l'essentiel du vignoble (ex. : pinot noir pour la Côte des Bar, chardonnay pour Montgueux). Les autres cépages ci-dessous s'affichent à part, comme « autres cépages cultivés ».",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "string" })],
      options: { list: Object.entries(cepages).map(([value, c]) => ({ title: c.label, value })) },
    }),
    defineField({
      name: "cepagesDominants",
      title: "Cépages cultivés",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "string" })],
      options: { list: Object.entries(cepages).map(([value, c]) => ({ title: c.label, value })) },
    }),
    defineField({
      name: "secteurs",
      title: "Secteurs (facultatif)",
      description: "Ex. pour la Côte des Bar : le Barséquanais et le Barsuraubois.",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "blocTexte" })],
    }),
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
