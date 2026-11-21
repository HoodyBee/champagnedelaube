import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { cepages } from "../../../lib/brand";

/**
 * Les cépages de l'appellation Champagne : une fiche par cépage (page /cepages-champagne/<cépage>/).
 * Tant que « Accroche » et « Texte de la page » sont vides, la page affiche les textes sourcés
 * rédigés dans le dépôt (src/lib/cepages-contenu.ts) ; la photo et la galerie viennent toujours d'ici.
 */
export const cepage = defineType({
  name: "cepage",
  title: "Cépage",
  type: "document",
  icon: icon("drop"),
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "cle",
      title: "Cépage",
      description: "Détermine l'adresse de la page et la pastille. Un seul document par cépage.",
      type: "string",
      group: "contenu",
      options: { list: Object.entries(cepages).map(([value, c]) => ({ title: c.label, value })) },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({
      name: "galerie",
      title: "Galerie photos",
      description: "Uniquement des photos qui montrent vraiment ce cépage (ou, à défaut, avec une légende « illustration »).",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "imageAvecAlt" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "resume",
      title: "Résumé (2 lignes)",
      description: "Affiché sur la page « Les cépages de l'appellation Champagne ».",
      type: "localeText",
      group: "contenu",
    }),
    defineField({ name: "accroche", title: "Accroche", type: "localeString", group: "contenu" }),
    defineField({
      name: "contenu",
      title: "Texte de la page",
      description: "Laissez vide pour garder les textes sourcés préparés (part dans l'AOC, l'Aube, apport, culture, histoire).",
      type: "localeRichText",
      group: "contenu",
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { cle: "cle", media: "image" },
    prepare: ({ cle, media }) => ({ title: cepages[cle as keyof typeof cepages]?.label ?? cle, media }),
  },
});
