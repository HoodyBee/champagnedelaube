"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { MagCardData } from "@/lib/mag";
import { MagCard } from "./MagCard";

const chip =
  "inline-flex min-h-11 items-center rounded-rond border px-space-2 text-sur-titre-petit transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze";

/**
 * Articles du Mag avec filtres par rubrique (seulement les rubriques qui ont des articles).
 * Toutes les cartes restent dans le HTML pour Google ; le filtre ne fait que les masquer.
 */
export function MagFiltres({ articles, labels, ordre }: { articles: MagCardData[]; labels: Record<string, string>; ordre: string[] }) {
  const t = useTranslations("mag");
  const tLegal = useTranslations("legal");
  const [filtre, setFiltre] = useState<string | null>(null);
  const presentes = ordre.filter((r) => labels[r] && articles.some((a) => a.rubriques.includes(r)));
  const visible = (a: MagCardData) => !filtre || a.rubriques.includes(filtre);
  const count = articles.filter(visible).length;

  const item = (key: string, value: string | null, label: string) => (
    <li key={key}>
      <button
        type="button"
        aria-pressed={filtre === value}
        onClick={() => setFiltre(value)}
        className={`${chip} ${filtre === value ? "border-anthracite bg-anthracite text-blanc" : "border-filet bg-blanc text-anthracite hover:border-bronze"}`}
      >
        {label}
      </button>
    </li>
  );

  if (!articles.length) return <p className="text-[1.0625rem] text-gris-chaud">{t("vide")}</p>;

  return (
    <div>
      {presentes.length > 1 && (
        <div role="group" aria-label={t("filtres")} className="mb-space-4">
          <ul className="flex flex-wrap gap-space-1">
            {item("tous", null, t("tous"))}
            {presentes.map((r) => item(r, r, labels[r]))}
          </ul>
        </div>
      )}
      <p role="status" className="mb-space-2 text-sur-titre-petit text-gris-chaud">
        {t("count", { count })}
      </p>
      <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <li key={a.slug} hidden={!visible(a)}>
            <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
          </li>
        ))}
      </ul>
      {count === 0 && <p className="mt-space-3 text-gris-chaud">{t("aucun")}</p>}
    </div>
  );
}
