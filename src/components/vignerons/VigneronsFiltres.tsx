"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { pictos, terroirs, type PictoKey, type TerroirKey } from "@/lib/brand";
import type { Vigneron } from "@/sanity/content";

type Filtre = { type: "terroir"; key: TerroirKey } | { type: "picto"; key: PictoKey } | null;

const chip =
  "inline-flex min-h-11 items-center gap-1.5 rounded-rond border px-space-2 text-sur-titre-petit transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze";
const actif = "border-anthracite bg-anthracite text-blanc";
const inactif = "border-filet bg-blanc text-anthracite hover:border-bronze";

/**
 * Liste des domaines avec filtres par terroir et par particularité.
 * Les filtres proposés sont tirés des domaines présents : jamais de choix sans résultat.
 * Toutes les cartes restent dans le HTML (Google les lit) ; le filtre ne fait que les masquer.
 */
export function VigneronsFiltres({ vignerons }: { vignerons: Vigneron[] }) {
  const t = useTranslations("vigneronsPage");
  const [filtre, setFiltre] = useState<Filtre>(null);

  const terroirKeys = (Object.keys(terroirs) as TerroirKey[]).filter((k) => vignerons.some((v) => v.terroir === k));
  const pictoKeys = (Object.keys(pictos) as PictoKey[]).filter((k) => vignerons.some((v) => v.thematiques?.includes(k)));

  const visible = (v: Vigneron) =>
    !filtre || (filtre.type === "terroir" ? v.terroir === filtre.key : !!v.thematiques?.includes(filtre.key));
  const count = vignerons.filter(visible).length;
  const isActive = (f: Filtre) => (f === null ? filtre === null : filtre?.type === f.type && filtre.key === f.key);

  const chipItem = (key: string, f: Filtre, label: string, color?: string) => (
    <li key={key}>
      <button type="button" aria-pressed={isActive(f)} onClick={() => setFiltre(f)} className={`${chip} ${isActive(f) ? actif : inactif}`}>
        {color && <span aria-hidden="true" className="h-2 w-2 rounded-rond" style={{ backgroundColor: `var(--color-${color})` }} />}
        {label}
      </button>
    </li>
  );

  return (
    <div>
      {terroirKeys.length + pictoKeys.length > 1 && (
        <div role="group" aria-label={t("filtres")} className="mb-space-4">
          <p className="text-sur-titre-petit text-gris-chaud">{t("filtres")}</p>
          <ul className="mt-space-1 flex flex-wrap gap-space-1">
            {chipItem("tous", null, t("tous"))}
            {terroirKeys.map((k) =>
              chipItem(k, { type: "terroir", key: k }, terroirs[k].label, terroirs[k].color),
            )}
            {pictoKeys.map((k) =>
              chipItem(k, { type: "picto", key: k }, pictos[k].label),
            )}
          </ul>
        </div>
      )}
      <p role="status" className="mb-space-2 text-sur-titre-petit text-gris-chaud">
        {t("count", { count })}
      </p>
      <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
        {vignerons.map((v) => (
          <li key={v.slug} hidden={!visible(v)}>
            <DomaineCard domaine={v} />
          </li>
        ))}
      </ul>
      {count === 0 && <p className="mt-space-3 text-gris-chaud">{t("aucun")}</p>}
    </div>
  );
}
