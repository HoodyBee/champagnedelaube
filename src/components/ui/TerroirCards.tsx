import { useTranslations } from "next-intl";
import { CoeurTroyes } from "@/components/ui/CoeurTroyes";
import { Link } from "@/i18n/navigation";
import { terroirs } from "@/lib/brand";
import { terroirPages } from "@/lib/site";

/** Les 4 terroirs (la couleur du terroir en simple pastille), puis Troyes, avec un cœur azur. */
export function TerroirCards({ exclure }: { exclure?: string } = {}) {
  const t = useTranslations("nav");
  const ligne = "group flex min-h-14 items-center gap-space-2 py-space-2 transition-colors";
  return (
    <ul className="divide-y divide-filet border-y border-filet">
      {terroirPages.filter((p) => p.key !== exclure).map((p) => (
        <li key={p.key}>
          <Link href={p.href} className={ligne}>
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-rond" style={{ backgroundColor: `var(--color-${terroirs[p.key].color})` }} />
            <span className="flex-1 text-[1.25rem] font-bold leading-tight group-hover:text-bronze">{p.label}</span>
            <span aria-hidden="true" className="text-bronze">→</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/champagne-troyes" className={ligne}>
          <CoeurTroyes className="h-3 w-3" />
          <span className="flex-1 text-[1.25rem] font-bold leading-tight group-hover:text-bronze">{t("troyes")}</span>
          <span aria-hidden="true" className="text-bronze">→</span>
        </Link>
      </li>
    </ul>
  );
}
