import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/** Catégories du marronnier (« ⭐ Mes événements » = documents « Mon événement », repris automatiquement). */
export const CATEGORIES_MARRONNIER = [
  { title: "🍷 Vins / Cépages", value: "vins" },
  { title: "🍴 Gastronomie", value: "gastronomie" },
  { title: "🍸 Spiritueux / Cocktails", value: "spiritueux" },
  { title: "🌍 Grands RDV / Salons", value: "salons" },
];

/**
 * Une date du marronnier (calendrier éditorial du vin et de la gastronomie) :
 * affichée dans l'article du marronnier, dans le petit calendrier de l'accueil et dans le PDF.
 * Vos propres rendez-vous se saisissent dans « Mes événements » : ils s'ajoutent tout seuls.
 */
export const journeeCalendrier = defineType({
  name: "journeeCalendrier",
  title: "Journée du calendrier (marronnier)",
  type: "document",
  icon: icon("calendar"),
  fields: [
    defineField({ name: "titre", title: "Nom de la journée", type: "localeString", validation: requireFr }),
    defineField({
      name: "debut",
      title: "Date (ou premier jour)",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fin",
      title: "Dernier jour (si la journée dure plusieurs jours)",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (r) =>
        r.custom((fin, ctx) => {
          const debut = (ctx.document as { debut?: string } | undefined)?.debut;
          return !fin || !debut || fin >= debut ? true : "Le dernier jour doit être après le premier.";
        }),
    }),
    defineField({
      name: "categorie",
      title: "Catégorie",
      type: "string",
      options: { list: CATEGORIES_MARRONNIER, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "emoji", title: "Emoji (facultatif)", type: "string", validation: (r) => r.max(8) }),
    defineField({ name: "anecdote", title: "Anecdote courte", type: "localeText" }),
    defineField({
      name: "regle",
      title: "Règle de date (facultatif)",
      description: "Pour les journées mobiles, ex. : « 4e vendredi d'octobre ». Aide à saisir l'année suivante.",
      type: "localeString",
    }),
    defineField({
      name: "lien",
      title: "Lien (facultatif)",
      description: "Page du site (/les-cepages-de-laube/pinot-noir) ou site officiel (https://…).",
      type: "url",
      validation: (r) => r.uri({ scheme: ["http", "https"], allowRelative: true }),
    }),
    defineField({
      name: "aConfirmer",
      title: "Date à confirmer",
      description: "Cochez tant que l'organisateur n'a pas annoncé la date : la mention « à confirmer » s'affiche.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "debut", direction: "asc" }] }],
  preview: {
    select: { titre: "titre.fr", debut: "debut", emoji: "emoji", categorie: "categorie", aConfirmer: "aConfirmer" },
    prepare: ({ titre, debut, emoji, categorie, aConfirmer }) => ({
      title: [emoji, titre].filter(Boolean).join(" "),
      subtitle: [debut, CATEGORIES_MARRONNIER.find((c) => c.value === categorie)?.title, aConfirmer ? "à confirmer" : null].filter(Boolean).join(" · "),
    }),
  },
});
