import type { ReactNode } from "react";

type Props = {
  id?: string;
  surTitre?: string;
  titre?: string;
  intro?: string;
  /** "blanc" (par défaut) ou "chaude" : fond crème clair bordé d'un filet doré. */
  fond?: "blanc" | "chaude";
  /** Titre et intro centrés (par défaut) ou alignés à gauche. */
  align?: "centre" | "gauche";
  className?: string;
  children?: ReactNode;
};

/** Section de page : marges, largeur maximale, sur-titre, titre H2 et introduction. */
export function Section({ id, surTitre, titre, intro, fond = "blanc", align = "centre", className = "", children }: Props) {
  const headingId = id ? `${id}-titre` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={titre ? headingId : undefined}
      className={`${fond === "chaude" ? "border-y border-filet bg-creme-clair" : ""} py-space-5 sm:py-[96px] ${className}`}
    >
      <div className="mx-auto max-w-7xl px-space-2 sm:px-space-4">
        {(surTitre || titre || intro) && (
          <header className={`${align === "centre" ? "mx-auto text-center" : ""} mb-space-4 max-w-3xl`}>
            {surTitre && <p className="text-sur-titre text-bronze">{surTitre}</p>}
            {titre && (
              <h2 id={headingId} className="mt-space-1 text-titre-section sm:text-[2rem]">
                {titre}
              </h2>
            )}
            {intro && <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
