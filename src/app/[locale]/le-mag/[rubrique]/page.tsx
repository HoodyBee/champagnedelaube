import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RubriquePage, rubriqueMetadata } from "@/components/mag/RubriquePage";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getRubriqueLabels } from "@/lib/mag";
import { getArticles, PAGES_RUBRIQUE, RUBRIQUES_PAR_DEFAUT } from "@/sanity/content";

type Props = PageProps<"/[locale]/le-mag/[rubrique]">;

/**
 * Rubriques qui ont une page : celles du menu (même vides : « les premiers articles arrivent »,
 * page non indexée tant qu'elle est vide) et celles du Studio qui ont des articles.
 */
async function rubriquesAvecArticles(locale: Locale) {
  const [articles, labels] = await Promise.all([getArticles(locale), getRubriqueLabels(locale)]);
  return Object.keys(labels).filter((code) => (RUBRIQUES_PAR_DEFAUT as readonly string[]).includes(code) || articles.some((a) => a.rubriques.includes(code)));
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    [...RUBRIQUES_PAR_DEFAUT].filter((code) => !(code in PAGES_RUBRIQUE)).map((rubrique) => ({ locale, rubrique })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, rubrique } = (await params) as { locale: Locale; rubrique: string };
  if (rubrique in PAGES_RUBRIQUE || !(await rubriquesAvecArticles(locale)).includes(rubrique)) return {};
  return rubriqueMetadata(rubrique, locale);
}

/** Page d'une rubrique du Mag sans adresse historique : /le-mag/actualites/, /le-mag/portraits/… */
export default async function RubriqueMagPage({ params }: Props) {
  const { locale, rubrique } = (await params) as { locale: Locale; rubrique: string };
  setRequestLocale(locale);
  // Rubriques à adresse historique : une seule adresse, pas de doublon.
  if (rubrique in PAGES_RUBRIQUE) permanentRedirect(getPathname({ href: PAGES_RUBRIQUE[rubrique as keyof typeof PAGES_RUBRIQUE], locale }));
  if (!(await rubriquesAvecArticles(locale)).includes(rubrique)) notFound();
  return <RubriquePage code={rubrique} locale={locale} />;
}
