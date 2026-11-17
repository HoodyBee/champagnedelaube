import type { Locale } from "@/i18n/routing";

/** Champ traduit tel qu'il est stocké dans Sanity : { fr, en, nl, it }. */
export type Localized<T = string> = Partial<Record<Locale, T>>;

/**
 * Renvoie la version d'un champ dans la langue demandée.
 * Si elle n'est pas encore rédigée : anglais, puis français (langue de référence).
 */
export function localize<T>(value: Localized<T> | null | undefined, locale: Locale): T | undefined {
  if (!value) return undefined;
  return value[locale] ?? value.en ?? value.fr;
}
