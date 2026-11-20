import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Paragraphs } from "@/components/legal/Paragraphs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/navigation";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { adresseSiege } from "@/lib/legal";
import { localize } from "@/sanity/lib/i18n";
import { CREDIT_PAR_DEFAUT, getCreditsBanquesImages } from "@/sanity/content";
import { getPage, getReglages } from "@/sanity/queries";

const sections = ["editeur", "directeur", "conception", "hebergement", "propriete", "credits", "donnees", "cookies", "alcool"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/mentions-legales">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "legalNoticePage" });
  const page = await getPage("mentions-legales");
  return {
    title: localize(page?.seo?.title, locale) ?? localize(page?.titre, locale) ?? t("title"),
    description: localize(page?.seo?.description, locale) ?? t("metaDescription"),
    alternates: await localizedAlternates("/mentions-legales", locale),
    robots: await robotsFor(locale),
  };
}

/**
 * Mentions légales. Le texte peut être remplacé dans le Studio (Autres pages >
 * Mentions légales > Texte de la page) ; sinon le texte par défaut s'affiche, avec
 * des champs [À COMPLÉTER] pour les informations de l'entreprise.
 */
export default async function LegalNoticePage({ params }: PageProps<"/[locale]/mentions-legales">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("legalNoticePage");
  const [page, reglages, creditsBanques] = await Promise.all([getPage("mentions-legales"), getReglages(), getCreditsBanquesImages()]);
  const titre = localize(page?.titre, locale) ?? t("title");
  const contenu = localize(page?.contenu, locale);
  // Adresse du siège administratif : modifiable dans les Réglages du site ; affichée ici seulement.
  const adresse = adresseSiege(reglages.adresseSiege, locale);
  const mention = localize(reglages.adresseMention, locale) || t("mentionDefaut");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <article className="mx-auto max-w-3xl px-space-2 py-space-4 sm:px-space-4 lg:py-space-5">
        <h1 className="text-titre-post">{titre}</h1>
        <p className="mt-space-1 text-legende text-gris-chaud">{t("updated")}</p>
        {contenu?.length ? (
          <RichText value={contenu} locale={locale} className="mt-space-4" />
        ) : (
          sections.map((key) => (
            <section key={key} aria-labelledby={`ml-${key}`} className="mt-space-4">
              <h2 id={`ml-${key}`} className="text-titre-section">{t(`sections.${key}.title`)}</h2>
              <Paragraphs text={t(`sections.${key}.text`, { adresse, mention })} />
              {key === "credits" && (
                <>
                  <p className="mt-space-2 font-bold">{CREDIT_PAR_DEFAUT}</p>
                  {creditsBanques.length > 0 ? (
                    <>
                      <p className="mt-space-2">{t("creditsBanques")}</p>
                      <ul className="mt-space-1 list-disc space-y-1 pl-space-3 marker:text-or">
                        {creditsBanques.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-space-2 text-gris-chaud">{t("creditsAucuneBanque")}</p>
                  )}
                </>
              )}
              {key === "donnees" && (
                <p className="mt-space-2">
                  <Link href="/politique-de-confidentialite" className="text-bronze underline underline-offset-4">{t("privacyLink")}</Link>
                </p>
              )}
            </section>
          ))
        )}
      </article>
    </>
  );
}
