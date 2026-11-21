import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Chiffres } from "@/components/ui/Chiffres";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { Faq } from "@/components/ui/Faq";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata, SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import type { LineIconName } from "@/lib/line-icons";
import { formatsDegustationActifs, nav } from "@/lib/site";
import { getEspaceParticuliers, getEvenementsAVenir, getExperiences } from "@/sanity/content";

const HREF = "/tasting-troyes";

const OCCASIONS: [string, LineIconName][] = [
  ["amis", "groupe"],
  ["famille", "interlocuteur"],
  ["anniversaire", "calendrier"],
  ["groupe", "groupe"],
  ["sejour", "carte"],
  ["entreprise", "coffret"],
];
const LIEUX = ["domicile", "privatise", "partenaire", "troyes"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/tasting-troyes">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "degustationsPage" });
  const p = await getEspaceParticuliers(locale);
  return pageMetadata({ locale, href: HREF, seo: p.seo, title: t("metaTitle"), description: t("metaDescription"), image: p.hero.image });
}

/**
 * Dégustations privées (adresse historique /tasting-troyes/, gardée pour le référencement) :
 * une seule offre sur mesure. Les formats et les rendez-vous publics sont masqués
 * (formatsDegustationActifs dans src/lib/site.ts), pas supprimés.
 */
export default async function DegustationsPage({ params }: PageProps<"/[locale]/tasting-troyes">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("degustationsPage");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const tHome = await getTranslations("home");
  const [p, experiences, evenements] = await Promise.all([getEspaceParticuliers(locale), getExperiences(locale), getEvenementsAVenir(locale)]);

  const chiffres = p.chiffres.length
    ? p.chiffres
    : (["personnes", "duree", "lieu"] as const).map((k) => ({ valeur: t(`chiffres.${k}.valeur`), label: t(`chiffres.${k}.label`) }));
  const fmtDate = new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" });

  // Données structurées : chaque rendez-vous à venir est un événement pour Google.
  const jsonLd = evenements.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.titre,
    startDate: e.debut,
    endDate: e.fin,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.lieu || "Troyes", address: e.lieu || "Troyes" },
    image: e.image ? [e.image.src] : undefined,
    description: e.accroche,
    organizer: { "@type": "Organization", name: "Champagne de l'Aube", url: SITE_URL },
    offers: e.prix != null ? { "@type": "Offer", price: e.prix, priceCurrency: "EUR", availability: e.complet ? "https://schema.org/SoldOut" : "https://schema.org/InStock" } : undefined,
  }));

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("tasting") }]} />
      {/* Ouverture : tout le texte de présentation à côté de la photo (plus de section isolée ni de citation en double). */}
      <Hero
        surTitre={p.hero.surTitre ?? t("surTitre")}
        titre={p.hero.titre ?? t("h1")}
        intro={p.hero.intro ?? t("accroche")}
        image={p.hero.image}
        placeholder="sobre"
        placeholderText={tHome("photoAVenir")}
        actions={<ButtonLink href={{ pathname: HREF, hash: "organiser" }}>{t("ctaOrganiser")}</ButtonLink>}
        texteDabordMobile
        ratioPhoto="1/1"
      >
        <p className="mt-space-2 max-w-xl text-pretty text-[1.0625rem] text-gris-chaud">{t("presentation")}</p>
        <p className="mt-space-2 max-w-xl text-pretty text-[1.0625rem] text-gris-chaud">{t("presentation2")}</p>
        <p className="mt-space-2 max-w-xl text-[1.0625rem] text-gris-chaud">
          <strong className="font-bold italic text-bronze">{t("signature")}</strong>
        </p>
      </Hero>
      {p.chiffres.length > 0 && <Chiffres items={chiffres} />}

      {/* 1. Les particuliers de passage à Troyes */}
      <Section id="de-passage">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-titre-section sm:text-[2rem]">{t("passageTitre")}</h2>
          <p className="mt-space-2 text-[1.125rem] text-gris-chaud">{t("passageTexte1")}</p>
          <p className="mt-space-2 text-[1.125rem] text-gris-chaud">{t("passageTexte2")}</p>
          <div className="mt-space-3 flex flex-col items-start gap-space-2 sm:flex-row sm:items-center">
            <ButtonLink href={{ pathname: HREF, hash: "organiser" }}>{t("passageCta")}</ButtonLink>
            <Link href="/champagne-troyes" className="inline-flex min-h-11 items-center gap-1 text-sur-titre-petit underline decoration-or underline-offset-4 hover:text-bronze">
              {t("touristesLien")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section id="occasions" fond="chaude">
        <div className="grid gap-space-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-titre-section">{t("occasionsTitre")}</h2>
            <ul className="mt-space-3 grid gap-space-2 sm:grid-cols-2">
              {OCCASIONS.map(([k, icone]) => (
                <li key={k} className="flex items-center gap-space-2 rounded-carte border border-filet bg-blanc p-space-2">
                  <LineIcon name={icone} size={28} className="shrink-0 text-or" />
                  <span className="font-bold leading-snug">{t(`occasions.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-titre-section">{t("lieuxTitre")}</h2>
            <p className="mt-space-1 text-gris-chaud">{t("lieuxIntro")}</p>
            <ul className="mt-space-3 divide-y divide-filet border-y border-filet">
              {LIEUX.map((k) => (
                <li key={k} className="flex min-h-12 items-center gap-space-1">
                  <LineIcon name="lieu" size={20} className="text-bronze" />
                  {t(`lieux.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 2. Bars, restaurants, entreprises et organisateurs, puis l'invitation au partenariat */}
      <Section id="evenements-pro">
        <div className="grid gap-space-4 lg:grid-cols-[1.3fr_1fr] lg:gap-space-5">
          <div>
            <p className="text-sur-titre text-bronze">{t("proSurTitre")}</p>
            <h2 className="mt-space-1 text-titre-section sm:text-[2rem]">{t("proTitre")}</h2>
            <p className="mt-space-2 text-[1.125rem] text-gris-chaud">{t("proTexte1")}</p>
            <p className="mt-space-2 text-[1.125rem] text-gris-chaud">{t("proTexte2")}</p>
            <ButtonLink href={{ pathname: "/contact", hash: "pro" }} className="mt-space-3">
              {t("proCta")}
            </ButtonLink>
          </div>
          <aside aria-labelledby="partenariat-titre" className="self-start rounded-carte border border-filet bg-creme-clair p-space-3 sm:p-space-4">
            <LineIcon name="interlocuteur" size={32} className="text-or" />
            <h3 id="partenariat-titre" className="mt-space-2 text-[1.375rem] font-bold leading-tight">{t("partenariatTitre")}</h3>
            <p className="mt-space-1 text-gris-chaud">{t("partenariatTexte")}</p>
            <ButtonLink href={{ pathname: "/contact", hash: "pro" }} variant="secondaire" className="mt-space-3">
              {t("partenariatCta")}
            </ButtonLink>
          </aside>
        </div>
      </Section>

      {formatsDegustationActifs && (
      <Section id="formats" titre={p.experiencesTitre ?? t("experiencesTitre")} intro={p.experiencesIntro ?? t("experiencesIntro")}>
        {experiences.length ? (
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((e) => (
              <li key={e.slug}>
                <ExperienceCard experience={e} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto max-w-2xl text-center text-gris-chaud">{t("aucuneExperience")}</p>
        )}
      </Section>
      )}

      {formatsDegustationActifs && evenements.length > 0 && (
        <Section id="rendez-vous" fond="chaude" titre={p.evenementsTitre ?? t("rendezVousTitre")}>
          <ul className="space-y-space-4">
            {evenements.map((e) => (
              <li key={e.debut + e.titre} className="grid gap-space-3 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4 md:grid-cols-[1fr_1.4fr]">
                <Photo image={e.image} ratio="4/3" sizes="(min-width: 768px) 40vw, 100vw" />
                <div>
                  <h3 className="text-titre-section">{e.titre}</h3>
                  <ul className="mt-space-2 space-y-1 text-gris-chaud">
                    <li className="flex items-center gap-space-1">
                      <LineIcon name="calendrier" size={20} className="text-bronze" />
                      {fmtDate.format(new Date(e.debut))}
                    </li>
                    {e.lieu && (
                      <li className="flex items-center gap-space-1">
                        <LineIcon name="lieu" size={20} className="text-bronze" />
                        {e.lienCarte ? (
                          <a href={e.lienCarte} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-bronze">
                            {e.lieu}
                          </a>
                        ) : (
                          e.lieu
                        )}
                      </li>
                    )}
                    {(e.places || e.complet) && (
                      <li className="flex items-center gap-space-1">
                        <LineIcon name="groupe" size={20} className="text-bronze" />
                        {e.complet ? t("complet") : t("places", { places: e.places ?? 0 })}
                      </li>
                    )}
                    {e.prix != null && (
                      <li className="flex items-center gap-space-1">
                        <LineIcon name="tarif" size={20} className="text-bronze" />
                        {t("prix", { prix: e.prix })}
                        {e.prixPrecision ? ` · ${e.prixPrecision}` : ""}
                      </li>
                    )}
                  </ul>
                  {e.accroche && <p className="mt-space-2">{e.accroche}</p>}
                  {e.description?.length ? <RichText value={e.description} locale={locale} className="mt-space-2 text-gris-chaud" /> : null}
                  {!e.complet && (
                    <details className="group mt-space-3">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-etiquette bg-anthracite px-space-3 text-sur-titre text-blanc hover:bg-anthracite/85 [&::-webkit-details-marker]:hidden">
                        {t("inscription")}
                      </summary>
                      <div className="mt-space-3">
                        <p className="mb-space-2 font-bold">{t("inscriptionTitre", { titre: e.titre })}</p>
                        <LeadForm formId="inscriptionEvenement" context={`${e.titre} · ${fmtDate.format(new Date(e.debut))}`} />
                      </div>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="organiser">
        <section aria-labelledby="organiser-titre" className="mx-auto max-w-3xl scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
          <LineIcon name="degustation" size={32} className="text-or" />
          <h2 id="organiser-titre" className="mt-space-2 text-titre-section">{t("formTitre")}</h2>
          <p className="mt-space-1 text-gris-chaud">{t("formTexte")}</p>
          <div className="mt-space-3">
            <LeadForm formId="degustationPrivee" />
          </div>
        </section>
      </Section>

      <DansLeMag locale={locale} chemins={["/tasting-troyes"]} rubrique="accords" fond="chaude" />

      <Section id="grands-evenements" fond="chaude">
        {p.evenementsPrives.image && (
          <div className="mx-auto mb-space-4 max-w-3xl overflow-hidden rounded-carte">
            <Photo image={p.evenementsPrives.image} ratio="16/9" sizes="(min-width: 768px) 768px, 100vw" />
          </div>
        )}
        <div className="mx-auto max-w-3xl text-center">
          <LineIcon name="calendrier" size={32} className="mx-auto block text-or" />
          <h2 className="mt-space-2 text-titre-section sm:text-[2rem]">{p.evenementsPrives.titre ?? t("evenementsTitre")}</h2>
          {p.evenementsPrives.texte?.length ? (
            <RichText value={p.evenementsPrives.texte} locale={locale} className="mt-space-2 text-gris-chaud" />
          ) : (
            <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{t("privesTexte")}</p>
          )}
          <ButtonLink href={nav.particuliers[1].href} variant="secondaire" className="mt-space-3">
            {t("ctaEvenements")}
          </ButtonLink>
        </div>
      </Section>

      {p.faq.length > 0 && (
        <Section titre={tUi("faqTitle")}>
          <Faq items={p.faq} />
        </Section>
      )}
      {formatsDegustationActifs && jsonLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
