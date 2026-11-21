/**
 * Photos de la page Troyes (Médiathèque Sanity) : aussi utilisées par le plan du site des images.
 * Ouverture : en attendant nos propres photos de Troyes, une de nos photos de dégustation,
 * sans prétendre qu'elle montre la ville (voir docs/troyes-sources.md, « Photos »).
 */
export const PHOTOS_TROYES: Record<"hero" | "vignes" | "accord", { asset: string; fichier: string; credit?: string }> = {
  hero: { asset: "image-d2b1e368224f660494d8042582e74994e50ebbca-1807x2400-jpg", fichier: "bouteilles-champagne-degustation-privee-troyes.jpg" },
  vignes: { asset: "image-587e12618ba2f2e084e7a29a07dc47d291c618d7-1807x2400-jpg", fichier: "vignes-champagne-colombe-le-sec-2026.jpg" },
  accord: { asset: "image-ca2a3326897897027569cbcde811d059b734ac73-1350x2400-jpg", fichier: "accord-chou-creme-champagne.jpg" },
};
