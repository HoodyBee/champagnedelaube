import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CepagePastille } from "@/components/brand/CepagePastille";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getCepages, type CepagePage } from "@/sanity/content";

const HREF = "/les-cepages-de-laube";
const GROUPES = ["grands", "rares", "nouveaux"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/les-cepages-de-laube">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "cepagesPage" });
  return pageMetadata({ locale, href: HREF, title: t("metaTitle"), description: t("metaDescription") });
}

/** Page générale « Les cépages de l'appellation Champagne » : intro, puis les 8 cépages, avec une ancre chacun (#pinot-noir…). */
export default async function CepagesPage({ params }: PageProps<"/[locale]/les-cepages-de-laube">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const liste = await getCepages(locale);
  const { paragrapheEnBloc } = await import("@/lib/terroirs-contenu");
  const t = await getTranslations("cepagesPage");
  const tNav = await getTranslations("nav");

  const carte = (c: CepagePage) => (
    <li key={c.cle} id={c.cle} className="scroll-mt-28 flex flex-col rounded-carte border border-filet bg-blanc p-space-3">
      <h3 className="text-[1.25rem] font-bold leading-tight">
        <CepagePastille cepage={c.cle} size={44} />
      </h3>
      <p className="mt-space-1 text-sur-titre-petit text-gris-chaud">
        {c.couleur} · {c.statut === "vifa" ? t("statutVifa") : t("statutPrincipal")}
      </p>
      <p className="mt-space-2 flex-1 text-gris-chaud">{c.resume}</p>
      <Link
        href={{ pathname: "/les-cepages-de-laube/[cepage]", params: { cepage: c.cle } }}
        className="mt-space-2 inline-flex min-h-11 items-center gap-space-1 self-start text-sur-titre-petit text-anthracite underline decoration-or underline-offset-4 hover:text-bronze"
        aria-label={t("enSavoirPlus", { nom: c.nom })}
      >
        {t("enSavoirPlusCourt")} <span aria-hidden="true">→</span>
      </Link>
    </li>
  );

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("terroirHub"), href: nav.terroirHub.href }, { label: t("titre") }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto max-w-3xl px-space-2 py-space-5 text-center sm:px-space-4">
          <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
          <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
          <RichText value={[paragrapheEnBloc(t("intro"), locale)]} locale={locale} className="mt-space-3 text-[1.125rem] text-gris-chaud" />
        </div>
      </section>

      <Section titre={t("listeTitre")} intro={t("listeIntro")}>
        {GROUPES.map((g) => {
          const items = liste.filter((c) => c.groupe === g);
          return (
            <div key={g} className="mt-space-4 first:mt-0">
              <h2 className="text-sur-titre text-bronze">{t(`groupes.${g}`)}</h2>
              <ul className="mt-space-2 grid gap-space-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(carte)}</ul>
            </div>
          );
        })}
        <p className="mx-auto mt-space-4 max-w-3xl text-center text-legende text-gris-chaud">{t("sourcesNote")}</p>
      </Section>

      <Section fond="chaude">
        <div className="flex flex-col items-center justify-center gap-space-1 sm:flex-row">
          <ButtonLink href={nav.particuliers[0].href}>{t("tastingBouton")}</ButtonLink>
          <ButtonLink href={nav.vignerons.href} variant="secondaire">{t("selectionBouton")}</ButtonLink>
          <ButtonLink href={nav.terroirHub.href} variant="secondaire">{tNav("terroirHubLink")}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
