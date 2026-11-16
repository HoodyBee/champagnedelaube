import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/localized";

/** Offre d'œnotourisme (dégustation, visite…), avec formulaire de demande de devis. */
export const offre = defineType({
  name: "offre",
  title: "Offre œnotourisme",
  type: "document",
  icon: icon("case"),
  fields: [
    defineField({ name: "titre", title: "Titre", type: "localeString", validation: requireFr }),
    defineField({
      name: "slug",
      title: "Identifiant",
      description: "Sert d'ancre dans la page (/tasting-troyes/#identifiant). Cliquez sur « Generate ».",
      type: "slug",
      options: { source: "titre.fr" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "actif",
      title: "Afficher cette offre",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "accroche", title: "Accroche", type: "localeString" }),
    defineField({ name: "description", title: "Description", type: "localeRichText" }),
    defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
    defineField({ name: "duree", title: "Durée", description: "Ex. : 1h30.", type: "localeString" }),
    defineField({
      name: "participantsMin",
      title: "Nombre de participants minimum",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "participantsMax",
      title: "Nombre de participants maximum",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "prix",
      title: "Prix (texte libre)",
      description: "Ex. : « À partir de … € par personne » ou « Sur devis ». Laissez vide pour ne pas afficher de prix.",
      type: "localeString",
    }),
    defineField({ name: "lieu", title: "Lieu", type: "lieu" }),
    defineField({
      name: "inclus",
      title: "Ce qui est compris",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "ordre",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 10,
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo" }),
  ],
  orderings: [{ title: "Ordre d'affichage", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: {
    select: { title: "titre.fr", subtitle: "duree.fr", media: "image", actif: "actif" },
    prepare: ({ title, subtitle, media, actif }) => ({
      title,
      subtitle: `${actif === false ? "Masquée · " : ""}${subtitle ?? ""}`,
      media,
    }),
  },
});
