import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Arguments } from "@/components/ui/Arguments";
import { ButtonLink } from "@/components/ui/Button";
import { Chiffres } from "@/components/ui/Chiffres";
import { EntreeCard } from "@/components/ui/EntreeCard";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { TerroirCards } from "@/components/ui/TerroirCards";
import { pageMetadata, SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { SelectionBox } from "@/components/selection/SelectionBox";
import { getAccueil, getProchainEvenement } from "@/sanity/content";
import { getReglages } from "@/sanity/queries";

const TERROIRS_LIGNE = "Côte des Bar · Les Riceys · Montgueux · Villenauxe-la-Grande";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "home" });
  const a = await getAccueil(locale);
  return pageMetadata({ locale, href: "/", seo: a.seo, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function Accueil({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tUi = await getTranslations("ui");
  const tNav = await getTranslations("nav");
  const [a, evenement, reglages] = await Promise.all([getAccueil(locale), getProchainEvenement(locale), getReglages()]);

  const chiffres = a.chiffres.length
    ? a.chiffres
    : [
        ...(["vignoble", "appellations", "pinot", "degustation"] as const).map((k) => ({
          valeur: t(`chiffres.${k}.valeur`),
          label: t(`chiffres.${k}.label`),
        })),
      ];
  const entree = (k: "pro" | "entreprises" | "particuliers") => {
    const e = a.entrees[k];
    return {
      surTitre: e.surTitre ?? t(`${k}.surTitre`),
      titre: e.titre ?? t(`${k}.titre`),
      texte: e.texte ?? t(`${k}.texte`),
      bouton: e.bouton ?? t(`${k}.bouton`),
      image: e.image,
    };
  };
  const reassurance = a.reassurance.length
    ? a.reassurance
    : (["selection", "interlocuteur", "terroir"] as const).map((k, i) => ({
        icone: (["vigneron", "interlocuteur", "carte"] as const)[i],
        titre: t(`reassurance.${k}.titre`),
        texte: t(`reassurance.${k}.texte`),
      }));

  // Données structurées : l'organisation et son activité locale à Troyes.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Champagne de l'Aube",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png`,
    image: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png`,
    email: reglages.email,
    address: { "@type": "PostalAddress", addressLocality: "Troyes", addressRegion: "Aube", addressCountry: "FR" },
    areaServed: "Aube",
    sameAs: ["https://www.instagram.com/champagnedelaube/", "https://www.facebook.com/292357553960308/"],
  };

  return (
    <>
      <Hero
        surTitre={a.hero.surTitre ?? TERROIRS_LIGNE}
        titre={a.hero.titre ?? t("heroTitre")}
        intro={a.hero.intro ?? t("heroIntro")}
        image={a.hero.image}
        placeholderLabel={tUi("photoSoon")}
        actions={
          <>
            <ButtonLink href={nav.terroirHub.href}>{t("heroCtaTerroir")}</ButtonLink>
            <ButtonLink href={nav.vignerons.href} variant="secondaire">
              {tNav("vignerons")}
            </ButtonLink>
          </>
        }
      />
      <Chiffres items={chiffres} />

      <Section id="entrees" titre={t("entreesTitre")}>
        <div className="grid gap-space-3 md:grid-cols-3">
          <EntreeCard href={nav.pro[0].href} placeholderLabel={tUi("photoSoon")} {...entree("pro")} />
          <EntreeCard href={nav.entreprises.href} placeholderLabel={tUi("photoSoon")} {...entree("entreprises")} />
          <EntreeCard href={nav.particuliers[0].href} placeholderLabel={tUi("photoSoon")} {...entree("particuliers")} />
        </div>
      </Section>

      {/* Respiration : une grande photo pleine largeur (paysage, village, mains au travail). */}
      <div data-reveal className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[21/9]">
        <Photo image={a.photoPleineLargeur} ratio="16/9" sizes="100vw" placeholderLabel="" className="absolute inset-0 !aspect-auto h-full w-full" />
      </div>

      <Section id="terroir" fond="chaude">
        <div className="grid items-center gap-space-4 lg:grid-cols-2 lg:gap-space-5">
          <div>
            <p className="text-sur-titre text-bronze">{a.terroir.surTitre ?? t("terroirSurTitre")}</p>
            <h2 className="mt-space-1 text-titre-section sm:text-[2rem]">{a.terroir.titre ?? t("terroirTitre")}</h2>
            {a.terroir.texte?.length ? (
              <RichText value={a.terroir.texte} locale={locale} className="mt-space-2 text-gris-chaud" />
            ) : (
              <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{t("terroirTexte")}</p>
            )}
            <ButtonLink href={nav.terroirHub.href} variant="secondaire" className="mt-space-3">
              {t("terroirCta")}
            </ButtonLink>
          </div>
          <div className="space-y-space-2">
            {a.terroir.image && <Photo image={a.terroir.image} ratio="3/2" sizes="(min-width: 1024px) 50vw, 100vw" placeholderLabel={tUi("photoSoon")} />}
            <TerroirCards />
          </div>
        </div>
      </Section>

      {/* Notre sélection évolue : pas de vitrine figée des domaines, un catalogue à recevoir. */}
      <Section id="selection">
        <SelectionBox titre={a.selectionTitre} texte={a.selectionTexte} />
      </Section>

      {evenement && (
        <Section id="rendez-vous">
          <div className="grid items-center gap-space-4 md:grid-cols-[1fr_1.2fr]">
            <Photo image={evenement.image} ratio="4/3" sizes="(min-width: 768px) 40vw, 100vw" placeholderLabel={tUi("photoSoon")} />
            <div>
              <p className="text-sur-titre text-bronze">{t("eventSurTitre")}</p>
              <h2 className="mt-space-1 text-titre-section">{evenement.titre}</h2>
              <ul className="mt-space-2 space-y-1 text-gris-chaud">
                <li className="flex items-center gap-space-1">
                  <LineIcon name="calendrier" size={20} className="text-bronze" />
                  {new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(evenement.debut))}
                </li>
                {evenement.lieu && (
                  <li className="flex items-center gap-space-1">
                    <LineIcon name="lieu" size={20} className="text-bronze" />
                    {evenement.lieu}
                  </li>
                )}
                {(evenement.places || evenement.complet) && (
                  <li className="flex items-center gap-space-1">
                    <LineIcon name="groupe" size={20} className="text-bronze" />
                    {evenement.complet ? t("eventComplet") : t("eventPlaces", { places: evenement.places ?? 0 })}
                  </li>
                )}
              </ul>
              {evenement.accroche && <p className="mt-space-2">{evenement.accroche}</p>}
              <ButtonLink href={{ pathname: nav.particuliers[0].href, hash: "rendez-vous" }} className="mt-space-3">
                {t("eventCta")}
              </ButtonLink>
            </div>
          </div>
        </Section>
      )}

      <Section id="pourquoi" fond="chaude" titre={t("reassuranceTitre")}>
        <Arguments items={reassurance} />
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
