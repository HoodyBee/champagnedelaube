/**
 * Thèmes d'articles (dans le Studio : « Thèmes », nom technique etiquetteArticle).
 * - Les thèmes listés ici ont leur page dans Le Mag (/le-mag/theme/<code>/) et une entrée dans le menu.
 * - « Marketing » n'a pas de page dans Le Mag : il est présenté dans l'Espace Pro
 *   (bloc « Nos articles marketing » de la page Communication & marketing).
 */
export const THEMES_MAG = ["champagne-art"] as const;

export const estThemeMag = (code: string): code is (typeof THEMES_MAG)[number] => (THEMES_MAG as readonly string[]).includes(code);

/** Où mène le nom d'un thème (sous le chapeau d'un article). `null` : pas de lien. */
export function themeHref(code: string) {
  if (estThemeMag(code)) return { pathname: "/le-mag/theme/[theme]", params: { theme: code } } as const;
  if (code === "marketing") return { pathname: "/communication-marketing", hash: "etiquette-marketing" } as const;
  return null;
}
