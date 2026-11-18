import { defineArrayMember, defineField, defineType } from "sanity";
import { cepages } from "../../../lib/brand";
import { icon } from "../../icons";
import { faqField } from "../objects/blocs";

/** Page centrale « Le terroir de l'Aube » : /le-terroir-de-laube/ (document unique). */
export const terroirAube = defineType({
  name: "terroirAube",
  title: "Le terroir de l'Aube",
  type: "document",
  icon: icon("earth-globe"),
  groups: [
    { name: "hero", title: "Ouverture", default: true },
    { name: "chapitres", title: "Chapitres" },
    { name: "cepages", title: "Cépages" },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({ name: "hero", title: "Ouverture", type: "hero", group: "hero" }),
    defineField({ name: "carteTitre", title: "Titre de la carte des terroirs", type: "localeString", group: "hero" }),
    defineField({ name: "carteIntro", title: "Texte sous la carte", type: "localeText", group: "hero" }),
    defineField({
      name: "chapitres",
      title: "Chapitres",
      description:
        "Sections alternées photo / texte, dans l'ordre : Situer l'Aube, Géologie (sol kimméridgien), Climat, Pinot noir… Glissez-déposez pour réordonner.",
      type: "array",
      group: "chapitres",
      of: [defineArrayMember({ type: "blocTexte" })],
    }),
    defineField({ name: "cepagesTitre", title: "Titre de la section cépages", type: "localeString", group: "cepages" }),
    defineField({ name: "cepagesIntro", title: "Introduction (dont cépages rares et anciens)", type: "localeRichText", group: "cepages" }),
    defineField({
      name: "cepagesTextes",
      title: "Texte de chaque cépage",
      description: "Une ou deux phrases par cépage, affichées sous son picto.",
      type: "array",
      group: "cepages",
      of: [
        defineArrayMember({
          type: "object",
          name: "cepageTexte",
          fields: [
            defineField({
              name: "cepage",
              title: "Cépage",
              type: "string",
              options: { list: Object.entries(cepages).map(([value, c]) => ({ title: c.label, value })) },
              validation: (r) => r.required(),
            }),
            defineField({ name: "texte", title: "Texte", type: "localeText" }),
          ],
          preview: { select: { title: "cepage", subtitle: "texte.fr" } },
        }),
      ],
    }),
    faqField("faq"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Le terroir de l'Aube" }) },
});
