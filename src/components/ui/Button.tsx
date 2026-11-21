import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primaire" | "secondaire" | "clair";

const styles: Record<Variant, string> = {
  // Anthracite plein : l'action principale de la section.
  primaire: "bg-anthracite text-blanc hover:bg-anthracite/85",
  // Contour : action secondaire.
  secondaire: "border border-anthracite text-anthracite hover:bg-anthracite hover:text-blanc",
  // Sur fond sombre ou photo.
  clair: "bg-blanc text-anthracite hover:bg-creme-clair",
};

export const buttonClass = (variant: Variant = "primaire", className = "") =>
  `inline-flex min-h-12 items-center justify-center gap-space-1 rounded-etiquette px-space-3 text-center text-sur-titre transition-colors sm:whitespace-nowrap ${styles[variant]} ${className}`;

/** Bouton-lien vers une page du site (adresse traduite automatiquement). */
export function ButtonLink({
  variant = "primaire",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link {...props} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
