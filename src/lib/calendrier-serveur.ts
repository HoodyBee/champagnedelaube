import "server-only";
import { getPathname } from "@/i18n/navigation";
import { withSlash } from "@/i18n/metadata";
import { routing, type Locale, type StaticPathname } from "@/i18n/routing";
import { getCalendrier } from "@/sanity/content";
import { avecLibelles, estExterne, type DateCalendrierVue } from "./calendrier";

/** Lien saisi dans le Studio (/page-du-site ou https://…) -> adresse dans la langue de la page. */
export function lienLocalise(lien: string | undefined, locale: Locale): string | undefined {
  if (!lien) return undefined;
  if (estExterne(lien)) return lien;
  const chemin = `/${lien.replace(/^\/+|\/+$/g, "")}`;
  if (chemin in routing.pathnames) return withSlash(getPathname({ href: chemin as StaticPathname, locale }));
  // Sinon : un article du Mag (/mon-article/).
  return withSlash(getPathname({ href: { pathname: "/[article]", params: { article: chemin.slice(1) } }, locale }));
}

/** Dates du calendrier prêtes pour l'affichage (libellés et liens dans la langue de la page). */
export async function getCalendrierVue(locale: Locale): Promise<DateCalendrierVue[]> {
  const dates = await getCalendrier(locale);
  return avecLibelles(dates, locale).map((d) => ({ ...d, lien: lienLocalise(d.lien, locale) }));
}
