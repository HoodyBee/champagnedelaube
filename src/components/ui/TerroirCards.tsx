import { BrandBadge } from "@/components/brand/BrandBadge";
import { Link } from "@/i18n/navigation";
import { terroirs } from "@/lib/brand";
import { terroirPages } from "@/lib/site";

/** Les 4 terroirs, chacun avec sa couleur et sa vignette du brand book. */
export function TerroirCards() {
  return (
    <ul className="grid grid-cols-2 gap-space-2">
      {terroirPages.map((p) => {
        const t = terroirs[p.key];
        return (
          <li key={p.key}>
            <Link
              href={p.href}
              className="group flex h-full items-center gap-space-2 rounded-carte border border-filet bg-blanc p-space-2 transition-colors hover:border-bronze"
            >
              <BrandBadge asset={t} size={56} />
              <span className="flex-1">
                <span aria-hidden="true" className="mb-1 block h-1 w-8 rounded-rond" style={{ backgroundColor: `var(--color-${t.color})` }} />
                <span className="text-[1.0625rem] font-bold leading-tight group-hover:text-bronze">{p.label}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
