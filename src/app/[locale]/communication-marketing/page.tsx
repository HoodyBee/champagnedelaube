import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

const HREF = "/communication-marketing";
const SERVICES = ["photo", "video", "reseaux", "communication"] as const;
const PUBLICS = ["vignerons", "caves", "bars", "restaurants"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/communication-marketing">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "communicationPage" });
  return pageMetadata({ locale, href: HREF, title: t("metaTitle"), description: t("metaDescription") });
}

/**
 * Espace Pro : les services de communication de Detectezmoi.com (photo, vidéo, réseaux sociaux,
 * communication) pour vignerons, caves, bars et restaurants. Liste fournie par Julien : rien d'autre.
 */
export default async function CommunicationPage({ params }: PageProps<"/[locale]/communication-marketing">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("communicationPage");
  const tNav = await getTranslations("nav");

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("proEntreprises") }, { label: t("titre") }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto max-w-3xl px-space-2 py-space-5 text-center sm:px-space-4">
          <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
          <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
          <p className="mt-space-3 text-[1.125rem] text-gris-chaud">{t("intro")}</p>
        </div>
      </section>
      <Section>
        <div className="mx-auto grid max-w-4xl gap-space-4 md:grid-cols-2">
          <div className="rounded-carte border border-filet bg-blanc p-space-3">
            <h2 className="text-sur-titre text-bronze">{t("servicesTitre")}</h2>
            <ul className="mt-space-2 space-y-space-1 text-[1.125rem]">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-center gap-space-1">
                  <span aria-hidden="true" className="h-2 w-2 rounded-rond bg-or" />
                  {t(`services.${s}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-carte border border-filet bg-blanc p-space-3">
            <h2 className="text-sur-titre text-bronze">{t("publicTitre")}</h2>
            <ul className="mt-space-2 space-y-space-1 text-[1.125rem]">
              {PUBLICS.map((s) => (
                <li key={s} className="flex items-center gap-space-1">
                  <span aria-hidden="true" className="h-2 w-2 rounded-rond bg-or" />
                  {t(`publics.${s}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-space-4 flex flex-col items-center justify-center gap-space-1 sm:flex-row">
          <a href="https://www.detectezmoi.com" target="_blank" rel="noopener" className={buttonClass("primaire")}>
            {t("bouton")} <span aria-hidden="true">↗</span>
            <span className="sr-only"> {t("nouvelOnglet")}</span>
          </a>
          <ButtonLink href="/contact" variant="secondaire">
            {t("contact")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
