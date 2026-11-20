import "server-only";
import { cacheLife } from "next/cache";
import { lienLocalise } from "@/i18n/liens";
import type { Locale } from "@/i18n/routing";
import { getCalendrier } from "@/sanity/content";
import { avecLibelles, type DateCalendrierVue } from "./calendrier";

/** Dates du calendrier prêtes pour l'affichage (libellés et liens dans la langue de la page). */
export async function getCalendrierVue(locale: Locale): Promise<DateCalendrierVue[]> {
  const dates = await getCalendrier(locale);
  return avecLibelles(dates, locale).map((d) => ({ ...d, lien: lienLocalise(d.lien, locale) }));
}

/** Date du jour à Paris (AAAA-MM-JJ), mise en cache une heure : utilisable dans une page prérendue. */
export async function dateDuJourParis(): Promise<string> {
  "use cache";
  cacheLife("hours");
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());
}
