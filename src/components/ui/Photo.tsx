import Image from "next/image";
import { LineIcon } from "./LineIcon";
import type { Img } from "./types";

/**
 * Photo à angles droits (règle du brand book), recadrée au format demandé.
 * Sans image : un emplacement crème clair « Photo à venir » marqué [À COMPLÉTER].
 */
export function Photo({
  image,
  ratio = "4/5",
  sizes,
  priority,
  placeholderLabel,
  className = "",
}: {
  image?: Img | null;
  ratio?: "4/5" | "4/3" | "3/2" | "16/9" | "1/1";
  sizes: string;
  priority?: boolean;
  placeholderLabel: string;
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-1 border border-filet text-gris-chaud">
          <LineIcon name="lieu" size={28} className="text-or" />
          <span className="text-sur-titre-petit">[À COMPLÉTER] {placeholderLabel}</span>
        </div>
      )}
    </div>
  );
}
