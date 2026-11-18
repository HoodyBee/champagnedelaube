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
}: {
  surTitre?: string;
  titre: string;
  intro?: string;
  image?: Img | null;
  actions?: ReactNode;
  placeholderLabel: string;
}) {
  return (
    <section className="border-b border-filet bg-creme-clair">
      <div className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
        <div className="order-2 lg:order-1">
          {surTitre && <p className="text-sur-titre text-bronze">{surTitre}</p>}
          <h1 className="mt-space-2 text-titre-post">{titre}</h1>
          {intro && <p className="mt-space-3 max-w-xl text-[1.125rem] text-gris-chaud">{intro}</p>}
          {actions && <div className="mt-space-4 flex flex-col gap-space-1 sm:flex-row">{actions}</div>}
        </div>
        <Photo
          image={image}
          ratio="4/3"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          placeholderLabel={placeholderLabel}
          className="order-1 lg:order-2"
        />
      </div>
    </section>
  );
}
