// Chargeur des images Sanity pour next/image : servies directement par le CDN de Sanity, au bon format
// (auto=format : AVIF/WebP), à la bonne largeur (srcset), qualité 80, avec le nom lisible du fichier à la fin
// de l'adresse (…/hash-2400x1600.jpg/degustation-champagne-les-riceys-2025.jpg) : meilleur pour le référencement.
// Les fichiers du site (/brand/…) gardent l'optimiseur intégré de Next.js.
export function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  return url.toString();
}

export const estImageSanity = (src: unknown) => typeof src === "string" && src.startsWith("https://cdn.sanity.io/");
