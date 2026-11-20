import type { CategorieCalendrier, DateCalendrier } from "@/sanity/content";

/**
 * Pastilles de couleur des catégories du calendrier (couleurs de la marque).
 * « Mes événements » en or, bien distinct des journées du marronnier.
 */
export const COULEUR_CATEGORIE: Record<CategorieCalendrier, string> = {
  evenements: "var(--color-or)",
  vins: "var(--color-story-riceys)",
  gastronomie: "var(--color-story-villenauxe)",
  spiritueux: "var(--color-story-art)",
  salons: "var(--color-story-cote-des-bar)",
};

/** Date sérialisable passée aux composants client (les libellés sont calculés côté serveur). */
export type DateCalendrierVue = DateCalendrier & { dateLabel: string; mois: string };

/** Ajoute le libellé de date (« 22 janv. », « 15 – 17 févr. ») dans la langue de la page. */
export function avecLibelles(dates: DateCalendrier[], locale: string): DateCalendrierVue[] {
  const jour = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const jourSeul = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" });
  return dates.map((d) => {
    const a = new Date(`${d.debut}T00:00:00Z`);
    const b = new Date(`${d.fin}T00:00:00Z`);
    let dateLabel = jour.format(a);
    if (d.fin !== d.debut) {
      dateLabel = a.getUTCMonth() === b.getUTCMonth() ? `${jourSeul.format(a)} – ${jour.format(b)}` : `${jour.format(a)} – ${jour.format(b)}`;
    }
    return { ...d, dateLabel, mois: d.debut.slice(0, 7) };
  });
}

/** Vrai si la date couvre ce jour (AAAA-MM-JJ). */
export const couvre = (d: { debut: string; fin: string }, jour: string) => d.debut <= jour && jour <= d.fin;

/** Lien interne (/page) ou externe (https://…). */
export const estExterne = (lien: string) => /^https?:\/\//.test(lien);
