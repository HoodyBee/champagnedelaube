import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagFiltres } from "@/components/mag/MagFiltres";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
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
  const datees = withDates(articles, locale);
  // « À la une » : l'article le plus récent, en grand, dès qu'il y en a au moins 3.
  const une = datees.length >= 3 ? datees[0] : undefined;
  const suite = une ? datees.slice(1) : datees;

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1") }]} />
      {/* En-tête façon magazine : sur-titre, grand titre, double filet doré */}
      <header className="mx-auto max-w-7xl px-space-2 pb-space-3 pt-space-4 text-center sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
        <h1 className="mt-space-1 text-titre-post sm:text-[3.25rem]">{t("h1")}</h1>
        <p className="mx-auto mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{t("intro")}</p>
        <div aria-hidden="true" className="mx-auto mt-space-3 flex max-w-xs flex-col gap-1">
          <span className="h-px bg-or" />
          <span className="h-px bg-or/40" />
        </div>
      </header>

      {une && (
        <Section className="!pt-space-2" align="gauche">
          <p className="text-sur-titre text-bronze">{t("aLaUne")}</p>
          <Link
            href={{ pathname: "/[article]", params: { article: une.slug } }}
            className="group mt-space-2 grid items-center gap-space-3 lg:grid-cols-[1.4fr_1fr] lg:gap-space-5"
          >
            <div className="overflow-hidden rounded-carte">
              <Photo image={une.image} ratio="16/9" sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <div>
              <p className="text-sur-titre-petit text-bronze">{[une.rubriques.map((r) => labels[r]).filter(Boolean)[0], une.dateLabel].filter(Boolean).join(" · ")}</p>
              <h2 className="mt-space-1 text-titre-section group-hover:text-bronze sm:text-[2.25rem]">{une.titre}</h2>
              {une.extrait && <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{une.extrait}</p>}
              <span className="mt-space-3 inline-flex items-center gap-space-1 text-sur-titre-petit">
                {t("lire")} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Section>
      )}

      <Section className={une ? "" : "!pt-space-3"} align="gauche" titre={une && suite.length ? t("tousLesArticles") : undefined}>
        <MagFiltres articles={une ? suite : datees} labels={labels} ordre={ordreRubriques(labels)} />
      </Section>
    </>
  );
}
