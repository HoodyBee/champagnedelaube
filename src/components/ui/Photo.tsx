import type React from "react";
import { SanityImage as Image } from "@/components/ui/SanityImage";
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
  placeholder = "vitrail",
  placeholderText,
  className = "",
}: {
  image?: Img | null;
  ratio?: "4/5" | "4/3" | "3/2" | "16/9" | "1/1";
  sizes: string;
  priority?: boolean;
  /** Conservé pour compatibilité : le visuel provisoire n'affiche plus de texte. */
  placeholderLabel?: string;
  className?: string;
  /** Sans image : « vitrail » (motif décoratif) ou « sobre » (crème uni, pour un emplacement de photo principale). */
  placeholder?: "vitrail" | "sobre";
  /** Mention discrète affichée dans l'emplacement « sobre » (ex. « Photographie à venir »). */
  placeholderText?: string;
  /** Image d'ouverture : sur mobile et tablette, bandeau bas (16:9, un tiers de l'écran au plus) pour laisser lire le titre. */
  compactMobile?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-creme-clair ${compactMobile ? "aspect-video max-h-[33svh] w-full lg:max-h-none lg:aspect-[var(--ar)]" : ""} ${className}`}
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
        placeholder === "sobre" ? (
          <div data-photo-a-venir className="absolute inset-0 flex items-end justify-center border border-filet bg-gradient-to-b from-creme-clair to-creme/60 p-space-2">
            {placeholderText && <span className="text-sur-titre-petit text-gris-chaud/70">{placeholderText}</span>}
          </div>
        ) : (
          <div data-photo-a-venir className="vitrail absolute inset-0 border border-filet" aria-hidden="true" />
        )
      )}
    </div>
  );
}
