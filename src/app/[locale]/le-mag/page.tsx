import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagFiltres } from "@/components/mag/MagFiltres";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, ordreRubriques, withDates } from "@/lib/mag";
import { getArticles } from "@/sanity/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/le-mag">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "mag" });
  return pageMetadata({ locale, href: "/le-mag", title: t("metaTitle"), description: t("metaDescription") });
}

/** Le Mag : tous les articles, filtrables par rubrique. */
export default async function MagPage({ params }: PageProps<"/[locale]/le-mag">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("mag");
  const [articles, labels] = await Promise.all([getArticles(locale), getRubriqueLabels(locale)]);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1") }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
        <h1 className="mt-space-1 text-titre-post">{t("h1")}</h1>
        <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{t("intro")}</p>
      </header>
      <Section className="!pt-space-3">
        <MagFiltres articles={withDates(articles, locale)} labels={labels} ordre={ordreRubriques(labels)} />
      </Section>
    </>
  );
}
