import type { Metadata } from "next";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CatalogueDialog } from "@/components/selection/CatalogueDialog";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { notreDemarchePubliee } from "@/lib/notre-demarche";
import { getPageContent, getVignerons } from "@/sanity/content";

/**
 * Nombre de domaines à partir duquel la page affiche les cartes des vignerons.
 * En dessous, version minimale : l'introduction, une photo et le bouton « Recevoir notre sélection ».
 * (Les anciens filtres et la grille des cuvées sont dans l'historique Git : composants VigneronsFiltres et getCuvees, gardés.)
 */
const SEUIL_CARTES = 4;

export async function generateMetadata({ params }: PageProps<"/[locale]/vignerons">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "vigneronsPage" });
  const page = await getPageContent("vignerons", locale);
  return pageMetadata({ locale, href: "/vignerons", seo: page.seo, title: t("metaTitle"), description: t("metaDescription"), image: page.image });
}

/** Notre sélection du moment : version minimale tant que la sélection compte moins de 4 domaines. */
export default async function VigneronsPage({ params }: PageProps<"/[locale]/vignerons">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("vigneronsPage");
  const [page, vignerons, demarche, tDemarche] = await Promise.all([
    getPageContent("vignerons", locale),
    getVignerons(locale),
    notreDemarchePubliee(),
    getTranslations("notreDemarchePage"),
  ]);
  const titre = page.titre ?? t("h1");
  const cartes = vignerons.length >= SEUIL_CARTES;

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: titre }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
          <div className="order-2 lg:order-1">
            <p className="text-sur-titre text-bronze">{page.surTitre ?? t("surTitre")}</p>
            <h1 className="mt-space-1 text-titre-post">{titre}</h1>
            <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">{page.intro ?? t("intro")}</p>
            <p className="mt-space-2 max-w-xl text-[1.125rem]">{t("bientot")}</p>
            <CatalogueDialog className="mt-space-3" />
            {/* Lien discret vers « Comment je travaille » : seulement une fois « Notre démarche » publiée. */}
            {demarche && (
              <p className="mt-space-2">
                <Link
                  href={{ pathname: "/notre-demarche", hash: tDemarche("ancreCommentJeTravaille") }}
                  className="inline-flex min-h-11 items-center gap-1 text-sur-titre-petit underline decoration-or underline-offset-4 hover:text-bronze"
                >
                  {t("demarcheLien")} <span aria-hidden="true">→</span>
                </Link>
              </p>
            )}
          </div>
          <Photo image={page.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile placeholder="sobre" className="order-1 lg:order-2" />
        </div>
      </section>

      {/* Prêt pour la suite : les cartes des domaines s'affichent dès 4 vignerons. */}
      {cartes && (
        <Section titre={t("domainesTitre")} align="gauche">
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {vignerons.map((v) => (
              <li key={v.slug}>
                <DomaineCard domaine={v} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <DansLeMag locale={locale} chemins={["/vignerons"]} rubrique="portraits" />
    </>
  );
}
