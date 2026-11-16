import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/localized";

/** Page d'accueil (document unique). */
export const accueil = defineType({
  name: "accueil",
  title: "Page d'accueil",
  type: "document",
  icon: icon("home"),
  groups: [
    { name: "hero", title: "Grande image d'ouverture", default: true },
    { name: "concept", title: "Concept" },
    { name: "parcours", title: "Les 3 parcours" },
    { name: "reassurance", title: "Réassurance" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "heroSurTitre",
      title: "Sur-titre",
      description: "Petite ligne en capitales au-dessus du titre. Ex. : Côte des Bar · Les Riceys · Montgueux · Villenauxe.",
      type: "localeString",
      group: "hero",
    }),
    defineField({
      name: "heroTitre",
      title: "Titre principal (H1)",
      description: "6 mots maximum.",
      type: "localeString",
      group: "hero",
      validation: requireFr,
    }),
    defineField({ name: "heroAccroche", title: "Accroche", type: "localeText", group: "hero" }),
    defineField({ name: "heroImage", title: "Photo d'ouverture", type: "imageAvecAlt", group: "hero" }),
    defineField({
      name: "heroVideo",
      title: "Vidéo d'ouverture (facultatif)",
      description: "Courte vidéo silencieuse en boucle (MP4, 10 Mo maximum). La photo sert d'image d'attente.",
      type: "file",
      options: { accept: "video/mp4" },
      group: "hero",
    }),
    defineField({ name: "conceptTitre", title: "Titre", type: "localeString", group: "concept" }),
    defineField({ name: "conceptTexte", title: "Texte", type: "localeRichText", group: "concept" }),
    defineField({ name: "conceptImage", title: "Photo", type: "imageAvecAlt", group: "concept" }),
    defineField({
      name: "parcours",
      title: "Parcours",
      description: "« Je veux déguster », « Je suis un professionnel », « Je suis vigneron ».",
      type: "array",
      group: "parcours",
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "parcoursItem",
          title: "Parcours",
          fields: [
            defineField({ name: "titre", title: "Titre", type: "localeString", validation: requireFr }),
            defineField({ name: "texte", title: "Texte", type: "localeText" }),
            defineField({ name: "bouton", title: "Texte du bouton", type: "localeString" }),
            defineField({
              name: "destination",
              title: "Page de destination",
              type: "string",
              options: {
                list: [
                  { title: "Dégustations à Troyes", value: "/tasting-troyes" },
                  { title: "Espace Pro : hôtels, restaurants, cavistes", value: "/champagne-hotel-restaurants-et-cavistes" },
                  { title: "Espace Pro : CSE et entreprises", value: "/cse-et-cadeaux-dentreprise" },
                  { title: "Vignerons : devenez partenaire", value: "/vignerons-de-laube-devenez-partenaire-de-nos-degustations" },
                  { title: "Vignerons partenaires", value: "/vignerons" },
                  { title: "Contact", value: "/contact" },
                ],
              },
            }),
            defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
          ],
          preview: { select: { title: "titre.fr", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "reassurance",
      title: "Points de réassurance",
      description: "Courtes phrases qui rassurent. Ex. : « Des petits comités de 6 à 13 personnes ».",
      type: "array",
      group: "reassurance",
      of: [
        defineArrayMember({
          type: "object",
          name: "reassuranceItem",
          title: "Point",
          fields: [
            defineField({ name: "titre", title: "Titre", type: "localeString", validation: requireFr }),
            defineField({ name: "texte", title: "Texte", type: "localeText" }),
          ],
          preview: { select: { title: "titre.fr" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
