import Image from "next/image";
import type { Img } from "./types";

/**
 * Photo à angles droits (règle du brand book), recadrée au format demandé.
 * Sans image : un visuel provisoire crème clair au motif vitrail très discret.
 */
export function Photo({
  image,
  ratio = "4/5",
  sizes,
  priority,
  className = "",
}: {
  image?: Img | null;
  ratio?: "4/5" | "4/3" | "3/2" | "16/9" | "1/1";
  sizes: string;
  priority?: boolean;
  /** Conservé pour compatibilité : le visuel provisoire n'affiche plus de texte. */
  placeholderLabel?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-creme-clair ${className}`} style={{ aspectRatio: ratio }}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
      ) : (
        // Visuel provisoire sobre (motif vitrail très discret), en attendant la photo.
        <div data-photo-a-venir className="vitrail absolute inset-0 border border-filet" aria-hidden="true" />
      )}
    </div>
  );
}
