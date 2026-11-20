import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticles, getPageContent, getRubriquesSanity, rubriqueHref } from "@/sanity/content";

/** Code de la rubrique -> page fixe du Studio qui porte son texte (reprise de l'ancien site). */
const CLE_PAGE: Record<string, string> = { "tout-savoir": "tout-savoir", accords: "recettes" };
/** Textes par défaut des rubriques (messages), si la page ou la rubrique du Studio n'en a pas. */
const CLE_INTRO: Record<string, string> = {
  "tout-savoir": "toutSavoir",
  accords: "accords",
  portraits: "portraits",
  "terroirs-cepages": "terroirsCepages",
  oenotourisme: "oenotourisme",
  actualites: "actualites",
};

async function contenuRubrique(code: string, locale: Locale) {
  const [labels, page, rubriques, t] = await Promise.all([
    getRubriqueLabels(locale),
    CLE_PAGE[code] ? getPageContent(CLE_PAGE[code], locale) : null,
    getRubriquesSanity(locale),
    getTranslations({ locale, namespace: "mag" }),
  ]);
  const studio = rubriques.find((r) => r.cle === code);
  const intro = page?.intro ?? studio?.description ?? (CLE_INTRO[code] ? t(`rubriquesIntro.${CLE_INTRO[code]}` as "rubriquesIntro.toutSavoir") : undefined);
  return { labels, page, titre: page?.titre ?? labels[code], intro };
}

export async function rubriqueMetadata(code: string, locale: Locale): Promise<Metadata> {
  const { page, titre, intro } = await contenuRubrique(code, locale);
  const t = await getTranslations({ locale, namespace: "mag" });
  return pageMetadata({
    locale,
    href: rubriqueHref(code),
    seo: page?.seo,
    title: `${titre} | ${t("h1")}`,
    description: intro ?? t("metaDescription"),
  });
}

/** Page d'une rubrique du Mag (adresse historique) : texte de la page + articles de la rubrique. */
export async function RubriquePage({ code, locale }: { code: string; locale: Locale }) {
  const t = await getTranslations("mag");
  const tLegal = await getTranslations("legal");
  const [{ labels, page, titre, intro }, articles] = await Promise.all([contenuRubrique(code, locale), getArticles(locale)]);
  // Articles dont c'est la rubrique principale d'abord, puis ceux qui y apparaissent en secondaire.
  const liste = withDates(
    [...articles.filter((a) => a.rubriquePrincipale === code), ...articles.filter((a) => a.rubriquePrincipale !== code && a.rubriques.includes(code))],
    locale,
  );
  const autres = Object.keys(labels).filter((r) => r !== code && articles.some((a) => a.rubriques.includes(r)));

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("h1"), href: "/le-mag" }, { label: labels[code] }]} />
      <header className="mx-auto max-w-7xl px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:pt-space-5">
        <p className="text-sur-titre text-bronze">{page?.surTitre ?? t("h1")}</p>
        <h1 className="mt-space-1 text-titre-post">{titre}</h1>
        {intro && <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{intro}</p>}
      </header>
      {page?.contenu?.length ? (
        <Section className="!pt-space-3" align="gauche">
          <RichText value={page.contenu} locale={locale} className="max-w-3xl" />
        </Section>
      ) : null}
      <Section fond={page?.contenu?.length ? "chaude" : "blanc"} className={page?.contenu?.length ? "" : "!pt-space-3"}>
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
        {autres.length > 0 && (
          <nav aria-label={t("autresRubriques")} className="mt-space-5 border-t border-filet pt-space-3">
            <p className="text-sur-titre-petit text-bronze">{t("autresRubriques")}</p>
            <ul className="mt-space-1 flex flex-wrap gap-x-space-3 gap-y-space-1">
              {autres.map((r) => (
                <li key={r}>
                  <Link href={rubriqueHref(r)} className="text-[1.0625rem] underline decoration-or underline-offset-4 hover:text-bronze">
                    {labels[r]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="mt-space-4 text-center">
          <ButtonLink href="/le-mag" variant="secondaire">
            {t("retour")}
          </ButtonLink>
        </div>
      </Section>
      {page && page.faq.length > 0 && (
        <Section>
          <Faq items={page.faq} />
        </Section>
      )}
    </>
  );
}
