import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { SocialLinks } from "@/components/icons/SocialLinks";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LineIcon } from "@/components/ui/LineIcon";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/sanity/lib/i18n";
import { getPage, getReglages, socialLinks } from "@/sanity/queries";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const page = await getPage("contact");
  return {
    title: localize(page?.seo?.title, locale) ?? localize(page?.titre, locale) ?? t("title"),
    description: localize(page?.seo?.description, locale) ?? t("metaDescription"),
    alternates: localizedAlternates("/contact", locale),
    robots: robotsFor(locale),
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tSocial = await getTranslations("social");
  const tFooter = await getTranslations("footer");
  const [page, reglages] = await Promise.all([getPage("contact"), getReglages()]);
  const titre = localize(page?.titre, locale) ?? t("title");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <div className="mx-auto grid max-w-7xl gap-space-5 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-[1fr_1.4fr] lg:py-space-5">
        <div>
          {page?.surTitre && <p className="text-sur-titre text-bronze">{localize(page.surTitre, locale)}</p>}
          <h1 className="text-titre-post">{titre}</h1>
          <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{localize(page?.intro, locale) ?? t("intro")}</p>

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
          <SocialLinks
            links={socialLinks(reglages)}
            labels={{ label: tSocial("label"), instagram: tSocial("instagram"), facebook: tSocial("facebook"), linkedin: tSocial("linkedin") }}
            className="-ml-3 mt-space-2"
            linkClassName="text-anthracite hover:text-bronze"
          />
        </div>

        <section aria-labelledby="contact-form-title" className="surface-chaude rounded-carte p-space-3 sm:p-space-4">
          <h2 id="contact-form-title" className="mb-space-3 text-titre-section">{t("formTitle")}</h2>
          <LeadForm formId="contact" />
        </section>
      </div>
    </>
  );
}
