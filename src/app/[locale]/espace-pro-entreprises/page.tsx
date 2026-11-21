import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { PHOTOS_ESPACE_PRO } from "@/lib/espace-pro-photos";
import { imgDepuisAsset } from "@/sanity/content";

const HREF = "/espace-pro-entreprises";
const CARTES = [
  ["pro", "/champagne-hotel-restaurants-et-cavistes"],
  ["entreprises", "/cse-et-cadeaux-dentreprise"],
  ["vignerons", "/vignerons-de-laube-devenez-partenaire-de-nos-degustations"],
  ["communication", "/communication-marketing"],
] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/espace-pro-entreprises">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "espaceProPage" });
  const p = PHOTOS_ESPACE_PRO.pro;
  return pageMetadata({ locale, href: HREF, title: t("metaTitle"), description: t("metaDescription"), image: imgDepuisAsset(p.asset, p.fichier, { fr: t("cartes.pro.alt"), en: t("cartes.pro.alt") }, locale) });
}

/** Espace Pro & Entreprises : la page d'accueil de l'espace, en un seul bloc (intro, 4 profils, partenariat). */
export default async function EspaceProPage({ params }: PageProps<"/[locale]/espace-pro-entreprises">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("espaceProPage");
  const fr = await getTranslations({ locale: "fr", namespace: "espaceProPage" });
  const en = await getTranslations({ locale: "en", namespace: "espaceProPage" });

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: t("titre") }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto max-w-7xl px-space-2 py-space-4 sm:px-space-4 lg:py-space-5">
          <div className="grid gap-space-3 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-space-5">
            <div>
              <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
              <h1 className="mt-space-2 text-titre-post">{t("titre")}</h1>
            </div>
            <p className="text-[1.125rem] text-gris-chaud">{t("intro")}</p>
          </div>

          <ul className="mt-space-4 grid gap-space-3 sm:grid-cols-2 lg:grid-cols-4">
            {CARTES.map(([cle, href]) => {
              const ph = PHOTOS_ESPACE_PRO[cle];
              const img = imgDepuisAsset(ph.asset, ph.fichier, { fr: fr(`cartes.${cle}.alt`), en: en(`cartes.${cle}.alt`) }, locale, 800, undefined, "credit" in ph ? ph.credit : undefined);
              return (
                <li key={cle} className="group relative flex flex-col overflow-hidden rounded-carte border border-filet bg-blanc">
                  <Photo image={img} ratio="4/3" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <div className="flex flex-1 flex-col p-space-2">
                    <h2 className="text-[1.25rem] font-bold leading-tight group-hover:text-bronze">{t(`cartes.${cle}.titre`)}</h2>
                    <p className="mt-space-1 text-gris-chaud">{t(`cartes.${cle}.texte`)}</p>
                    <Link href={href} className="mt-auto inline-flex items-center gap-space-1 pt-space-2 text-sur-titre-petit after:absolute after:inset-0">
                      {t(`cartes.${cle}.lien`)} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-space-4 flex flex-col gap-space-3 rounded-carte border border-or bg-blanc p-space-3 sm:p-space-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-space-2">
              <LineIcon name="interlocuteur" size={32} className="shrink-0 text-or" />
              <div>
                <h2 className="text-[1.375rem] font-bold leading-tight">{t("partenariatTitre")}</h2>
                <p className="mt-space-1 max-w-2xl text-gris-chaud">{t("partenariatTexte")}</p>
              </div>
            </div>
            <ButtonLink href={{ pathname: "/contact", hash: "pro" }} className="shrink-0">
              {t("contactCta")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
