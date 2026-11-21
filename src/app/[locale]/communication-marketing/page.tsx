import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticlesEtiquette } from "@/components/mag/ArticlesEtiquette";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { pageMetadata } from "@/i18n/metadata";
import { getPageContent } from "@/sanity/content";
import type { Locale } from "@/i18n/routing";

const HREF = "/communication-marketing";
const SERVICES = ["conseils", "audit", "photo", "reseaux", "communication"] as const;
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
  // Photo de la page (document « Page » du Studio, clé « communication »).
  const page = await getPageContent("communication", locale);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("proEntreprises"), href: "/espace-pro-entreprises" }, { label: t("titre") }]} />
      {/* Un seul bloc à côté de la photo : présentation, services, publics, boutons. */}
      <section className="border-b border-filet bg-creme-clair">
        <div className={`mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:gap-space-5 lg:py-space-5 ${page.image ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
          <div>
            <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
            <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
            <p className="mt-space-3 max-w-xl text-[1.125rem] text-gris-chaud">{t("intro")}</p>
            <div className="mt-space-3 grid max-w-xl grid-cols-2 gap-space-2">
              {(
                [
                  ["servicesTitre", SERVICES, "services"],
                  ["publicTitre", PUBLICS, "publics"],
                ] as const
              ).map(([titre, liste, ns]) => (
                <div key={titre} className="rounded-carte border border-filet bg-blanc p-space-2">
                  <h2 className="text-sur-titre-petit text-bronze">{t(titre)}</h2>
                  <ul className="mt-space-1 space-y-1 text-[1.0625rem]">
                    {liste.map((s) => (
                      <li key={s} className="flex items-center gap-space-1">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-rond bg-or" />
                        {t(`${ns}.${s}` as "services.photo")}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-space-3 flex flex-col gap-space-1 sm:flex-row sm:flex-wrap">
              <ButtonLink href={{ pathname: "/contact", hash: "pro" }}>{t("contact")}</ButtonLink>
              <a href="https://www.detectezmoi.com" target="_blank" rel="noopener" className={buttonClass("secondaire")}>
                {t("bouton")} <span aria-hidden="true">↗</span>
                <span className="sr-only"> {t("nouvelOnglet")}</span>
              </a>
            </div>
          </div>
          {page.image && <Photo image={page.image} ratio="4/5" sizes="(min-width: 1024px) 40vw, 100vw" priority compactMobile className="lg:mx-auto lg:w-4/5" />}
        </div>
      </section>
      {/* Nos articles marketing (étiquette « Marketing » du Mag), avant les boutons de contact. Masqué s'il n'y en a aucun. */}
      {/* Juste en dessous : les articles étiquetés « Marketing » (masqué s'il n'y en a aucun). */}
      <ArticlesEtiquette cle="marketing" locale={locale} titre={t("articlesTitre")} max={3} lienMag />
    </>
  );
}
