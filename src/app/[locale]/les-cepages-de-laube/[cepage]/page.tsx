import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CepagePastille } from "@/components/brand/CepagePastille";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { cepages, terroirs, type CepageKey } from "@/lib/brand";
import { CEPAGES_MASQUES, ORDRE_CEPAGES } from "@/lib/cepages-contenu";
import { CatalogueDialog } from "@/components/selection/CatalogueDialog";
import { imageObject } from "@/lib/image-jsonld";
import { nav, terroirPages } from "@/lib/site";
import { getCepage, getVignerons } from "@/sanity/content";

type Props = PageProps<"/[locale]/les-cepages-de-laube/[cepage]">;
/** false tant que les fiches des vignerons partenaires ne sont pas complètes (photo + cépages). */
const AFFICHER_PARTENAIRES = false;
const estCepage = (c: string): c is CepageKey => c in cepages && !CEPAGES_MASQUES.includes(c as CepageKey);

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => ORDRE_CEPAGES.map((cepage) => ({ locale, cepage })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cepage } = (await params) as { locale: Locale; cepage: string };
  if (!estCepage(cepage)) return {};
  const c = await getCepage(cepage, locale);
  return pageMetadata({
    locale,
    href: { pathname: "/les-cepages-de-laube/[cepage]", params: { cepage } },
    seo: c.seo,
    title: c.seo.title ?? c.nom,
    description: c.seo.description ?? c.resume,
    image: c.image,
  });
}

/** Page d'un cépage : place dans l'AOC et dans l'Aube, apport, culture, histoire ; terroirs et vignerons partenaires. */
export default async function CepageDetailPage({ params }: Props) {
  const { locale, cepage } = (await params) as { locale: Locale; cepage: string };
  setRequestLocale(locale);
  if (!estCepage(cepage)) notFound();
  const [c, vignerons] = await Promise.all([getCepage(cepage, locale), getVignerons(locale)]);
  const t = await getTranslations("cepagesPage");
  const tNav = await getTranslations("nav");
  // Uniquement nos vignerons PARTENAIRES qui cultivent ce cépage.
  const partenaires = vignerons.filter((v) => v.partenaire && v.cepages.includes(cepage));
  const terroirsLies = c.terroirs.map((k) => terroirPages.find((p) => p.key === k)!).filter(Boolean);
  const autres = ORDRE_CEPAGES.filter((k) => k !== cepage);

  return (
    <>
      <Breadcrumb
        locale={locale}
        items={[{ label: tNav("terroirHub"), href: nav.terroirHub.href }, { label: t("titre"), href: "/les-cepages-de-laube" }, { label: c.nom }]}
      />
      <div className="mx-auto max-w-7xl px-space-2 pt-space-2 sm:px-space-4">
        <Link href="/les-cepages-de-laube" className="inline-flex min-h-11 items-center gap-space-1 text-sur-titre-petit text-anthracite hover:text-bronze">
          <span aria-hidden="true">←</span> {t("tous")}
        </Link>
      </div>

      <section className="border-b border-filet bg-creme-clair">
        <div className={`mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:gap-space-5 lg:py-space-5 ${c.image ? "lg:grid-cols-2" : ""}`}>
          <div className="order-2 lg:order-1">
            <p className="text-sur-titre text-bronze">{c.statut === "vifa" ? t("statutVifa") : t("statutPrincipal")}</p>
            <h1 className="mt-space-2 flex items-center gap-space-2 text-titre-post">
              <CepagePastille cepage={cepage} size={56} lien={false} nomVisible={false} />
              {c.nom}
            </h1>
            <p className="mt-space-1 text-sur-titre-petit text-gris-chaud">
              {c.couleur}
              {c.aussiAppele && <> · {c.aussiAppele}</>}
            </p>
            {c.accroche && <p className="mt-space-3 text-accroche">{c.accroche}</p>}
            <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">{c.resume}</p>
          </div>
          {/* Pas de photo de ce cépage : pas d'emplacement vide, le texte prend toute la largeur. */}
          {c.image && <Photo image={c.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile className="order-1 lg:order-2" />}
        </div>
      </section>

      <Section>
        <div className="grid gap-space-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="max-w-3xl">
            {c.contenu ? (
              <RichText value={c.contenu} locale={locale} />
            ) : (
              c.sections.map((s) => (
                <section key={s.id} id={s.id} className="mt-space-4 first:mt-0">
                  <h2 className="text-titre-section">{s.titre}</h2>
                  <RichText value={s.texte} locale={locale} className="mt-space-1" />
                </section>
              ))
            )}
            <p className="mt-space-4 text-legende text-gris-chaud">{t("sourcesNote")}</p>
          </div>
          <aside className="space-y-space-4 lg:pt-space-2">
            {terroirsLies.length > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{t("terroirsTitre")}</h2>
                <ul className="mt-space-2 space-y-space-1">
                  {terroirsLies.map((p) => (
                    <li key={p.key}>
                      <Link href={p.href} className="inline-flex min-h-11 items-center gap-space-1 font-bold underline decoration-or underline-offset-4 hover:text-bronze">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-rond" style={{ backgroundColor: `var(--color-${terroirs[p.key].color})` }} />
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="surface-chaude rounded-carte p-space-3">
              <h2 className="text-sur-titre text-bronze">{t("selectionTitre")}</h2>
              <p className="mt-space-1 text-gris-chaud">{t("selectionTexte")}</p>
              <div className="mt-space-2 flex flex-col gap-space-1">
                <ButtonLink href={nav.vignerons.href}>{t("selectionBouton")}</ButtonLink>
                <ButtonLink href={nav.particuliers[0].href} variant="secondaire">{t("tastingBouton")}</ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {c.galerie.length > 0 && (
        <Section fond="chaude">
          <ul className="grid gap-space-2 sm:grid-cols-2 lg:grid-cols-3">
            {c.galerie.map((g, i) => (
              <li key={i}>
                <Photo image={g} ratio="3/2" sizes="(min-width: 1024px) 33vw, 50vw" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Vignerons partenaires : réactivé quand leurs fiches seront complètes (photo + cépages). */}
      {AFFICHER_PARTENAIRES && partenaires.length > 0 ? (
        <Section titre={t("partenairesTitre")} intro={t("partenairesIntro")}>
          <ul className="mx-auto grid max-w-4xl gap-space-3 sm:grid-cols-2">
            {partenaires.map((v) => (
              <li key={v.slug}>
                <DomaineCard domaine={v} />
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section>
          <div className="mx-auto max-w-2xl rounded-carte border border-filet bg-creme-clair px-space-3 py-space-4 text-center">
            <h2 className="text-accroche">{t("gouterTitre")}</h2>
            <p className="mt-space-1 text-gris-chaud">{t("gouterTexte")}</p>
            <CatalogueDialog className="mt-space-3 justify-center" />
          </div>
        </Section>
      )}

      <Section fond="chaude" titre={t("tousLien")}>
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-space-2 gap-y-space-2 sm:grid-cols-4">
          {autres.map((k) => (
            <li key={k}>
              <CepagePastille cepage={k} size={40} />
            </li>
          ))}
        </ul>
        <div className="mt-space-4 text-center">
          <Link href="/les-cepages-de-laube" className="inline-flex min-h-11 items-center gap-space-1 text-sur-titre-petit hover:text-bronze">
            <span aria-hidden="true">←</span> {t("tous")}
          </Link>
        </div>
      </Section>

      {(c.image || c.galerie.length > 0) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [c.image, ...c.galerie].filter((g): g is NonNullable<typeof g> => !!g).map(imageObject) }),
          }}
        />
      )}
    </>
  );
}
