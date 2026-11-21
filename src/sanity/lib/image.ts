import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId: projectId || "a-configurer", dataset });

/** Construit l'URL d'une image Sanity (redimensionnée et recadrée selon le point d'intérêt). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/**
 * Image de partage (Facebook, WhatsApp, LinkedIn, X) : 1200 × 630, recadrée sur le point d'intérêt,
 * toujours en JPEG (certains réseaux lisent mal le WebP ou l'AVIF).
 */
export function urlPartage(source: SanityImageSource) {
  return builder.image(source).width(1200).height(630).fit("crop").format("jpg").quality(80).url();
}
