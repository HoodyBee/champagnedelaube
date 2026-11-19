import { Link } from "@/i18n/navigation";
import { terroirs } from "@/lib/brand";
import { terroirPages } from "@/lib/site";

/** Les 4 terroirs : une liste sobre, la couleur du terroir en simple pastille. */
export function TerroirCards() {
  return (
    <ul className="divide-y divide-filet border-y border-filet">
      {terroirPages.map((p) => (
        <li key={p.key}>
          <Link href={p.href} className="group flex min-h-14 items-center gap-space-2 py-space-2 transition-colors">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-rond" style={{ backgroundColor: `var(--color-${terroirs[p.key].color})` }} />
            <span className="flex-1 text-[1.25rem] font-bold leading-tight group-hover:text-bronze">{p.label}</span>
            <span aria-hidden="true" className="text-bronze">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
