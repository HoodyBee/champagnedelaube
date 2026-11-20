import type React from "react";
import NextImage from "next/image";
import { SanityImage as Image } from "@/components/ui/SanityImage";
import { logos } from "@/lib/brand";
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
  const cadre = (
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
        // Jamais de motif à la place d'une photo : notre logo (la bouteille) sur fond crème.
        <div data-photo-a-venir aria-hidden="true" className="absolute inset-0 flex items-center justify-center border border-filet bg-creme-clair">
          <NextImage src={logos.avatar.src} alt="" width={96} height={96} sizes="96px" className="h-[22%] max-h-24 min-h-12 w-auto opacity-90" />
        </div>
      )}
    </div>
  );
  // Légende honnête sous la photo, si elle est renseignée dans le Studio.
  return image?.legende ? (
    <figure>
      {cadre}
      <figcaption className="mt-1 text-legende text-gris-chaud">{image.legende}</figcaption>
    </figure>
  ) : (
    cadre
  );
}
