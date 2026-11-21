import type { Metadata } from "next";
import { PHOTOS_TROYES as PHOTOS } from "@/lib/troyes-photos";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { pageMetadata, SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { paragrapheEnBloc } from "@/lib/terroirs-contenu";
import { imgDepuisAsset } from "@/sanity/content";

const HREF = "/champagne-troyes";
/** Ancre du formulaire de demande sur la page Dégustations privées. */
const DEMANDE = { pathname: "/tasting-troyes", hash: "organiser" } as const;
const TRAJETS = ["montgueux", "cdb", "riceys", "bsa"] as const;
const LIEN_TRAJET = { montgueux: "/montgueux", cdb: "/la-cote-des-bar", riceys: "/les-riceys", bsa: "/la-cote-des-bar" } as const;

/**
 * Photos de la Médiathèque (seulement des photos prises à Troyes pour illustrer Troyes ;
 * ailleurs, une légende honnête). Sources des textes : docs/troyes-sources.md.
 */

export async function generateMetadata({ params }: PageProps<"/[locale]/champagne-troyes">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "troyesPage" });
  const fr = await getTranslations({ locale: "fr", namespace: "troyesPage" });
  const en = await getTranslations({ locale: "en", namespace: "troyesPage" });
  const image = imgDepuisAsset(PHOTOS.hero.asset, PHOTOS.hero.fichier, { fr: fr("altHero"), en: en("altHero") }, locale, 1600, undefined, PHOTOS.hero.credit);
  return pageMetadata({ locale, href: HREF, title: t("metaTitle"), description: t("metaDescription"), image });
}

/** Troyes : la ville des comtes de Champagne, porte d'entrée du vignoble, et nos dégustations privées. */
export default async function TroyesPage({ params }: PageProps<"/[locale]/champagne-troyes">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("troyesPage");
  const fr = await getTranslations({ locale: "fr", namespace: "troyesPage" });
  const en = await getTranslations({ locale: "en", namespace: "troyesPage" });
  const alt = (k: "altHero" | "altVignes" | "altAccord") => ({ fr: fr(k), en: en(k) });
  const leg = (k: "legendeVignes" | "legendeAccord") => ({ fr: fr(k), en: en(k) });
  const hero = imgDepuisAsset(PHOTOS.hero.asset, PHOTOS.hero.fichier, alt("altHero"), locale, 1600, undefined, PHOTOS.hero.credit);
  const vignes = imgDepuisAsset(PHOTOS.vignes.asset, PHOTOS.vignes.fichier, alt("altVignes"), locale, 1200, leg("legendeVignes"));
  const accord = imgDepuisAsset(PHOTOS.accord.asset, PHOTOS.accord.fichier, alt("altAccord"), locale, 1200, leg("legendeAccord"));
  const faq = (["1", "2", "3"] as const).map((n) => ({ question: t(`faq.q${n}`), reponse: t(`faq.r${n}`) }));
  const liens = [
    ["terroirs", "/le-terroir-de-laube"],
    ["montgueux", "/montgueux"],
    ["cdb", "/la-cote-des-bar"],
    ["cepages", "/cepages-champagne"],
    ["mag", "/le-mag"],
    ["degustations", "/tasting-troyes"],
  ] as const;

  // Données structurées : Troyes comme destination touristique (coordonnées du centre de la commune, geo.api.gouv.fr).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Troyes",
    description: t("metaDescription"),
    url: `${SITE_URL}${locale === "fr" ? "" : `/${locale}`}${HREF}/`,
    geo: { "@type": "GeoCoordinates", latitude: 48.2924, longitude: 4.0761 },
    containedInPlace: { "@type": "AdministrativeArea", name: "Aube" },
    ...(hero ? { image: hero.og ?? hero.src } : {}),
  };

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("fil") }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
          <div className="lg:order-1">
            <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
            <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
            <p className="mt-space-3 max-w-xl text-[1.125rem] text-gris-chaud">{t("intro")}</p>
            <ButtonLink href={DEMANDE} className="mt-space-3">
              {t("cta")}
            </ButtonLink>
          </div>
          <Photo image={hero} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile className="lg:order-2" />
        </div>
      </section>

      {/* Histoire et « De passage à Troyes ? » côte à côte : plus d'encadré isolé plus bas. */}
      <Section>
        <div className="grid items-start gap-space-4 lg:grid-cols-[1.5fr_1fr] lg:gap-space-5">
          <div>
            <h2 className="text-titre-section sm:text-[2rem]">{t("histoireTitre")}</h2>
            <div className="mt-space-2 space-y-space-2 text-[1.0625rem]">
              <p>{t("histoire1")}</p>
              <p>{t("histoire2")}</p>
            </div>
          </div>
          <aside aria-labelledby="venir-titre" className="rounded-carte border border-filet bg-creme-clair p-space-3 sm:p-space-4">
            <h2 id="venir-titre" className="text-[1.375rem] font-bold leading-tight">{t("venirTitre")}</h2>
            <p className="mt-space-2">{t("venirTexte1")}</p>
            <p className="mt-space-1 text-gris-chaud">{t("venirTexte2")}</p>
            <ButtonLink href={DEMANDE} className="mt-space-3">
              {t("cta")}
            </ButtonLink>
          </aside>
        </div>
      </Section>

      <Section fond="chaude">
        <div className="grid items-start gap-space-4 lg:grid-cols-[1.3fr_1fr] lg:gap-space-5">
          <div>
            <h2 className="text-titre-section">{t("vignobleTitre")}</h2>
            <p className="mt-space-2 text-gris-chaud">{t("vignobleIntro")}</p>
            <table className="mt-space-2 w-full border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-filet">
                  <th scope="col" className="py-space-1 pr-space-2 text-sur-titre-petit text-bronze">{t("trajetsColLieu")}</th>
                  <th scope="col" className="py-space-1 text-sur-titre-petit text-bronze">{t("trajetsColTrajet")}</th>
                </tr>
              </thead>
              <tbody>
                {TRAJETS.map((k) => (
                  <tr key={k} className="border-b border-filet">
                    <th scope="row" className="py-space-1 pr-space-2 font-bold">
                      <Link href={LIEN_TRAJET[k]} className="underline decoration-or underline-offset-4 hover:text-bronze">
                        {t(`trajets.${k}`)}
                      </Link>
                    </th>
                    <td className="py-space-1">{t(`trajetsValeurs.${k}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-space-1 text-legende text-gris-chaud">{t("trajetsNote")}</p>
            <p className="mt-space-3">{t("vignobleTexte")}</p>
          </div>
          <Photo image={vignes} ratio="4/3" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </Section>

      <Section fond="chaude">
        <div className="grid items-center gap-space-4 lg:grid-cols-[1fr_1.3fr] lg:gap-space-5">
          <Photo image={accord} ratio="4/3" sizes="(min-width: 1024px) 40vw, 100vw" className="lg:order-1" />
          <div className="lg:order-2">
            <h2 className="text-titre-section">{t("gastroTitre")}</h2>
            <p className="mt-space-2">{t("gastro1")}</p>
            <RichText value={[paragrapheEnBloc(t("gastro2"), locale)]} locale={locale} className="mt-space-2" />
          </div>
        </div>
      </Section>

      <Section titre={t("faqTitre")}>
        <Faq items={faq} />
      </Section>

      <DansLeMag locale={locale} chemins={[HREF, "/tasting-troyes"]} rubrique="actualites" fond="chaude" />

      <Section titre={t("allerTitre")}>
        <ul className="mx-auto grid max-w-4xl gap-space-2 sm:grid-cols-2 lg:grid-cols-3">
          {liens.map(([k, href]) => (
            <li key={k}>
              <Link href={href} className="flex min-h-12 items-center justify-between gap-space-1 rounded-carte border border-filet bg-blanc px-space-2 py-space-2 transition-colors hover:border-or hover:text-bronze">
                <span className="font-bold leading-snug">{t(`liens.${k}`)}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
