import { defineField, defineType, type Rule } from "sanity";

// Champs traduits : chaque texte existe dans les 5 langues du site — français
// (obligatoire), anglais, néerlandais, italien et allemand. Au lancement, seuls le
// français et l'anglais sont actifs : un avertissement orange signale un anglais
// manquant. Le néerlandais, l'italien et l'allemand sont rangés dans un volet replié.

const languages = [
  { id: "fr", title: "Français" },
  { id: "en", title: "Anglais" },
  { id: "nl", title: "Néerlandais" },
  { id: "it", title: "Italien" },
  { id: "de", title: "Allemand" },
] as const;

/** Langues facultatives (masquées sur le site) : volet replié, pas d'avertissement. */
const optional = new Set(["nl", "it", "de"]);

const isFilled = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : v != null;

/** Avertissement si le français est rempli mais qu'une autre langue manque. */
export const warnMissingTranslations = (rule: Rule) =>
  rule
    .custom((value: Record<string, unknown> | undefined) => {
      if (!value || !isFilled(value.fr)) return true;
      const missing = languages.filter((l) => l.id !== "fr" && !optional.has(l.id) && !isFilled(value[l.id])).map((l) => l.title);
      return missing.length === 0 ? true : `Traduction à compléter : ${missing.join(", ")}.`;
    })
    .warning();

function localizedType(
  name: string,
  title: string,
  type: "string" | "text" | "richText",
  extra: Record<string, unknown> = {},
) {
  return defineType({
    name,
    title,
    type: "object",
    validation: (rule) => warnMissingTranslations(rule as unknown as Rule) as unknown as typeof rule,
    fieldsets: [{ name: "autres", title: "Néerlandais, italien, allemand (facultatif, masqués sur le site)", options: { collapsible: true, collapsed: true } }],
    fields: languages.map((lang) =>
      defineField({
        name: lang.id,
        title: lang.title,
        type,
        ...(optional.has(lang.id) ? { fieldset: "autres" } : {}),
        ...extra,
      }),
    ),
  });
}

export const localeString = localizedType("localeString", "Texte court traduit", "string");
export const localeText = localizedType("localeText", "Texte traduit", "text", { rows: 4 });

/** Texte enrichi (paragraphes, intertitres, listes, liens) en 5 langues. */
export const localeRichText = localizedType("localeRichText", "Texte enrichi traduit", "richText");

/** Règle de validation : le français doit être rempli (et les traductions sont vérifiées). */
export const requireFr = (rule: Rule) => [
  rule.custom((value: { fr?: unknown } | undefined) =>
    value?.fr ? true : "La version française est obligatoire.",
  ),
  warnMissingTranslations(rule),
];

/** Avertissement (non bloquant) si un texte court dépasse `max` caractères en français. */
export const warnFrLength = (max: number) => (rule: Rule) => [
  rule
    .custom((value: { fr?: string } | undefined) =>
      value?.fr && value.fr.length > max
        ? `Conseil : ${max} caractères maximum (actuellement ${value.fr.length}).`
        : true,
    )
    .warning(),
  warnMissingTranslations(rule),
];
