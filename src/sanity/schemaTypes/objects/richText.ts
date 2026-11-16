import { defineArrayMember, defineType } from "sanity";

// Texte enrichi volontairement simple, conforme à la charte : intertitres H2/H3
// (le titre H1 est toujours le titre de la page), gras, liens et listes.
// Pas d'italique (réservé aux traductions) ni de souligné décoratif.
export const richText = defineType({
  name: "richText",
  title: "Texte enrichi",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraphe", value: "normal" },
        { title: "Intertitre", value: "h2" },
        { title: "Sous-intertitre", value: "h3" },
        { title: "Citation", value: "blockquote" },
      ],
      lists: [
        { title: "Liste à puces", value: "bullet" },
        { title: "Liste numérotée", value: "number" },
      ],
      marks: {
        decorators: [{ title: "Gras", value: "strong" }],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Lien",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Adresse du lien",
                description: "Lien externe (https://…), e-mail (mailto:…) ou page du site (/vignerons/).",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageAvecAlt" }),
  ],
});
