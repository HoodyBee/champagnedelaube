import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { MagFiltres } from "@/components/mag/MagFiltres";
import { UneAuHasard } from "@/components/mag/UneAuHasard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, ordreRubriques, withDates } from "@/lib/mag";
import { CSS_UNE_DEFAUT, ID_LISTE_UNE, ID_STYLE_UNE, scriptUne } from "@/lib/une-hasard";
import { getArticles } from "@/sanity/content";

/** Nombre d'articles montrés dans « À la une ». */
const UNE = 3;

export async function generateMetadata({ params }: PageProps<"/[locale]/le-mag">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "mag" });
  return pageMetadata({ locale, href: "/le-mag", title: t("metaTitle"), description: t("metaDescription") });
}

/**
 * Le Mag, direct et simple : titre et phrase d'intro, « À la une » (au hasard à chaque visite),
 * puis « Tous les articles » avec les onglets de rubrique. Pas de section par thème ici :
 * Champagne & art a sa propre page (menu du Mag), Marketing est dans l'Espace Pro.
 */
export default async function MagPage({ params }: PageProps<"/[locale]/le-mag">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, tLegal] = await Promise.all([getTranslations("mag"), getTranslations("legal")]);
  const [articles, labels] = await Promise.all([getArticles(locale), getRubriqueLabels(locale)]);
  const datees = withDates(articles, locale);
  // Candidats « À la une » : articles publiés avec une image (les plus récents d'abord, pour l'affichage sans script).
  const candidats = datees.filter((a) => a.image);
  const montres = Math.min(UNE, candidats.length);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1") }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 text-center sm:px-space-4 lg:pt-space-5">
        <h1 className="text-titre-post sm:text-[3.25rem]">{t("h1")}</h1>
        <p className="mx-auto mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{t("intro")}</p>
        <div aria-hidden="true" className="mx-auto mt-space-3 flex max-w-xs flex-col gap-1">
          <span className="h-px bg-or" />
          <span className="h-px bg-or/40" />
        </div>
      </header>

      {montres > 0 && (
        <Section id="a-la-une" className="!pt-space-3" align="gauche" titre={t("aLaUne")}>
          {/* Le script ci-dessous remplace ce style avant l'affichage : différence voulue avec le serveur. */}
          <style id={ID_STYLE_UNE} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: CSS_UNE_DEFAUT(montres) }} />
          <ul id={ID_LISTE_UNE} className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidats.map((a, i) => (
              <li key={a.slug} data-i={i}>
                <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
          <script dangerouslySetInnerHTML={{ __html: scriptUne(candidats.length, montres) }} />
          <UneAuHasard total={candidats.length} montres={montres} />
        </Section>
      )}

      <Section fond={montres > 0 ? "chaude" : "blanc"} align="gauche" titre={t("tousLesArticles")}>
        <MagFiltres articles={datees} labels={labels} ordre={ordreRubriques(labels)} />
      </Section>
    </>
  );
}
