import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/** Expérience pour les particuliers (atelier, accords, dégustation sur-mesure) : carte + page + formulaire de réservation. */
export const experience = defineType({
  name: "experience",
  title: "Format de dégustation (masqué sur le site)",
  type: "document",
  icon: icon("star"),
  groups: [
    { name: "carte", title: "Carte", default: true },
    { name: "details", title: "Détails" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({ name: "titre", title: "Titre", description: "Court. Ex. : L'Atelier Découverte.", type: "localeString", group: "carte", validation: requireFr }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Donne /tasting-troyes/adresse/. Cliquez sur « Generate ». À ne plus modifier une fois en ligne.",
      type: "slug",
      group: "carte",
      options: { source: "titre.fr" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "actif", title: "Afficher cette expérience", type: "boolean", group: "carte", initialValue: true }),
    defineField({
      name: "etiquette",
      title: "Étiquette sur la photo (facultatif)",
      type: "string",
      group: "carte",
      options: {
        list: [
          { title: "Nouveau", value: "nouveau" },
          { title: "Places limitées", value: "places-limitees" },
          { title: "Sur-mesure", value: "sur-mesure" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Photo de la carte (format vertical)",
      description: "Idéalement 4:5 (ex. 1600 × 2000 px). Une scène vraie : participants, mains, verres que l'on sert.",
      type: "imageAvecAlt",
      group: "carte",
    }),
    defineField({ name: "accroche", title: "Accroche (1 phrase)", type: "localeString", group: "carte" }),
    defineField({ name: "duree", title: "Durée", description: "Ex. : 1h30.", type: "localeString", group: "carte" }),
    defineField({ name: "participantsMin", title: "Participants minimum", type: "number", group: "carte", validation: (r) => r.min(1).integer() }),
    defineField({ name: "participantsMax", title: "Participants maximum", type: "number", group: "carte", validation: (r) => r.min(1).integer() }),
    defineField({ name: "lieu", title: "Lieu (affiché sur la carte)", description: "Ex. : Troyes, ou « À domicile ».", type: "localeString", group: "carte" }),
    defineField({
      name: "prixAPartirDe",
      title: "Prix « à partir de » (€ par personne)",
      description: "Facultatif. Laissez vide pour afficher « Sur demande ».",
      type: "number",
      group: "carte",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "animateur",
      title: "Animé par",
      type: "object",
      group: "carte",
      fields: [
        defineField({ name: "nom", title: "Prénom et nom", type: "string" }),
        defineField({ name: "role", title: "Rôle", description: "Ex. : fondateur de Champagne de l'Aube.", type: "localeString" }),
        defineField({ name: "photo", title: "Portrait", type: "imageAvecAlt" }),
      ],
    }),
    defineField({ name: "description", title: "Description", type: "localeRichText", group: "details" }),
    defineField({ name: "inclus", title: "Ce qui est compris", type: "array", group: "details", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "adresse", title: "Adresse précise (page de l'expérience)", type: "lieu", group: "details" }),
    defineField({
      name: "vignerons",
      title: "Vignerons dont les cuvées sont présentées",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "reference", to: [{ type: "vigneron" }] })],
    }),
    defineField({ name: "galerie", title: "Galerie", type: "array", group: "details", of: [defineArrayMember({ type: "imageAvecAlt" })], options: { layout: "grid" } }),
    defineField({ name: "ordre", title: "Ordre d'affichage", type: "number", group: "carte", initialValue: 10 }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Ordre d'affichage", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: {
    select: { title: "titre.fr", duree: "duree.fr", prix: "prixAPartirDe", media: "image", actif: "actif" },
    prepare: ({ title, duree, prix, media, actif }) => ({
      title,
      subtitle: [actif === false ? "Masquée" : null, duree, prix != null ? `dès ${prix} €` : "Sur demande"].filter(Boolean).join(" · "),
      media,
    }),
  },
});
