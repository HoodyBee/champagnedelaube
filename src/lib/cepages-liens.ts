import type { CepageKey } from "./brand";

/**
 * Anciennes adresses des articles du Mag consacrés aux cépages. Depuis l'étape 13, chaque cépage
 * a sa propre page (/cepages-champagne/<cépage>/) : ces adresses y redirigent (301).
 */
export const ANCIEN_ARTICLE_CEPAGE: Partial<Record<CepageKey, string>> = {
  "pinot-noir": "pinot-noir-champagne",
  meunier: "meunier-cepage-champagne",
  chardonnay: "chardonnay-champagne",
  "pinot-blanc": "pinot-blanc-champagne",
  "pinot-gris": "pinot-gris-fromenteau-champagne",
  arbane: "arbane-cepage-champagne",
  "petit-meslier": "petit-meslier-cepage-champagne",
  "chardonnay-rose": "chardonnay-rose-champagne",
};

/** Ancien article général « Qu'est-ce qu'un cépage ? », redirigé vers la page générale. */
export const ANCIEN_ARTICLE_CEPAGES_GENERAL = "quest-ce-quun-cepage";
