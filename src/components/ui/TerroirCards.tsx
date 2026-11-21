import { Link } from "@/i18n/navigation";
import { terroirs } from "@/lib/brand";
import { terroirPages } from "@/lib/site";

/** Les 4 terroirs de l'Aube (Troyes n'en est pas un) : pastille de couleur, nom, flèche. */
export function TerroirCards({ exclure, compact = false }: { exclure?: string; compact?: boolean } = {}) {
  return (
    <ul className="divide-y divide-filet border-y border-filet">
      {terroirPages.filter((p) => p.key !== exclure).map((p) => (
        <li key={p.key}>
          <Link href={p.href} className={`group flex items-center gap-space-2 transition-colors ${compact ? "min-h-11 py-space-1" : "min-h-14 py-space-2"}`}>
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-rond" style={{ backgroundColor: `var(--color-${terroirs[p.key].color})` }} />
            <span className={`flex-1 font-bold leading-tight group-hover:text-bronze ${compact ? "text-[1.125rem]" : "text-[1.25rem]"}`}>{p.label}</span>
            <span aria-hidden="true" className="text-bronze">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
