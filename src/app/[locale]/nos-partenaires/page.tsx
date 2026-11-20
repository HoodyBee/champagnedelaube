import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getVignerons } from "@/sanity/content";

const HREF = "/nos-partenaires";

export async function generateMetadata({ params }: PageProps<"/[locale]/nos-partenaires">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "partenairesPage" });
  // Cachée à Google pour l'instant (page prête pour plus tard).
  return pageMetadata({ locale, href: HREF, seo: { noIndex: true }, title: t("metaTitle"), description: t("metaDescription") });
}

/** Nos partenaires : UNIQUEMENT les vignerons partenaires (case « Partenaire » de leur fiche), avec un lien vers leur fiche. */
export default async function PartenairesPage({ params }: PageProps<"/[locale]/nos-partenaires">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("partenairesPage");
  const tNav = await getTranslations("nav");
  const partenaires = (await getVignerons(locale)).filter((v) => v.partenaire);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("proEntreprises") }, { label: t("titre") }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto max-w-3xl px-space-2 py-space-5 text-center sm:px-space-4">
          <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
          <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
          <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{t("intro")}</p>
        </div>
      </section>
      <Section>
        <ul className="mx-auto grid max-w-4xl gap-space-3 sm:grid-cols-2">
          {partenaires.map((v) => (
            <li key={v.slug}>
              <DomaineCard domaine={v} />
            </li>
          ))}
        </ul>
        <div className="mt-space-5 text-center">
          <p className="text-accroche">{t("devenir")}</p>
          <ButtonLink href={nav.pro[1].href} variant="secondaire" className="mt-space-2">
            {t("devenirBouton")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
