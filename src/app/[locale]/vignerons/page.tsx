import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CatalogueDialog } from "@/components/selection/CatalogueDialog";
import { SelectionBox } from "@/components/selection/SelectionBox";
import { Section } from "@/components/ui/Section";
import { VigneronsFiltres } from "@/components/vignerons/VigneronsFiltres";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getPageContent, getVignerons } from "@/sanity/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/vignerons">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "vigneronsPage" });
  const page = await getPageContent("vignerons", locale);
  return pageMetadata({ locale, href: "/vignerons", seo: page.seo, title: t("metaTitle"), description: t("metaDescription") });
}

/** Notre Sélection : tous les domaines de la sélection, avec filtres. */
export default async function VigneronsPage({ params }: PageProps<"/[locale]/vignerons">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("vigneronsPage");
  const [page, vignerons] = await Promise.all([getPageContent("vignerons", locale), getVignerons(locale)]);
  const titre = page.titre ?? t("h1");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{page.surTitre ?? t("surTitre")}</p>
        <h1 className="mt-space-1 text-titre-post">{titre}</h1>
        <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{page.intro ?? t("intro")}</p>
        <CatalogueDialog className="mt-space-3" />
      </header>
      <Section className="!pt-space-3">
        <VigneronsFiltres vignerons={vignerons} />
      </Section>
      <Section fond="chaude">
        <SelectionBox lienSelection={false} />
      </Section>
    </>
  );
}
