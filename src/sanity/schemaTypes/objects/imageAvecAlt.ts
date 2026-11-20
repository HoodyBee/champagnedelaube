import { defineField, defineType } from "sanity";
import { warnMissingTranslations } from "./localized";

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
      validation: (rule) => [
        rule.custom((value: { fr?: string } | undefined, ctx) => {
          const parent = ctx.parent as { asset?: unknown } | undefined;
          if (parent?.asset && !value?.fr) return "Ajoutez une description en français.";
          return true;
        }),
        warnMissingTranslations(rule),
      ],
    }),
    defineField({
      name: "credit",
      title: "Crédit photo",
      description:
        "Par défaut : « © Champagne de l'Aube / Detectezmoi.com ». Pour une photo de banque d'images, indiquez l'auteur et la licence (ex. : « Photo : Jean Dupont, CC BY-SA 4.0, Wikimedia Commons ») : elle apparaîtra dans les mentions légales.",
      type: "string",
      initialValue: "© Champagne de l'Aube / Detectezmoi.com",
    }),
  ],
});
