import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId: projectId || "a-configurer", dataset });

/** Construit l'URL d'une image Sanity (redimensionnée et recadrée selon le point d'intérêt). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
