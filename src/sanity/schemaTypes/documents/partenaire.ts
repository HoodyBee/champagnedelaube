import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";

/** Partenaire du réseau « Où trouver nos pépites ? » (restaurant, gîte, caviste…). */
export const partenaire = defineType({
  name: "partenaire",
  title: "Partenaire « Où trouver nos pépites ? » (masqué)",
  type: "document",
  icon: icon("marker"),
  fields: [
    defineField({ name: "nom", title: "Nom de l'établissement", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Restaurant", value: "restaurant" },
          { title: "Caviste", value: "caviste" },
          { title: "Hôtel", value: "hotel" },
          { title: "Gîte / chambre d'hôtes", value: "gite" },
          { title: "Épicerie fine", value: "epicerie" },
          { title: "Bar à vins", value: "bar" },
          { title: "Autre", value: "autre" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "actif", title: "Afficher sur la carte", type: "boolean", initialValue: true }),
    defineField({ name: "description", title: "Présentation courte", type: "localeText" }),
    defineField({ name: "photo", title: "Photo", type: "imageAvecAlt" }),
    defineField({ name: "adresse", title: "Adresse", type: "lieu" }),
    defineField({
      name: "position",
      title: "Position sur la carte",
      description:
        "Latitude et longitude. Astuce : dans Google Maps, clic droit sur l'établissement, puis cliquez sur les coordonnées pour les copier (ex. 48.2973, 4.0744).",
      type: "geopoint",
    }),
    defineField({ name: "siteWeb", title: "Site internet", type: "url" }),
    defineField({
      name: "vignerons",
      title: "Domaines proposés",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "vigneron" }] })],
    }),
  ],
  preview: { select: { title: "nom", subtitle: "adresse.ville", media: "photo" } },
});
