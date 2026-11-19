import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Paragraphs } from "@/components/legal/Paragraphs";
import { RichText } from "@/components/ui/RichText";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/sanity/lib/i18n";
import { getPage } from "@/sanity/queries";

const sections = ["responsable", "donnees", "finalites", "destinataires", "conservation", "droits", "cookies"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/politique-de-confidentialite">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "privacy" });
  const page = await getPage("confidentialite");
  return {
    title: localize(page?.seo?.title, locale) ?? localize(page?.titre, locale) ?? t("title"),
    description: localize(page?.seo?.description, locale) ?? t("metaDescription"),
    alternates: await localizedAlternates("/politique-de-confidentialite", locale),
    robots: await robotsFor(locale),
  };
}

/**
 * Politique de confidentialité. Le texte peut être remplacé dans le Studio (Autres
 * pages > Politique de confidentialité > Texte de la page) ; sinon le texte par
 * défaut ci-dessous (messages/*.json, rubrique "privacy") s'affiche.
 */
export default async function PrivacyPage({ params }: PageProps<"/[locale]/politique-de-confidentialite">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const page = await getPage("confidentialite");
  const titre = localize(page?.titre, locale) ?? t("title");
  const contenu = localize(page?.contenu, locale);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <article className="mx-auto max-w-3xl px-space-2 py-space-4 sm:px-space-4 lg:py-space-5">
        <h1 className="text-titre-post">{titre}</h1>
        <p className="mt-space-1 text-legende text-gris-chaud">{t("updated")}</p>
        {contenu?.length ? (
          <RichText value={contenu} locale={locale} className="mt-space-4" />
        ) : (
          <>
            <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{localize(page?.intro, locale) ?? t("intro")}</p>
            {sections.map((key) => (
              <section key={key} aria-labelledby={`pc-${key}`} className="mt-space-4">
                <h2 id={`pc-${key}`} className="text-titre-section">{t(`sections.${key}.title`)}</h2>
                <Paragraphs text={t(`sections.${key}.text`)} />
              </section>
            ))}
          </>
        )}
      </article>
    </>
  );
}
