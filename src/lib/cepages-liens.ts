import type { CepageKey } from "./brand";

/**
 * Article du Mag consacré à chaque cépage (adresse de l'article). Les pastilles de cépage
 * deviennent des liens seulement si l'article est publié (vérifié à l'affichage).
 */
export const ARTICLE_CEPAGE: Record<CepageKey, string> = {
  "pinot-noir": "pinot-noir-champagne",
  meunier: "meunier-cepage-champagne",
  chardonnay: "chardonnay-champagne",
  "pinot-blanc": "pinot-blanc-champagne",
  "pinot-gris": "pinot-gris-fromenteau-champagne",
  arbane: "arbane-cepage-champagne",
  "petit-meslier": "petit-meslier-cepage-champagne",
  "chardonnay-rose": "chardonnay-rose-champagne",
};
