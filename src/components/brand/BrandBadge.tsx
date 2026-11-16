import Image from "next/image";
import type { BrandAsset } from "@/lib/brand";

type Props = {
  asset: BrandAsset;
  /** Taille affichée en pixels (minimum 24 px selon le brand book). */
  size?: number;
  /** Afficher le nom sous le badge (utile pour les futurs pictos SVG sans texte). */
  showLabel?: boolean;
  className?: string;
};

/**
 * Affiche un picto, un terroir ou un cépage.
 * - Format "vignette" (PNG actuels) : carré arrondi façon étiquette, nom déjà dans l'image.
 * - Format "picto" (futurs SVG) : picto blanc dans une pastille ronde de sa couleur,
 *   avec son nom écrit à côté (règle du brand book pour les cépages).
 */
export function BrandBadge({ asset, size = 64, showLabel, className = "" }: Props) {
  const px = Math.max(size, 24);

  if (asset.format === "vignette") {
    return (
      <Image
        src={asset.src}
        alt={asset.label}
        width={px}
        height={px}
        sizes={`${px}px`}
        className={`rounded-etiquette ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex flex-col items-center gap-space-1 ${className}`}>
      <span
        className="inline-flex items-center justify-center rounded-rond"
        style={{ backgroundColor: `var(--color-${asset.color})`, width: px, height: px }}
      >
        <Image src={asset.src} alt="" width={px * 0.6} height={px * 0.6} />
      </span>
      <span className={showLabel === false ? "sr-only" : "text-legende"}>{asset.label}</span>
    </span>
  );
}
