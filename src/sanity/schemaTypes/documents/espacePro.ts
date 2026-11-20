import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { faqField, repriseField } from "../objects/blocs";

/** Espace Professionnels : /champagne-hotel-restaurants-et-cavistes/ (document unique). */
export const espacePro = defineType({
  name: "espacePro",
  title: "Restaurants, cavistes, hôtels",
  type: "document",
  icon: icon("case"),
  groups: [
    { name: "hero", title: "Ouverture", default: true },
    { name: "arguments", title: "Profils et arguments" },
    { name: "portfolio", title: "Domaines" },
    { name: "formulaires", title: "Formulaires" },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Référencement" },
    { name: "reprise", title: "Ancien site" },
  ],
  fields: [
    defineField({ name: "hero", title: "Ouverture", type: "hero", group: "hero" }),
    defineField({
      name: "profils",
      title: "Profils de professionnels",
      description: "Ex. : Restaurants, Cavistes, Hôtels, Épiceries fines et traiteurs. Une photo et une phrase chacun.",
      type: "array",
      group: "arguments",
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "blocTexte" })],
    }),
    defineField({
      name: "arguments",
      title: "Les 3 arguments clés",
      description: "« Tarifs directs domaine », « Interlocuteur unique », « Dégustation sur place ».",
      type: "array",
      group: "arguments",
      validation: (r) => r.max(3),
      of: [defineArrayMember({ type: "argument" })],
    }),
    defineField({ name: "portfolioTitre", title: "Titre de la section domaines", type: "localeString", group: "portfolio" }),
    defineField({
      name: "portfolioIntro",
      title: "Introduction de la section domaines",
      description: "Les domaines affichés sont ceux dont la case « Afficher dans l'Espace Pro » est cochée (fiche Vigneron). Aucun prix n'est affiché.",
      type: "localeText",
      group: "portfolio",
    }),
    defineField({
      name: "references",
      title: "Ils nous font confiance (facultatif)",
      description: "Logos d'établissements partenaires, uniquement avec leur accord.",
      type: "array",
      group: "portfolio",
      of: [
        defineArrayMember({
          type: "object",
          name: "etablissementReference",
          fields: [
            defineField({ name: "nom", title: "Nom de l'établissement", type: "string", validation: (r) => r.required() }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
            defineField({ name: "ville", title: "Ville", type: "string" }),
          ],
          preview: { select: { title: "nom", subtitle: "ville", media: "logo" } },
        }),
      ],
    }),
    defineField({ name: "grilleTitre", title: "Formulaire « Grille tarifaire Pro » : titre", type: "localeString", group: "formulaires" }),
    defineField({ name: "grilleTexte", title: "Formulaire « Grille tarifaire Pro » : texte", type: "localeText", group: "formulaires" }),
    defineField({ name: "degustationTitre", title: "Formulaire « Dégustation dans mon établissement » : titre", type: "localeString", group: "formulaires" }),
    defineField({ name: "degustationTexte", title: "Formulaire « Dégustation dans mon établissement » : texte", type: "localeText", group: "formulaires" }),
    faqField("faq"),
    repriseField("reprise"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Restaurants, cavistes, hôtels" }) },
});
