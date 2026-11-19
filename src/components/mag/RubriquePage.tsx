import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticles, getPageContent, PAGES_RUBRIQUE } from "@/sanity/content";

type Code = keyof typeof PAGES_RUBRIQUE;
/** Code de la rubrique -> page fixe du Studio qui porte son texte (reprise de l'ancien site). */
const CLE_PAGE: Record<Code, string> = { "tout-savoir": "tout-savoir", accords: "recettes" };

export async function rubriqueMetadata(code: Code, locale: Locale): Promise<Metadata> {
  const [labels, page, t] = await Promise.all([getRubriqueLabels(locale), getPageContent(CLE_PAGE[code], locale), getTranslations({ locale, namespace: "mag" })]);
  return pageMetadata({
    locale,
    href: PAGES_RUBRIQUE[code],
    seo: page.seo,
    title: `${page.titre ?? labels[code]} | Champagne de l'Aube`,
    description: page.intro ?? t("metaDescription"),
  });
}

/** Page d'une rubrique du Mag (adresse historique) : texte de la page + articles de la rubrique. */
export async function RubriquePage({ code, locale }: { code: Code; locale: Locale }) {
  const t = await getTranslations("mag");
  const tLegal = await getTranslations("legal");
  const [labels, page, articles] = await Promise.all([getRubriqueLabels(locale), getPageContent(CLE_PAGE[code], locale), getArticles(locale)]);
  const liste = withDates(articles.filter((a) => a.rubriques.includes(code)), locale);
  const titre = page.titre ?? labels[code];

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1"), href: "/le-mag" }, { label: labels[code] }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{page.surTitre ?? t("h1")}</p>
        <h1 className="mt-space-1 text-titre-post">{titre}</h1>
        {page.intro && <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{page.intro}</p>}
      </header>
      {page.contenu?.length ? (
        <Section className="!pt-space-3" align="gauche">
          <RichText value={page.contenu} locale={locale} className="max-w-3xl" />
        </Section>
      ) : null}
      <Section fond={page.contenu?.length ? "chaude" : "blanc"} className={page.contenu?.length ? "" : "!pt-space-3"}>
        {liste.length ? (
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {liste.map((a) => (
              <li key={a.slug}>
                <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gris-chaud">{t("vide")}</p>
        )}
        <div className="mt-space-4 text-center">
          <ButtonLink href="/le-mag" variant="secondaire">
            {t("retour")}
          </ButtonLink>
        </div>
      </Section>
      {page.faq.length > 0 && (
        <Section>
          <Faq items={page.faq} />
        </Section>
      )}
    </>
  );
}
