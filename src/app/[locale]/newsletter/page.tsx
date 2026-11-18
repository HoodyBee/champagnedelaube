import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LineIcon } from "@/components/ui/LineIcon";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/newsletter">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "newsletter" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localizedAlternates("/newsletter", locale),
    robots: robotsFor(locale),
  };
}

export default async function NewsletterPage({ params }: PageProps<"/[locale]/newsletter">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("newsletter");
  const points = [
    { icone: "vigneron", texte: t("points.vignerons") },
    { icone: "degustation", texte: t("points.degustations") },
    { icone: "calendrier", texte: t("points.evenements") },
  ] as const;

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("title") }]} />
      <div className="mx-auto grid max-w-7xl gap-space-5 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:py-space-5">
        <div>
          <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
          <h1 className="mt-space-1 text-titre-post">{t("title")}</h1>
          <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{t("intro")}</p>
          <ul className="mt-space-4 space-y-space-2">
            {points.map((p) => (
              <li key={p.icone} className="flex items-start gap-space-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-rond border border-filet bg-creme-clair text-bronze">
                  <LineIcon name={p.icone} size={22} />
                </span>
                <span className="pt-2">{p.texte}</span>
              </li>
            ))}
          </ul>
        </div>
        <section aria-label={t("form.submit")} className="surface-chaude self-start rounded-carte p-space-3 sm:p-space-4">
          <NewsletterForm />
        </section>
      </div>
    </>
  );
}
