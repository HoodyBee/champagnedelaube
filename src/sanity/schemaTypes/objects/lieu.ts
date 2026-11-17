import { defineField, defineType } from "sanity";

export const lieu = defineType({
  name: "lieu",
  title: "Lieu",
  type: "object",
  fields: [
    defineField({ name: "nom", title: "Nom du lieu", type: "string", description: "Ex. : nom du bar ou du domaine." }),
    defineField({ name: "adresse", title: "Adresse", type: "string" }),
    defineField({ name: "codePostal", title: "Code postal", type: "string" }),
    defineField({ name: "ville", title: "Ville", type: "string", initialValue: "Troyes" }),
    defineField({
      name: "lienCarte",
      title: "Lien vers la carte",
      description: "Facultatif : lien Google Maps ou OpenStreetMap.",
      type: "url",
    }),
  ],
});
