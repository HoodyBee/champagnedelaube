import { icon } from "../../icons";
import { defineField, defineType } from "sanity";
import { requireFr } from "../objects/localized";

/** Rendez-vous ponctuel, avec formulaire d'inscription. */
export const evenement = defineType({
  name: "evenement",
  title: "Événement",
  type: "document",
  icon: icon("calendar"),
  fields: [
    defineField({ name: "titre", title: "Titre", type: "localeString", validation: requireFr }),
    defineField({
      name: "slug",
      title: "Identifiant",
      description: "Cliquez sur « Generate ».",
      type: "slug",
      options: { source: "titre.fr" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "debut",
      title: "Date et heure de début",
      type: "datetime",
      options: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fin",
      title: "Date et heure de fin",
      type: "datetime",
      options: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" },
      validation: (rule) =>
        rule.custom((fin, ctx) => {
          const debut = (ctx.document as { debut?: string } | undefined)?.debut;
          return !fin || !debut || fin > debut ? true : "La fin doit être après le début.";
        }),
    }),
    defineField({ name: "lieu", title: "Lieu", type: "lieu", validation: (rule) => rule.required() }),
    defineField({
      name: "places",
      title: "Nombre de places",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "complet",
      title: "Complet",
      description: "Cochez pour fermer les inscriptions.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "prix",
      title: "Prix par personne (€)",
      description: "Laissez vide si l'événement est gratuit ou si le prix n'est pas encore fixé.",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "prixPrecision",
      title: "Précision sur le prix",
      description: "Facultatif. Ex. : « Accords mets compris ».",
      type: "localeString",
    }),
    defineField({ name: "accroche", title: "Accroche", type: "localeString" }),
    defineField({ name: "description", title: "Description", type: "localeRichText" }),
    defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
    defineField({
      name: "vignerons",
      title: "Vignerons présents",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vigneron" }] }],
    }),
    defineField({
      name: "collaborationCommerciale",
      title: "Collaboration commerciale",
      description: "À cocher si l'événement est rémunéré par un partenaire (loi influence 2023).",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo" }),
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "debut", direction: "desc" }] }],
  preview: {
    select: { title: "titre.fr", debut: "debut", ville: "lieu.ville", media: "image" },
    prepare: ({ title, debut, ville, media }) => ({
      title,
      subtitle: [
        debut ? new Date(debut).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }) : null,
        ville,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
