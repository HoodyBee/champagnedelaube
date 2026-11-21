import type { Locale } from "@/i18n/routing";
import { typoFrValeur } from "@/lib/typo";

/** Champ traduit tel qu'il est stocké dans Sanity : { fr, en, nl, it }. */
export type Localized<T = string> = Partial<Record<Locale, T>>;

/**
 * Renvoie la version d'un champ dans la langue demandée.
 * Si elle n'est pas encore rédigée : anglais, puis français (langue de référence).
 */
export function localize<T>(value: Localized<T> | null | undefined, locale: Locale): T | undefined {
  if (!value) return undefined;
  const v = value[locale] ?? value.en ?? value.fr;
  // Français : espaces insécables avant la ponctuation haute (affichage seulement, rien n'est modifié dans Sanity).
  return locale === "fr" && v !== undefined && (value[locale] !== undefined || value.en === undefined) ? typoFrValeur(v) : v;
}
