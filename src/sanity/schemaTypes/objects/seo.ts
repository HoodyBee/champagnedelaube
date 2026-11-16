import { defineField, defineType } from "sanity";
import { warnFrLength } from "./localized";

/** Réglages de référencement d'une page (Google et réseaux sociaux). */
export const seo = defineType({
  name: "seo",
  title: "Référencement (SEO)",
  type: "object",
  options: { collapsible: true, collapsed: true },
  description:
    "Ce qui s'affiche dans Google et quand la page est partagée. Laissez vide pour utiliser le titre et l'introduction de la page.",
  fields: [
    defineField({
      name: "title",
      title: "Titre pour Google",
      description: "Environ 50 à 60 caractères. Unique pour chaque page.",
      type: "localeString",
      validation: warnFrLength(60),
    }),
    defineField({
      name: "description",
      title: "Description pour Google",
      description: "Environ 140 à 160 caractères. Donnez envie de cliquer, sans incitation à boire.",
      type: "localeText",
      validation: warnFrLength(160),
    }),
    defineField({
      name: "image",
      title: "Image de partage",
      description: "Image affichée quand la page est partagée (idéalement 1200 × 630 px).",
      type: "image",
    }),
    defineField({
      name: "noIndex",
      title: "Cacher cette page de Google",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
