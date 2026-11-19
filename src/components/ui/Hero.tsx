import type { ReactNode } from "react";
import { Photo } from "./Photo";
import type { Img } from "./types";

/**
 * Ouverture de page : texte à gauche sur crème clair, grande photo à droite
 * (empilés sur mobile). Contient le seul H1 de la page.
 */
export function Hero({
  surTitre,
  titre,
  intro,
  image,
  actions,
  placeholderLabel,
  placeholder = "sobre",
  placeholderText,
}: {
  surTitre?: string;
  titre: string;
  intro?: string;
  image?: Img | null;
  actions?: ReactNode;
  placeholderLabel?: string;
  /** Emplacement sans photo : « sobre » (avec une mention discrète) ou « vitrail ». */
  placeholder?: "vitrail" | "sobre";
  placeholderText?: string;
}) {
  return (
    <section className="border-b border-filet bg-creme-clair">
      <div className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-[1.15fr_1fr] lg:gap-space-5 lg:py-space-5">
        <div className="order-2 lg:order-1">
          {surTitre && <p className="text-sur-titre text-bronze">{surTitre}</p>}
          <h1 className="mt-space-2 max-w-[18ch] text-balance text-titre-post">{titre}</h1>
          {intro && <p className="mt-space-3 max-w-lg text-pretty text-[1.125rem] text-gris-chaud">{intro}</p>}
          {actions && <div className="mt-space-4 flex flex-col gap-space-1 sm:flex-row sm:flex-wrap">{actions}</div>}
        </div>
        <Photo
          image={image}
          ratio="4/3"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          compactMobile
          placeholder={placeholder}
          placeholderText={placeholderText ?? placeholderLabel}
          placeholderLabel={placeholderLabel}
          className="order-1 lg:order-2"
        />
      </div>
    </section>
  );
}
