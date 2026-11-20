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
    // Article sur les labels : le tableau comparatif (contenu et logos dans src/lib/labels.ts).
    defineArrayMember({
      name: "tableauLabels",
      title: "Tableau comparatif des labels (HVE, VDC, Terra Vitis, bio, biodynamie)",
      type: "object",
      fields: [{ name: "note", title: "Note (non affichée)", type: "string", initialValue: "Tableau des labels" }],
      preview: { prepare: () => ({ title: "🌿 Tableau comparatif des labels", subtitle: "Logos officiels, indice nature" }) },
    }),
    // Marronnier : le tableau filtrable des journées (« Journées du calendrier » + « Mes événements ») et le PDF.
    defineArrayMember({
      name: "calendrierMarronnier",
      title: "Calendrier du marronnier (tableau filtrable + PDF)",
      type: "object",
      fields: [
        {
          name: "annee",
          title: "Année affichée",
          description: "Laisser vide pour afficher toutes les dates saisies.",
          type: "number",
          validation: (rule) => rule.integer().min(2020).max(2100),
        },
      ],
      preview: {
        select: { annee: "annee" },
        prepare: ({ annee }) => ({ title: `📅 Calendrier du marronnier${annee ? ` ${annee}` : ""}`, subtitle: "Tableau filtrable et formulaire PDF" }),
      },
    }),
  ],
});
