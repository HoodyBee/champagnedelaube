// Chargeur d'images de next/image.
// - Images Sanity : servies directement par le CDN de Sanity, au bon format (auto=format : AVIF/WebP),
//   à la bonne largeur (srcset), qualité 80, avec le nom lisible du fichier à la fin de l'adresse
//   (…/hash-2400x1600.jpg/degustation-champagne-les-riceys-2025.jpg) : meilleur pour le référencement.
// - Fichiers du site (/brand/…) : optimiseur intégré de Next.js.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 80));
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    return url.toString();
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 80}`;
}
