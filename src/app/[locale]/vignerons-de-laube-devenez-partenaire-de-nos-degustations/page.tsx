import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Arguments } from "@/components/ui/Arguments";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getPageContent } from "@/sanity/content";

const HREF = "/vignerons-de-laube-devenez-partenaire-de-nos-degustations";
const CLE = "pro-vignerons";

export async function generateMetadata({ params }: PageProps<"/[locale]/vignerons-de-laube-devenez-partenaire-de-nos-degustations">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "partenairePage" });
  const page = await getPageContent(CLE, locale);
  return pageMetadata({ locale, href: HREF, seo: page.seo, title: t("metaTitle"), description: t("metaDescription") });
}

/** Vignerons : devenez partenaire. Présentation courte + formulaire de candidature. */
export default async function PartenairePage({ params }: PageProps<"/[locale]/vignerons-de-laube-devenez-partenaire-de-nos-degustations">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("partenairePage");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const page = await getPageContent(CLE, locale);
  const titre = page.titre ?? t("h1");

  const points = (["selection", "publics", "degustations"] as const).map((k, i) => ({
    icone: (["vigneron", "groupe", "degustation"] as const)[i],
    titre: t(`points.${k}.titre`),
    texte: t(`points.${k}.texte`),
  }));

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("pro") }, { label: titre }]} />
      <header className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 pb-space-2 pt-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:pt-space-5">
        <div>
          <p className="text-sur-titre text-bronze">{page.surTitre ?? t("surTitre")}</p>
          <h1 className="mt-space-1 text-titre-post">{titre}</h1>
          <p className="mt-space-2 max-w-2xl text-[1.125rem] text-gris-chaud">{page.intro ?? t("intro")}</p>
          <ButtonLink href={{ pathname: HREF, hash: "candidature" }} className="mt-space-3">
            {t("formTitre")}
          </ButtonLink>
        </div>
        {page.image && <Photo image={page.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority placeholderLabel={tUi("photoSoon")} />}
      </header>

      <Section>
        <Arguments items={points} />
        {page.contenu?.length ? <RichText value={page.contenu} locale={locale} className="mx-auto mt-space-5 max-w-3xl" /> : null}
      </Section>

      <Section fond="chaude">
        <section id="candidature" aria-labelledby="candidature-titre" className="mx-auto max-w-3xl scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
          <h2 id="candidature-titre" className="text-titre-section">{t("formTitre")}</h2>
          <p className="mt-space-1 text-gris-chaud">{t("formTexte")}</p>
          <div className="mt-space-3">
            <LeadForm formId="partenaireVigneron" />
          </div>
        </section>
      </Section>

      <Section>
        <div className="text-center">
          <ButtonLink href={nav.vignerons.href} variant="secondaire">
            {tNav("vignerons")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
