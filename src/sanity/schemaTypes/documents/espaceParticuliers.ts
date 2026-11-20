import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { formatsDegustationActifs } from "../../../lib/site";
import { faqField, repriseField } from "../objects/blocs";

/** Dégustations privées : /tasting-troyes/ (document unique). */
export const espaceParticuliers = defineType({
  name: "espaceParticuliers",
  title: "Dégustations privées",
  type: "document",
  icon: icon("heart"),
  groups: [
    { name: "hero", title: "Ouverture", default: true },
    { name: "experiences", title: "Formats (masqués sur le site)", hidden: !formatsDegustationActifs },
    { name: "evenements", title: "Événements privés (mariages, fêtes)" },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Référencement" },
    { name: "reprise", title: "Ancien site" },
  ],
  fields: [
    defineField({ name: "hero", title: "Ouverture", type: "hero", group: "hero" }),
    defineField({
      name: "chiffres",
      title: "Bandeau de chiffres clés",
      type: "array",
      group: "hero",
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "chiffre" })],
    }),
    defineField({ name: "experiencesTitre", title: "Titre de la section expériences", type: "localeString", group: "experiences", hidden: !formatsDegustationActifs }),
    defineField({
      name: "experiencesIntro",
      hidden: !formatsDegustationActifs,
      title: "Introduction de la section expériences",
      description: "Les cartes affichées sont les documents « Expérience » marqués comme visibles.",
      type: "localeText",
      group: "experiences",
    }),
    defineField({ name: "evenementsTitre", title: "Titre de la section « Prochains rendez-vous »", description: "Affichée seulement s'il y a un événement à venir.", type: "localeString", group: "experiences", hidden: !formatsDegustationActifs }),
    defineField({
      name: "evenementsPrives",
      title: "Section « Événements privés » (mariages, baptêmes, fêtes de fin d'année)",
      type: "blocTexte",
      group: "evenements",
    }),
    faqField("faq"),
    repriseField("reprise"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Dégustations privées" }) },
});
