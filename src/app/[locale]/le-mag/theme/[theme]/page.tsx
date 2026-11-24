import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { THEMES_MAG, estThemeMag } from "@/lib/themes-mag";
import { getArticles, getEtiquettes } from "@/sanity/content";

type Props = PageProps<"/[locale]/le-mag/theme/[theme]">;

/**
 * Contenus publiés APRÈS la mise en ligne (nouvel article, nouvelle fiche…) : sans ce réglage,
 * Netlify tente de fabriquer la page à l'avance, échoue et répond « erreur 500 ». Avec lui, la
 * page est construite à la première visite, puis gardée en cache. Les adresses inconnues
 * reçoivent un vrai 404 grâce au proxy (src/lib/adresses-connues.ts).
 */
export const instant = false;

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => THEMES_MAG.map((theme) => ({ locale, theme })));
}

/** Le thème (nom, intro) et ses articles publiés ; `null` si le thème n'a pas de page dans Le Mag. */
async function contenu(theme: string, locale: Locale) {
  if (!estThemeMag(theme)) return null;
  const [themes, articles] = await Promise.all([getEtiquettes(locale), getArticles(locale)]);
  const fiche = themes.find((e) => e.cle === theme);
  if (!fiche) return null;
  return { fiche, liste: withDates(articles.filter((a) => a.etiquettes.includes(theme)), locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, theme } = (await params) as { locale: Locale; theme: string };
  const c = await contenu(theme, locale);
  if (!c) notFound();
  const t = await getTranslations({ locale, namespace: "mag" });
  return pageMetadata({
    locale,
    href: { pathname: "/le-mag/theme/[theme]", params: { theme } },
    // Titre et description dédiés (fichiers de traduction) s'ils existent, sinon nom et intro du thème.
    title: t.has(`themesMeta.${theme}.title`) ? t(`themesMeta.${theme}.title` as "h1") : `${c.fiche.nom} | ${t("h1")}`,
    description: t.has(`themesMeta.${theme}.description`) ? t(`themesMeta.${theme}.description` as "h1") : (c.fiche.intro ?? t("metaDescription")),
    // Thème encore vide : pas de page creuse dans Google.
    seo: c.liste.length ? undefined : { noIndex: true },
  });
}

/** Page d'un thème du Mag : nom, phrase d'intro, puis tous les articles qui portent ce thème. */
export default async function ThemeMagPage({ params }: Props) {
  const { locale, theme } = (await params) as { locale: Locale; theme: string };
  setRequestLocale(locale);
  const c = await contenu(theme, locale);
  if (!c) notFound();
  const [t, tLegal, labels] = await Promise.all([getTranslations("mag"), getTranslations("legal"), getRubriqueLabels(locale)]);
  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1"), href: "/le-mag" }, { label: c.fiche.nom }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{t("etiquette")}</p>
        <h1 className="mt-space-1 text-titre-post">{c.fiche.nom}</h1>
        {c.fiche.intro && <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{c.fiche.intro}</p>}
      </header>
      <Section className="!pt-space-3">
        {c.liste.length ? (
          <>
            <h2 className="sr-only">{t("tousLesArticles")}</h2>
            <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.liste.map((a) => (
                <li key={a.slug}>
                  <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gris-chaud">{t("vide")}</p>
        )}
      </Section>
    </>
  );
}
