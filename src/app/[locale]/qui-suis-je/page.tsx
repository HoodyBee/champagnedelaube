import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { quiSuisJePubliee } from "@/lib/qui-suis-je";
import { nav } from "@/lib/site";
import { getPageContent } from "@/sanity/content";

const HREF = "/qui-suis-je" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/qui-suis-je">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  if (!(await quiSuisJePubliee())) notFound();
  const [p, t] = await Promise.all([getPageContent("qui-suis-je", locale), getTranslations({ locale, namespace: "quiSuisJePage" })]);
  return pageMetadata({ locale, href: HREF, seo: p.seo, title: t("metaTitle"), description: t("metaDescription"), image: p.image });
}

/**
 * Qui suis-je ? : le parcours de Julien. Texte, photo et référencement dans le Studio
 * (Contact et pages légales > Page Qui suis-je). Un seul bloc compact : la photo à côté du texte.
 */
export default async function QuiSuisJePage({ params }: PageProps<"/[locale]/qui-suis-je">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  if (!(await quiSuisJePubliee())) notFound();
  const [p, t] = await Promise.all([getPageContent("qui-suis-je", locale), getTranslations("quiSuisJePage")]);
  // Langue sans traduction : le texte français s'affiche (repli habituel du site).
  const titre = p.titre ?? t("titre");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <div className="mx-auto grid max-w-6xl gap-space-4 px-space-2 pb-space-5 pt-space-4 sm:px-space-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-space-5 lg:pt-space-5">
        {/* Photo : en haut sur mobile (format réduit), à gauche et qui suit la lecture sur ordinateur. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {p.image && (
            <div className="mx-auto max-w-[16rem] overflow-hidden rounded-carte lg:max-w-none">
              <Photo image={p.image} ratio="4/5" sizes="(min-width: 1024px) 33vw, 16rem" priority />
            </div>
          )}
        </div>
        <article>
          {p.surTitre && <p className="text-sur-titre text-bronze">{p.surTitre}</p>}
          <h1 className="mt-space-1 text-titre-post">{titre}</h1>
          {p.intro && <p className="mt-space-3 text-accroche text-gris-chaud">{p.intro}</p>}
          {p.contenu?.length ? <RichText value={p.contenu} locale={locale} className="mt-space-3 max-w-3xl" /> : null}
          <nav aria-label={t("liensTitre")} className="mt-space-4 flex flex-wrap gap-space-2 border-t border-filet pt-space-3">
            <ButtonLink href={nav.particuliers[0].href}>{t("lienDegustations")}</ButtonLink>
            <ButtonLink href="/espace-pro-entreprises" variant="secondaire">
              {t("lienPro")}
            </ButtonLink>
            <ButtonLink href={nav.contact.href} variant="secondaire">
              {t("lienContact")}
            </ButtonLink>
          </nav>
        </article>
      </div>
    </>
  );
}
