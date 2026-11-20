import type { Metadata } from "next";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Arguments } from "@/components/ui/Arguments";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import type { LineIconName } from "@/lib/line-icons";
import { getEspaceEntreprises, type Bloc } from "@/sanity/content";

const HREF = "/cse-et-cadeaux-dentreprise";

export async function generateMetadata({ params }: PageProps<"/[locale]/cse-et-cadeaux-dentreprise">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "entreprisesPage" });
  const p = await getEspaceEntreprises(locale);
  return pageMetadata({ locale, href: HREF, seo: p.seo, title: t("metaTitle"), description: t("metaDescription") });
}

/** Entreprises & CSE : coffrets, animations, devis sur-mesure et brochure CSE. */
export default async function EntreprisesPage({ params }: PageProps<"/[locale]/cse-et-cadeaux-dentreprise">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("entreprisesPage");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const p = await getEspaceEntreprises(locale);

  const offre = (k: "coffrets" | "animations", icone: LineIconName) => {
    const b: Bloc = p[k];
    return {
      icone: b.icone ?? icone,
      surTitre: b.surTitre ?? t(`${k}.surTitre`),
      titre: b.titre ?? t(`${k}.titre`),
      texte: b.texte,
      texteDefaut: t(`${k}.texte`),
      points: b.points.length ? b.points : (t.raw(`${k}.points`) as string[]),
      image: b.image,
    };
  };
  const offres = [offre("coffrets", "coffret"), offre("animations", "groupe")];
  const args = (["interlocuteur", "vignerons", "surMesure"] as const).map((k, i) => ({
    icone: (["interlocuteur", "vigneron", "conseil"] as const)[i],
    titre: t(`arguments.${k}.titre`),
    texte: t(`arguments.${k}.texte`),
  }));

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("proEntreprises") }, { label: tNav("entreprises") }]} />
      <Hero
        surTitre={p.hero.surTitre ?? t("surTitre")}
        titre={p.hero.titre ?? t("h1")}
        intro={p.hero.intro ?? t("intro")}
        image={p.hero.image}
        placeholderLabel={tUi("photoSoon")}
        actions={
          <>
            <ButtonLink href={{ pathname: HREF, hash: "devis" }}>{t("ctaDevis")}</ButtonLink>
            <ButtonLink href={{ pathname: HREF, hash: "brochure" }} variant="secondaire">
              {t("ctaBrochure")}
            </ButtonLink>
          </>
        }
      />

      {offres.map((o, i) => (
        <Section key={o.titre} id={i === 0 ? "coffrets" : "animations"} fond={i === 0 ? "blanc" : "chaude"}>
          <div className="grid items-center gap-space-4 lg:grid-cols-2 lg:gap-space-5">
            <div className={i === 1 ? "lg:order-2" : ""}>
              <LineIcon name={o.icone} size={32} className="text-or" />
              <p className="mt-space-2 text-sur-titre text-bronze">{o.surTitre}</p>
              <h2 className="mt-space-1 text-titre-section sm:text-[2rem]">{o.titre}</h2>
              {o.texte?.length ? (
                <RichText value={o.texte} locale={locale} className="mt-space-2 text-gris-chaud" />
              ) : (
                <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{o.texteDefaut}</p>
              )}
              <ul className="mt-space-3 space-y-space-1">
                {o.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-space-1">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-rond bg-or" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <Photo image={o.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" className={i === 1 ? "lg:order-1" : ""} />
          </div>
        </Section>
      ))}

      <Section titre={t("argumentsTitre")}>
        <Arguments items={args} />
      </Section>

      <DansLeMag locale={locale} chemins={["/cse-et-cadeaux-dentreprise"]} rubrique="accords" />

      <Section fond="chaude">
        <div className="grid gap-space-3 lg:grid-cols-[1.4fr_1fr]">
          <section id="devis" aria-labelledby="devis-titre" className="scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
            <LineIcon name="conseil" size={32} className="text-or" />
            <h2 id="devis-titre" className="mt-space-2 text-titre-section">{p.devisTitre ?? t("devisTitre")}</h2>
            <p className="mt-space-1 text-gris-chaud">{p.devisTexte ?? t("devisTexte")}</p>
            <div className="mt-space-3">
              <LeadForm formId="devisEntreprise" />
            </div>
          </section>
          <section id="brochure" aria-labelledby="brochure-titre" className="scroll-mt-28 self-start rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
            <LineIcon name="document" size={32} className="text-or" />
            <h2 id="brochure-titre" className="mt-space-2 text-titre-section">{p.brochureTitre ?? t("brochureTitre")}</h2>
            <p className="mt-space-1 text-gris-chaud">{p.brochureTexte ?? t("brochureTexte")}</p>
            <div className="mt-space-3">
              <LeadForm formId="brochureCse" />
            </div>
          </section>
        </div>
      </Section>

      {p.faq.length > 0 && (
        <Section titre={tUi("faqTitle")}>
          <Faq items={p.faq} />
        </Section>
      )}
    </>
  );
}
