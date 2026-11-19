import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CatalogueDialog } from "@/components/selection/CatalogueDialog";
import { SelectionBox } from "@/components/selection/SelectionBox";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { VigneronsFiltres } from "@/components/vignerons/VigneronsFiltres";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getCuvees, getPageContent, getVignerons } from "@/sanity/content";

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
  const [page, vignerons, cuvees] = await Promise.all([getPageContent("vignerons", locale), getVignerons(locale), getCuvees(locale)]);
  const tHome = await getTranslations("home");
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
      {/* Les cuvées du moment (documents « Cuvée » publiés), avant les domaines */}
      {cuvees.length > 0 && (
        <Section className="!pt-space-3" titre={tHome("pepitesTitre")} intro={tHome("pepitesIntro")} align="gauche">
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {cuvees.map((c) => (
              <li key={c.id}>
                <article>
                  <div className="overflow-hidden rounded-carte">
                    <Photo image={c.photo} ratio="4/5" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <p className="mt-space-2 text-sur-titre-petit text-bronze">{[c.domaine, c.village].filter(Boolean).join(" · ")}</p>
                  <h3 className="mt-1 text-[1.375rem] font-bold leading-tight">{c.nom}</h3>
                  {c.histoire && <p className="mt-space-1 text-gris-chaud">{c.histoire}</p>}
                </article>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section className={cuvees.length ? "" : "!pt-space-3"} titre={cuvees.length ? t("domainesTitre") : undefined} align="gauche">
        <VigneronsFiltres vignerons={vignerons} />
      </Section>
      <Section fond="chaude">
        <SelectionBox lienSelection={false} />
      </Section>
    </>
  );
}
