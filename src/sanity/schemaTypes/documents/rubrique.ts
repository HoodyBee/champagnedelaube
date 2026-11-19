import { defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/**
 * Rubrique du Mag. Trois rubriques existent déjà sur le site sans rien créer ici :
 * « Tout savoir sur le champagne » (code tout-savoir), « Accords mets & champagne »
 * (code accords) et « Portraits de vignerons » (code portraits). Créez une rubrique
 * ici pour en ajouter une nouvelle, ou pour renommer l'une des trois (même code).
 */
export const rubrique = defineType({
  name: "rubrique",
  title: "Rubrique du Mag",
  type: "document",
  icon: icon("tag"),
  fields: [
    defineField({ name: "titre", title: "Nom de la rubrique", type: "localeString", validation: requireFr }),
    defineField({
      name: "cle",
      title: "Code",
      description: "Court, sans espace ni accent (ex. : portraits, terroirs). Ne plus le changer une fois publié.",
      type: "slug",
      options: { source: "titre.fr" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description (facultatif)", type: "localeText" }),
    defineField({ name: "ordre", title: "Ordre d'affichage", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre", name: "ordre", by: [{ field: "ordre", direction: "asc" }] }],
  preview: { select: { title: "titre.fr", subtitle: "cle.current" } },
});
