import { icon } from "../../icons";
import { defineField, defineType } from "sanity";
import { requireFr } from "../objects/localized";

/** Réglages généraux du site (document unique). */
export const reglages = defineType({
  name: "reglages",
  title: "Réglages du site",
  type: "document",
  icon: icon("cog"),
  groups: [
    { name: "general", title: "Général", default: true },
    { name: "contact", title: "Coordonnées" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "signature",
      title: "Signature",
      type: "localeString",
      group: "general",
      initialValue: { fr: "Terroirs & émotions", en: "Terroirs & emotions" },
      validation: requireFr,
    }),
    defineField({
      name: "promesse",
      title: "Promesse",
      type: "localeString",
      group: "general",
      initialValue: {
        fr: "Faire découvrir le champagne aubois, vigneron par vigneron.",
        en: "Discover the champagnes of the Aube, one winemaker at a time.",
      },
      validation: requireFr,
    }),
    defineField({
      name: "email",
      title: "E-mail de contact",
      type: "string",
      group: "contact",
      initialValue: "contact@champagnedelaube.fr",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "telephone",
      title: "Téléphone",
      type: "string",
      group: "contact",
      initialValue: "06 50 96 45 59",
    }),
    defineField({
      name: "instagram",
      title: "Compte Instagram",
      description: "Sans le @.",
      type: "string",
      group: "contact",
      initialValue: "champagnedelaube",
    }),
    defineField({
      name: "ville",
      title: "Ville",
      type: "string",
      group: "contact",
      initialValue: "Troyes",
    }),
    defineField({
      name: "emailsFormulaires",
      title: "Adresse qui reçoit les formulaires",
      description: "Les demandes de devis, inscriptions et messages arrivent à cette adresse.",
      type: "string",
      group: "contact",
      initialValue: "contact@champagnedelaube.fr",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "seo",
      title: "Référencement par défaut",
      description: "Utilisé quand une page n'a pas ses propres réglages.",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
