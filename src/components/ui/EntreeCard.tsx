import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Photo } from "./Photo";
import type { Img } from "./types";

/** Carte d'une des 3 entrées de l'accueil (Professionnels, Entreprises, Particuliers). Toute la carte est cliquable. */
export function EntreeCard({
  href,
  surTitre,
  titre,
  texte,
  bouton,
  image,
  placeholderLabel,
}: {
  href: ComponentProps<typeof Link>["href"];
  surTitre?: string;
  titre: string;
  texte?: string;
  bouton: string;
  image?: Img | null;
  placeholderLabel: string;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-carte border border-filet bg-blanc transition-shadow hover:shadow-[0_12px_32px_rgba(30,30,32,0.08)]">
      <Photo image={image} ratio="4/3" sizes="(min-width: 1024px) 33vw, 100vw" placeholderLabel={placeholderLabel} />
      <div className="flex flex-1 flex-col p-space-3">
        {surTitre && <p className="text-sur-titre-petit text-bronze">{surTitre}</p>}
        <h3 className="mt-space-1 text-[1.5rem] font-bold leading-tight">{titre}</h3>
        {texte && <p className="mt-space-1 flex-1 text-gris-chaud">{texte}</p>}
        <Link
          href={href}
          className="mt-space-3 inline-flex items-center gap-space-1 text-sur-titre text-anthracite after:absolute after:inset-0 group-hover:text-bronze"
        >
          {bouton}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
