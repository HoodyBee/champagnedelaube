import { Link } from "@/i18n/navigation";
import type { MagCardData } from "@/lib/mag";
import { Photo } from "@/components/ui/Photo";

/** Carte d'article du Mag : photo, rubrique, date, titre, résumé. */
export function MagCard({ article: a, labels, lire, sponsored }: { article: MagCardData; labels: Record<string, string>; lire: string; sponsored: string }) {
  const rubrique = a.rubriques.map((r) => labels[r]).filter(Boolean)[0];
  return (
    <article className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-carte">
        <Photo image={a.image} ratio="3/2" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col pt-space-2">
        <p className="text-sur-titre-petit text-bronze">
          {[rubrique, a.dateLabel].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-1 text-[1.375rem] font-bold leading-tight group-hover:text-bronze">{a.titre}</h3>
        {a.collaborationCommerciale && <p className="mt-1 text-legende text-gris-chaud">{sponsored}</p>}
        {a.extrait && <p className="mt-space-1 line-clamp-3 text-gris-chaud">{a.extrait}</p>}
        <Link
          href={{ pathname: "/[article]", params: { article: a.slug } }}
          className="mt-auto inline-flex items-center gap-space-1 pt-space-2 text-sur-titre-petit text-anthracite after:absolute after:inset-0"
        >
          {lire} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
