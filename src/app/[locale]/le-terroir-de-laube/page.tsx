import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CepagePastille } from "@/components/brand/CepagePastille";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Hero } from "@/components/ui/Hero";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { TerroirCards } from "@/components/ui/TerroirCards";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getTerroirAube } from "@/sanity/content";

const HREF = "/le-terroir-de-laube";

export async function generateMetadata({ params }: PageProps<"/[locale]/le-terroir-de-laube">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const p = await getTerroirAube(locale);
  return pageMetadata({ locale, href: HREF, seo: p.seo, title: p.seo.title!, description: p.seo.description! });
}

/** Les Terroirs Aubois : page centrale (situation, sols, climat, histoire, cépages, 4 terroirs). */
export default async function TerroirAubePage({ params }: PageProps<"/[locale]/le-terroir-de-laube">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const p = await getTerroirAube(locale);
  const t = await getTranslations("terroirPage");
  const tNav = await getTranslations("nav");
  const tPro = await getTranslations("terroirPage");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("terroirHub") }]} />
      <Hero surTitre={p.hero.surTitre} titre={p.hero.titre!} intro={p.hero.intro} image={p.hero.image} />

      <Section id="terroirs" titre={t("carteTitre")} intro={t("carteIntro")}>
        <div className="mx-auto max-w-2xl">
          <TerroirCards />
        </div>
      </Section>

      {p.chapitres.map((c, i) => (
        <Section key={c.titre} fond={i % 2 === 0 ? "chaude" : "blanc"}>
          <div className="grid items-center gap-space-4 lg:grid-cols-2 lg:gap-space-5">
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="text-titre-section sm:text-[2rem]">{c.titre}</h2>
              <RichText value={c.texte} locale={locale} className="mt-space-2 text-gris-chaud" />
            </div>
            <Photo image={c.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" className={i % 2 === 1 ? "lg:order-1" : ""} />
          </div>
        </Section>
      ))}

      <Section id="cepages" fond={p.chapitres.length % 2 === 0 ? "chaude" : "blanc"} titre={p.cepagesTitre}>
        <RichText value={p.cepagesIntro} locale={locale} className="mx-auto max-w-3xl text-center text-gris-chaud" />
        <ul className="mt-space-4 grid gap-space-3 sm:grid-cols-3">
          {p.cepagesTextes.map((c) => (
            <li key={c.cepage} className="flex flex-col items-center text-center">
              <CepagePastille cepage={c.cepage} size={44} />
              <p className="mt-space-2 max-w-xs text-gris-chaud">{c.texte}</p>
            </li>
          ))}
        </ul>
      </Section>

      {p.faq.length > 0 && (
        <Section titre={t("faqTitre")}>
          <Faq items={p.faq} />
        </Section>
      )}

      <Section fond="chaude">
        <div className="flex flex-col items-center justify-center gap-space-1 sm:flex-row">
          <ButtonLink href={nav.particuliers[0].href}>{tNav("tasting")}</ButtonLink>
          <ButtonLink href={nav.vignerons.href} variant="secondaire">{tNav("vignerons")}</ButtonLink>
          <ButtonLink href={nav.pro[0].href} variant="secondaire">{tPro("offrePro")}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
