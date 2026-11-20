import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr, warnFrLength } from "../objects/localized";

/**
 * Cuvée de « Notre sélection du moment ». Présentée comme une découverte (le domaine,
 * le vigneron, une courte histoire), jamais comme un produit : pas de prix.
 */
export const cuvee = defineType({
  name: "cuvee",
  title: "Cuvée (Notre sélection du moment)",
  type: "document",
  icon: icon("bottle"),
  fields: [
    defineField({ name: "nom", title: "Nom de la cuvée", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "vigneron",
      title: "Domaine",
      description: "Le domaine de la sélection qui l'élabore (sa fiche sera liée).",
      type: "reference",
      to: [{ type: "vigneron" }],
    }),
    defineField({
      name: "domaineTexte",
      title: "Domaine (si pas de fiche)",
      description: "Seulement si le domaine n'a pas encore de fiche vigneron.",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      description: "Format vertical (4:5) : la bouteille dans son décor, le vigneron, la cave. Pas de flûte seule sur une table.",
      type: "imageAvecAlt",
    }),
    defineField({
      name: "histoire",
      title: "Courte histoire",
      description: "2 à 3 phrases : la parcelle, le cépage, ce qui la rend singulière. Informer plutôt que faire rêver (loi Évin).",
      type: "localeText",
      validation: (r) => [requireFr(r), warnFrLength(280)(r)].flat(),
    }),
    defineField({
      name: "enAvant",
      title: "Afficher sur l'accueil (« Les pépites du moment »)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "ordre", title: "Ordre d'affichage", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: { select: { title: "nom", subtitle: "vigneron.nom", media: "photo" } },
});
