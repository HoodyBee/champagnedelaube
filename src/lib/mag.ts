import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getRubriquesSanity, RUBRIQUES_PAR_DEFAUT, type ArticleCard } from "@/sanity/content";

const CLE_MESSAGE: Record<string, string> = {
  actualites: "actualites",
  accords: "accords",
  marketing: "marketing",
  "tout-savoir": "toutSavoir",
  portraits: "portraits",
  "autres-horizons": "autresHorizons",
};

/** Noms des rubriques dans la langue de la page (Sanity d'abord, sinon les noms par défaut). */
export async function getRubriqueLabels(locale: Locale): Promise<Record<string, string>> {
  const t = await getTranslations({ locale, namespace: "mag.rubriques" });
  const labels: Record<string, string> = {};
  for (const cle of RUBRIQUES_PAR_DEFAUT) labels[cle] = t(CLE_MESSAGE[cle] as "toutSavoir");
  for (const r of await getRubriquesSanity(locale)) if (r.titre) labels[r.cle] = r.titre;
  return labels;
}

/** Ordre des rubriques : celles par défaut, puis celles ajoutées dans Sanity. */
export function ordreRubriques(labels: Record<string, string>): string[] {
  return [...RUBRIQUES_PAR_DEFAUT, ...Object.keys(labels).filter((k) => !(RUBRIQUES_PAR_DEFAUT as readonly string[]).includes(k))];
}

export type MagCardData = ArticleCard & { dateLabel?: string };

/** Ajoute la date en toutes lettres (calculée côté serveur, dans la langue de la page). */
export function withDates(articles: ArticleCard[], locale: Locale): MagCardData[] {
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Paris" });
  return articles.map((a) => ({ ...a, dateLabel: a.date ? fmt.format(new Date(a.date)) : undefined }));
}
