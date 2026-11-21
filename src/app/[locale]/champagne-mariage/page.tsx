import type { Metadata } from "next";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import type { LineIconName } from "@/lib/line-icons";
import { nav } from "@/lib/site";
import { getPageContent } from "@/sanity/content";

const HREF = "/champagne-mariage";
const CLE = "mariage";

/**
 * Les occasions. `href` : page dédiée de l'occasion (ex. baptême), à renseigner
 * quand elle existera, pour relier les pages entre elles (maillage interne).
 */
const OCCASIONS: { key: "mariage" | "bapteme" | "famille" | "groupee"; icone: LineIconName }[] = [
  { key: "mariage", icone: "calendrier" },
  { key: "bapteme", icone: "groupe" },
  { key: "famille", icone: "coffret" },
  { key: "groupee", icone: "livraison" },
];

export async function generateMetadata({ params }: PageProps<"/[locale]/champagne-mariage">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "evenementsPage" });
  const page = await getPageContent(CLE, locale);
  return pageMetadata({ locale, href: HREF, seo: page.seo, title: t("metaTitle"), description: t("metaDescription"), image: page.image });
}

/** Vos Grands Événements : mariage, baptême, fêtes de famille, commandes groupées. */
export default async function GrandsEvenementsPage({ params }: PageProps<"/[locale]/champagne-mariage">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("evenementsPage");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const page = await getPageContent(CLE, locale);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("tasting"), href: nav.particuliers[0].href }, { label: tNav("mariage") }]} />
      <Hero
        surTitre={page.surTitre ?? t("surTitre")}
        titre={page.titre ?? t("h1")}
        intro={page.intro ?? t("intro")}
        image={page.image}
        placeholderLabel={tUi("photoSoon")}
        actions={<ButtonLink href={{ pathname: HREF, hash: "conseil" }}>{t("cta")}</ButtonLink>}
      />

      <Section id="occasions" titre={t("occasionsTitre")}>
        <ul className="grid gap-space-3 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((o) => (
            <li key={o.key} className="rounded-carte border border-filet bg-blanc p-space-3">
              <LineIcon name={o.icone} size={32} className="text-or" />
              <h3 className="mt-space-2 text-[1.25rem] font-bold leading-tight">{t(`occasions.${o.key}.titre`)}</h3>
              <p className="mt-space-1 text-gris-chaud">{t(`occasions.${o.key}.texte`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="accompagnement" fond="chaude" titre={t("etapesTitre")}>
        <ol className="grid gap-space-4 md:grid-cols-3">
          {(["1", "2", "3"] as const).map((k) => (
            <li key={k} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-rond border border-or text-accroche text-bronze">{k}</span>
              <h3 className="mt-space-2 text-[1.25rem] font-bold leading-tight">{t(`etapes.${k}.titre`)}</h3>
              <p className="mx-auto mt-space-1 max-w-xs text-gris-chaud">{t(`etapes.${k}.texte`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {page.contenu?.length ? (
        <Section>
          <RichText value={page.contenu} locale={locale} className="mx-auto max-w-3xl" />
        </Section>
      ) : null}

      {page.faq.length > 0 && (
        <Section id="questions" titre={t("faqTitre")}>
          <Faq items={page.faq} />
        </Section>
      )}

      <DansLeMag locale={locale} chemins={["/champagne-mariage"]} rubrique="accords" fond={page.faq.length > 0 ? "blanc" : "chaude"} />

      <Section fond={page.faq.length > 0 ? "chaude" : "blanc"}>
        <section id="conseil" aria-labelledby="conseil-titre" className="mx-auto max-w-3xl scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
          <LineIcon name="conseil" size={32} className="text-or" />
          <h2 id="conseil-titre" className="mt-space-2 text-titre-section">{t("formTitre")}</h2>
          <p className="mt-space-1 text-gris-chaud">{t("formTexte")}</p>
          <div className="mt-space-3">
            <LeadForm formId="conseilEvenement" />
          </div>
        </section>
      </Section>
    </>
  );
}
