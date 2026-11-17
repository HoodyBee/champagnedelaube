import { defineField, defineType } from "sanity";

/** Image avec texte alternatif traduit (accessibilité et référencement). */
export const imageAvecAlt = defineType({
  name: "imageAvecAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  description:
    "Photo vraie, lumineuse et habitée (vignerons, mains, villages, plats). Évitez la flûte seule sur une table et les photos de banque d'images.",
  fields: [
    defineField({
      name: "alt",
      title: "Description de l'image (texte alternatif)",
      description:
        "Décrivez simplement ce que montre la photo, comme à quelqu'un qui ne la voit pas. Ex. : « Corinne Moutard dans ses vignes à Polisy ».",
      type: "localeString",
      validation: (rule) =>
        rule.custom((value: { fr?: string } | undefined, ctx) => {
          const parent = ctx.parent as { asset?: unknown } | undefined;
          if (parent?.asset && !value?.fr) return "Ajoutez une description en français.";
          return true;
        }),
    }),
    defineField({
      name: "credit",
      title: "Crédit photo",
      description: "Facultatif. Ex. : © Prénom Nom.",
      type: "string",
    }),
  ],
});
