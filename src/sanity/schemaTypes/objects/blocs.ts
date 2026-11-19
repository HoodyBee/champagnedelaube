// Briques réutilisables du Studio : hero, chiffres clés, arguments, FAQ, bloc texte + image.
import { defineArrayMember, defineField, defineType } from "sanity";
import { lineIconOptions } from "../../../lib/line-icons";
import { requireFr, warnFrLength } from "./localized";

/** Grand bandeau d'ouverture d'une page. */
export const hero = defineType({
  name: "hero",
  title: "Ouverture de page",
  type: "object",
  fields: [
    defineField({
      name: "surTitre",
      title: "Sur-titre",
      description: "Petite ligne en capitales au-dessus du titre. Ex. : Restaurants · Cavistes · Hôtels.",
      type: "localeString",
    }),
    defineField({
      name: "titre",
      title: "Titre principal (H1)",
      description: "Le seul grand titre de la page. 6 à 10 mots, avec si possible les mots que les gens tapent dans Google.",
      type: "localeString",
      validation: requireFr,
    }),
    defineField({ name: "intro", title: "Texte d'introduction", type: "localeText" }),
    defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
  ],
});

/** Bandeau de chiffres clés (ex. « ≈ 8 000 ha · le vignoble de l'Aube »). */
export const chiffre = defineType({
  name: "chiffre",
  title: "Chiffre clé",
  type: "object",
  fields: [
    defineField({
      name: "valeur",
      title: "Chiffre",
      description: "Ex. : ≈ 8 000 ha, 3 appellations, 80 %, 6 à 13. Traduit, car l'écriture des nombres change d'une langue à l'autre (8 000 / 8,000).",
      type: "localeString",
      validation: requireFr,
    }),
    defineField({ name: "label", title: "Légende", description: "Ex. : le vignoble de l'Aube, un quart du vignoble champenois.", type: "localeString", validation: requireFr }),
  ],
  preview: { select: { title: "valeur.fr", subtitle: "label.fr" } },
});

/** Argument avec picto (ex. « Tarifs directs domaine »). */
export const argument = defineType({
  name: "argument",
  title: "Argument",
  type: "object",
  fields: [
    defineField({
      name: "icone",
      title: "Picto",
      type: "string",
      options: { list: lineIconOptions.map((o) => ({ value: o.value, title: o.title })) },
    }),
    defineField({ name: "titre", title: "Titre", type: "localeString", validation: (r) => [requireFr(r), warnFrLength(40)(r)].flat() }),
    defineField({ name: "texte", title: "Texte", type: "localeText" }),
  ],
  preview: { select: { title: "titre.fr", subtitle: "icone" } },
});

/** Question fréquente (affichée en accordéon, et lue par Google). */
export const faqItem = defineType({
  name: "faqItem",
  title: "Question fréquente",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: requireFr }),
    defineField({ name: "reponse", title: "Réponse", type: "localeText", validation: requireFr }),
  ],
  preview: { select: { title: "question.fr" } },
});

/** Section texte + photo (pages terroir, offres…). */
export const blocTexte = defineType({
  name: "blocTexte",
  title: "Section texte et photo",
  type: "object",
  fields: [
    defineField({
      name: "icone",
      title: "Picto au-dessus du titre (facultatif)",
      type: "string",
      options: { list: lineIconOptions.map((o) => ({ value: o.value, title: o.title })) },
    }),
    defineField({ name: "surTitre", title: "Sur-titre", type: "localeString" }),
    defineField({ name: "titre", title: "Titre (H2)", type: "localeString", validation: requireFr }),
    defineField({ name: "texte", title: "Texte", type: "localeRichText" }),
    defineField({
      name: "points",
      title: "Points clés (liste)",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
  ],
  preview: { select: { title: "titre.fr", media: "image" } },
});

/** Champ « questions fréquentes » prêt à l'emploi. */
export const faqField = (group?: string) =>
  defineField({
    name: "faq",
    title: "Questions fréquentes",
    description: "Quelques questions-réponses courtes : elles rassurent et aident le référencement.",
    type: "array",
    group,
    of: [defineArrayMember({ type: "faqItem" })],
  });

/** Texte de l'ancien site WordPress, repris tel quel pour vous servir de base. Jamais affiché sur le site. */
export const repriseField = (group?: string) =>
  defineField({
    name: "reprise",
    title: "Texte de l'ancien site (à reprendre)",
    description:
      "Repris automatiquement depuis l'ancien site. Il n'est PAS affiché : copiez-en les passages utiles dans les champs ci-dessus (en les relisant pour la loi Évin), puis videz ce champ.",
    type: "localeRichText",
    group,
  });
