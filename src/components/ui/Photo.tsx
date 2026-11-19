import type React from "react";
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
  compactMobile,
  className = "",
}: {
  image?: Img | null;
  ratio?: "4/5" | "4/3" | "3/2" | "16/9" | "1/1";
  sizes: string;
  priority?: boolean;
  /** Conservé pour compatibilité : le visuel provisoire n'affiche plus de texte. */
  placeholderLabel?: string;
  className?: string;
  /** Image d'ouverture : sur mobile, bandeau bas (16:9, un tiers de l'écran au plus) pour laisser lire le titre. */
  compactMobile?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-creme-clair ${compactMobile ? "aspect-video max-h-[33svh] w-full sm:max-h-none sm:aspect-[var(--ar)]" : ""} ${className}`}
      style={compactMobile ? ({ "--ar": ratio.replace("/", " / ") } as React.CSSProperties) : { aspectRatio: ratio }}
    >
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
