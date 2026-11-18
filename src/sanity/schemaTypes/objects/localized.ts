import { defineField, defineType, type Rule } from "sanity";

// Champs traduits : chaque texte existe en français (obligatoire), anglais,
// néerlandais, italien et allemand. Ces trois dernières langues sont rangées dans un volet
// replié « Autres langues » pour garder le Studio simple.

const languages = [
  { id: "fr", title: "Français" },
  { id: "en", title: "Anglais" },
  { id: "nl", title: "Néerlandais" },
  { id: "it", title: "Italien" },
  { id: "de", title: "Allemand" },
] as const;

const otherLanguages: string[] = ["nl", "it", "de"];

const fieldsets = [
  {
    name: "autres",
    title: "Autres langues (néerlandais, italien, allemand)",
    options: { collapsible: true, collapsed: true },
  },
];

function localizedType(
  name: string,
  title: string,
  type: "string" | "text",
  extra: Record<string, unknown> = {},
) {
  return defineType({
    name,
    title,
    type: "object",
    fieldsets,
    fields: languages.map((lang) =>
      defineField({
        name: lang.id,
        title: lang.title,
        type,
        fieldset: otherLanguages.includes(lang.id) ? "autres" : undefined,
        ...extra,
      }),
    ),
  });
}

export const localeString = localizedType("localeString", "Texte court traduit", "string");
export const localeText = localizedType("localeText", "Texte traduit", "text", { rows: 4 });

/** Texte enrichi (paragraphes, intertitres, listes, liens) en 5 langues. */
export const localeRichText = defineType({
  name: "localeRichText",
  title: "Texte enrichi traduit",
  type: "object",
  fieldsets,
  fields: languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "richText",
      fieldset: otherLanguages.includes(lang.id) ? "autres" : undefined,
    }),
  ),
});

/** Règle de validation : le français doit être rempli. */
export const requireFr = (rule: Rule) =>
  rule.custom((value: { fr?: unknown } | undefined) =>
    value?.fr ? true : "La version française est obligatoire.",
  );

/** Avertissement (non bloquant) si un texte court dépasse `max` caractères en français. */
export const warnFrLength = (max: number) => (rule: Rule) =>
  rule
    .custom((value: { fr?: string } | undefined) =>
      value?.fr && value.fr.length > max
        ? `Conseil : ${max} caractères maximum (actuellement ${value.fr.length}).`
        : true,
    )
    .warning();
