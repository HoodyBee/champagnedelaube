import { useTranslations } from "next-intl";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { Link } from "@/i18n/navigation";
import { pictos, terroirs, type PictoKey, type TerroirKey } from "@/lib/brand";
import { Photo } from "./Photo";
import type { Img } from "./types";

export type DomaineCardData = {
  slug: string;
  nom: string;
  village?: string;
  terroir?: TerroirKey;
  philosophie?: string;
  portrait?: Img | null;
  thematiques?: PictoKey[];
  labels?: string[];
};

/** Carte d'un domaine : l'humain avant le produit (portrait, village, philosophie, badges). Jamais de prix. */
export function DomaineCard({ domaine: d }: { domaine: DomaineCardData }) {
  const t = useTranslations("ui");
  const terroir = d.terroir ? terroirs[d.terroir] : undefined;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-carte">
        <Photo
          image={d.portrait}
          ratio="4/5"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          placeholderLabel={t("photoSoon")}
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-space-2">
        <p className="inline-flex items-center gap-1.5 text-sur-titre-petit text-gris-chaud">
          {terroir && <span aria-hidden="true" className="h-2 w-2 rounded-rond" style={{ backgroundColor: `var(--color-${terroir.color})` }} />}
          {[d.village, terroir?.label].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-1 text-[1.375rem] font-bold leading-tight">{d.nom}</h3>
        {d.philosophie && <p className="mt-space-1 line-clamp-3 text-gris-chaud">{d.philosophie}</p>}
        {(d.thematiques?.length || d.labels?.length) ? (
          <ul className="mt-space-2 flex flex-wrap items-center gap-space-1">
            {d.thematiques?.map((k) => (
              <li key={k} title={pictos[k].label}>
                <BrandBadge asset={pictos[k]} size={40} />
              </li>
            ))}
            {d.labels?.map((l) => (
              <li key={l} className="rounded-etiquette border border-filet px-space-1 py-0.5 text-sur-titre-petit text-gris-chaud">
                {l}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={{ pathname: "/vignerons/[slug]", params: { slug: d.slug } }}
          className="mt-auto inline-flex items-center gap-space-1 pt-space-2 text-sur-titre-petit text-anthracite after:absolute after:inset-0 group-hover:text-bronze"
        >
          {t("discoverDomain")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
