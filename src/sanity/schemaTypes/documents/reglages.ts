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
    { name: "pages", title: "Pages" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "signature",
      title: "Signature du site",
      description: "Phrase courte affichée dans le pied de page et utilisée comme accroche par défaut.",
      type: "localeString",
      group: "general",
      initialValue: {
        fr: "Terroirs et champagnes de caractère",
        en: "Terroirs and champagnes of character",
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
      title: "Téléphone (facultatif)",
      description: "N'apparaît sur le site que si la case ci-dessous est cochée.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "afficherTelephone",
      title: "Afficher le téléphone sur le site",
      type: "boolean",
      group: "contact",
      initialValue: false,
    }),
    defineField({
      name: "instagramUrl",
      title: "Lien Instagram",
      type: "url",
      group: "contact",
      initialValue: "https://www.instagram.com/champagnedelaube/",
    }),
    defineField({
      name: "facebookUrl",
      title: "Lien Facebook",
      type: "url",
      group: "contact",
      initialValue: "https://www.facebook.com/292357553960308/",
    }),
    defineField({
      name: "linkedinUrl",
      title: "Lien LinkedIn (facultatif)",
      description: "L'icône LinkedIn ne s'affiche que si ce lien est rempli.",
      type: "url",
      group: "contact",
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
      name: "catalogue",
      title: "Catalogue « Notre sélection » (PDF)",
      description:
        "Le PDF envoyé automatiquement par e-mail quand un visiteur clique sur « Recevoir notre sélection ». Pour le changer : téléversez le nouveau fichier ici, puis Publier. Sans PDF, vous recevez la demande et vous répondez vous-même.",
      type: "file",
      group: "pages",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "languesActives",
      title: "Langues actives",
      description:
        "Langues proposées dans les sélecteurs de langue et ouvertes à Google. Une langue décochée garde ses pages et ses traductions, mais elle est masquée et hors de Google. Le français reste toujours actif.",
      type: "array",
      group: "general",
      of: [{ type: "string" }],
      options: {
        layout: "grid",
        list: [
          { title: "Français", value: "fr" },
          { title: "English", value: "en" },
          { title: "Nederlands", value: "nl" },
          { title: "Italiano", value: "it" },
          { title: "Deutsch", value: "de" },
        ],
      },
      initialValue: ["fr", "en", "nl", "it"],
    }),
    defineField({
      name: "pepitesActive",
      title: "Afficher la page « Où trouver nos pépites ? »",
      description:
        "Éteint : la page est invisible (introuvable, hors de Google et du plan du site). Allumez-le quand la carte des partenaires est prête.",
      type: "boolean",
      group: "pages",
      initialValue: false,
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
