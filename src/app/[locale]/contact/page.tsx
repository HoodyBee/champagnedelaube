import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactProfils } from "@/components/contact/ContactProfils";
import { SocialLinks } from "@/components/icons/SocialLinks";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LineIcon } from "@/components/ui/LineIcon";
import { pageMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { notreDemarchePubliee } from "@/lib/notre-demarche";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getPageContent } from "@/sanity/content";
import { Photo } from "@/components/ui/Photo";
import { localize } from "@/sanity/lib/i18n";
import { getPage, getReglages, socialLinks } from "@/sanity/queries";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const [page, contenu] = await Promise.all([getPage("contact"), getPageContent("contact", locale)]);
  return pageMetadata({
    locale,
    href: "/contact",
    title: localize(page?.seo?.title, locale) ?? t("metaTitle"),
    description: localize(page?.seo?.description, locale) ?? t("metaDescription"),
    image: contenu.image,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tSocial = await getTranslations("social");
  const tFooter = await getTranslations("footer");
  const [page, reglages, contenu, notreDemarche] = await Promise.all([getPage("contact"), getReglages(), getPageContent("contact", locale), notreDemarchePubliee()]);
  const titre = localize(page?.titre, locale) ?? t("title");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <div className="mx-auto grid max-w-7xl gap-space-5 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-[1fr_1.4fr] lg:py-space-5">
        <div>
          {page?.surTitre && <p className="text-sur-titre text-bronze">{localize(page.surTitre, locale)}</p>}
          <h1 className="text-titre-post">{titre}</h1>
          <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{localize(page?.intro, locale) ?? t("intro")}</p>

          {contenu.image && (
            <div className="mt-space-4 max-w-xs overflow-hidden rounded-carte">
              <Photo image={contenu.image} ratio="4/5" sizes="320px" />
            </div>
          )}
          {notreDemarche && (
            <p className="mt-space-2">
              <Link href="/notre-demarche" className="inline-flex min-h-11 items-center gap-1 text-sur-titre-petit underline decoration-or underline-offset-4 hover:text-bronze">
                {t("notreDemarcheLien")} <span aria-hidden="true">→</span>
              </Link>
            </p>
          )}
          <h2 className="mt-space-4 text-sur-titre text-bronze">{t("details")}</h2>
          <ul className="mt-space-2 space-y-space-1">
            <li className="flex items-center gap-space-1">
              <LineIcon name="conseil" size={24} className="text-bronze" />
              <a href={`mailto:${reglages.email}`} className="underline-offset-4 hover:text-bronze hover:underline">
                {reglages.email}
              </a>
            </li>
            <li className="flex items-center gap-space-1">
              <LineIcon name="lieu" size={24} className="text-bronze" />
              {tFooter("location")}
            </li>
          </ul>
          <h2 className="mt-space-4 text-sur-titre text-bronze">{t("raccourcisTitre")}</h2>
          <ul className="mt-space-2 grid gap-space-1">
            <li>
              <Link href={nav.particuliers[0].href} className="flex min-h-12 items-center gap-space-2 rounded-carte border border-filet bg-blanc px-space-2 hover:border-bronze">
                <LineIcon name="degustation" size={24} className="text-or" />
                <span className="flex-1 font-bold">{t("raccourcis.degustation")}</span>
                <span aria-hidden="true" className="text-bronze">→</span>
              </Link>
            </li>
            <li>
              <Link href={nav.particuliers[1].href} className="flex min-h-12 items-center gap-space-2 rounded-carte border border-filet bg-blanc px-space-2 hover:border-bronze">
                <LineIcon name="calendrier" size={24} className="text-or" />
                <span className="flex-1 font-bold">{t("raccourcis.evenement")}</span>
                <span aria-hidden="true" className="text-bronze">→</span>
              </Link>
            </li>
          </ul>
          <p className="mt-space-3">
            <Link href={nav.pro[1].href} className="text-bronze underline underline-offset-4">{t("vigneron")}</Link>
          </p>
          <SocialLinks
            links={socialLinks(reglages)}
            labels={{ label: tSocial("label"), instagram: tSocial("instagram"), facebook: tSocial("facebook"), linkedin: tSocial("linkedin") }}
            className="-ml-3 mt-space-2"
            linkClassName="text-anthracite hover:text-bronze"
          />
        </div>

        <section aria-label={t("formTitle")} className="surface-chaude rounded-carte p-space-3 sm:p-space-4">
          <ContactProfils />
        </section>
      </div>
    </>
  );
}
