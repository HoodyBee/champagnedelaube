import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { faqField } from "../objects/blocs";

/** Entreprises, CSE & team building : /cse-et-cadeaux-dentreprise/ (document unique). */
export const espaceEntreprises = defineType({
  name: "espaceEntreprises",
  title: "Entreprises & CSE",
  type: "document",
  icon: icon("users"),
  groups: [
    { name: "hero", title: "Ouverture", default: true },
    { name: "offres", title: "Les 2 offres" },
    { name: "brochure", title: "Brochure CSE" },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({ name: "hero", title: "Ouverture", type: "hero", group: "hero" }),
    defineField({
      name: "coffrets",
      title: "Offre 1 : Coffrets cadeaux & offres CSE",
      type: "blocTexte",
      group: "offres",
    }),
    defineField({
      name: "animations",
      title: "Offre 2 : Animations & team building",
      type: "blocTexte",
      group: "offres",
    }),
    defineField({ name: "devisTitre", title: "Formulaire « Devis sur-mesure » : titre", type: "localeString", group: "offres" }),
    defineField({ name: "devisTexte", title: "Formulaire « Devis sur-mesure » : texte", type: "localeText", group: "offres" }),
    defineField({
      name: "brochure",
      title: "Brochure CSE (PDF)",
      description:
        "Téléversez la brochure : elle sera proposée au téléchargement après le formulaire. Tant qu'elle est vide, la demande vous arrive simplement par e-mail.",
      type: "file",
      options: { accept: "application/pdf" },
      group: "brochure",
    }),
    defineField({ name: "brochureTitre", title: "Formulaire « Brochure CSE » : titre", type: "localeString", group: "brochure" }),
    defineField({ name: "brochureTexte", title: "Formulaire « Brochure CSE » : texte", type: "localeText", group: "brochure" }),
    faqField("faq"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Entreprises & CSE" }) },
});
