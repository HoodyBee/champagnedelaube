import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { CepagePastille } from "@/components/brand/CepagePastille";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { pictos, terroirs } from "@/lib/brand";
import { nav } from "@/lib/site";
import { MagCard } from "@/components/mag/MagCard";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticles, getVigneron, getVigneronSlugs, getVignerons } from "@/sanity/content";

type Props = PageProps<"/[locale]/vignerons/[slug]">;

/** Fiches générées à l'avance pour chaque langue (au moins une, exigence de Next.js). */
export async function generateStaticParams() {
  const slugs = await getVigneronSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const v = await getVigneron(slug, locale);
  if (!v) notFound();
  const t = await getTranslations({ locale, namespace: "vigneronPage" });
  return pageMetadata({
    locale,
    href: { pathname: "/vignerons/[slug]", params: { slug } },
    seo: v.seo,
    title: v.village ? t("metaTitle", { nom: v.nom, village: v.village }) : `${v.nom} | Champagne de l'Aube`,
    description: v.philosophie ?? v.accroche ?? v.nom,
    image: v.image,
  });
}

/** Fiche vigneron : l'humain avant le produit. Jamais de prix. */
export default async function VigneronPage({ params }: Props) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const [v, tous, articles, labels] = await Promise.all([getVigneron(slug, locale), getVignerons(locale), getArticles(locale), getRubriqueLabels(locale)]);
  if (!v) notFound();

  const t = await getTranslations("vigneronPage");
  const tNav = await getTranslations("nav");
  const tLegal = await getTranslations("legal");
  const tPro = await getTranslations("proPage");
  const terroir = v.terroir ? terroirs[v.terroir] : undefined;
  const autres = tous.filter((o) => o.slug !== v.slug).slice(0, 4);
  const tMag = await getTranslations("mag");
  const mag = withDates(articles.filter((a) => a.vignerons.includes(v.slug)), locale).slice(0, 3);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("vignerons"), href: nav.vignerons.href }, { label: v.nom }]} />

      <section className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-1.5 text-sur-titre text-bronze">
            {terroir && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-rond" style={{ backgroundColor: `var(--color-${terroir.color})` }} />}
            {[v.village, terroir?.label].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-space-2 text-titre-post">{v.nom}</h1>
          {v.collaborationCommerciale && (
            <p className="mt-space-2 inline-block rounded-etiquette border border-filet px-space-1 py-0.5 text-sur-titre-petit text-gris-chaud">
              {tLegal("sponsored")}
            </p>
          )}
          {v.accroche && <p className="mt-space-3 text-accroche">{v.accroche}</p>}
          {v.philosophie && <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">{v.philosophie}</p>}
          {v.intro && <p className="mt-space-2 max-w-xl text-gris-chaud">{v.intro}</p>}
          {(v.siteWeb || v.instagram) && (
            <ul className="mt-space-3 flex flex-wrap gap-x-space-3 gap-y-space-1 text-sur-titre-petit">
              {v.siteWeb && (
                <li>
                  <a href={v.siteWeb} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1 underline hover:text-bronze">
                    {t("site")} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              )}
              {v.instagram && (
                <li>
                  <a href={v.instagram} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1 underline hover:text-bronze">
                    Instagram <span aria-hidden="true">↗</span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <Photo image={v.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile className="order-1 lg:order-2" />
      </section>

      {v.personnes.length > 0 && (
        <Section fond="chaude" titre={t("personnes")}>
          <ul className="grid gap-space-3 sm:grid-cols-2 lg:grid-cols-3">
            {v.personnes.map((p) => (
              <li key={p.nom} className="flex items-center gap-space-2 rounded-carte border border-filet bg-blanc p-space-2">
                {p.photo ? (
                  <div className="w-20 shrink-0 overflow-hidden rounded-rond">
                    <Photo image={p.photo} ratio="1/1" sizes="80px" placeholderLabel="" />
                  </div>
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-rond bg-creme-clair text-bronze">
                    <LineIcon name="vigneron" size={28} />
                  </span>
                )}
                <div>
                  <p className="text-[1.125rem] font-bold leading-tight">{p.nom}</p>
                  {p.role && <p className="mt-0.5 text-gris-chaud">{p.role}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {v.histoire?.length ? (
        <Section titre={t("histoire")} align="gauche">
          <RichText value={v.histoire} locale={locale} className="max-w-3xl" />
        </Section>
      ) : null}

      {(v.cepages.length > 0 || (v.thematiques?.length ?? 0) > 0 || v.pratiques.length > 0 || (v.labels?.length ?? 0) > 0) && (
        <Section>
          <div className="grid gap-space-4 md:grid-cols-2">
            {v.cepages.length > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{t("cepages")}</h2>
                <ul className="mt-space-2 grid grid-cols-2 gap-x-space-2 gap-y-space-1 sm:grid-cols-3">
                  {v.cepages.map((k) => (
                    <li key={k}>
                      <CepagePastille cepage={k} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(v.thematiques?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{t("thematiques")}</h2>
                <ul className="mt-space-2 flex flex-wrap gap-space-1">
                  {v.thematiques!.map((k) => (
                    <li key={k} title={pictos[k].label}>
                      <BrandBadge asset={pictos[k]} size={72} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {v.pratiques.length > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{t("pratiques")}</h2>
                <ul className="mt-space-2 space-y-space-1">
                  {v.pratiques.map((p) => (
                    <li key={p} className="flex items-start gap-space-1">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-rond bg-or" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(v.labels?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{t("labels")}</h2>
                <ul className="mt-space-2 flex flex-wrap gap-space-1">
                  {v.labels!.map((l) => (
                    <li key={l} className="rounded-etiquette border border-filet px-space-1 py-1 text-sur-titre-petit text-gris-chaud">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {v.galerie.length > 0 && (
        <Section titre={t("galerie")}>
          <ul className="grid gap-space-2 sm:grid-cols-2 lg:grid-cols-3">
            {v.galerie.map((g, i) => (
              <li key={i}>
                <Photo image={g} ratio="3/2" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" placeholderLabel="" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {mag.length > 0 && (
        <Section id="le-mag" titre={tMag("vigneronMag")} ornement="document">
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {mag.map((a) => (
              <li key={a.slug}>
                <MagCard article={a} labels={labels} lire={tMag("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section fond="chaude">
        <div className="grid gap-space-3 md:grid-cols-2">
          {v.espacePro && (
            <div className="rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
              <h2 className="text-titre-section">{t("ctaProTitre")}</h2>
              <p className="mt-space-1 text-gris-chaud">{t("ctaProTexte")}</p>
              <ButtonLink href={{ pathname: nav.pro[0].href, hash: "grille" }} className="mt-space-3">
                {tPro("ctaGrille")}
              </ButtonLink>
            </div>
          )}
          <div className="rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
            <h2 className="text-titre-section">{t("ctaPartTitre")}</h2>
            <p className="mt-space-1 text-gris-chaud">{t("ctaPartTexte")}</p>
            <ButtonLink href={nav.particuliers[0].href} variant="secondaire" className="mt-space-3">
              {t("ctaPartBouton")}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {autres.length > 0 && (
        <Section titre={t("autres")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
            {autres.map((o) => (
              <li key={o.slug}>
                <DomaineCard domaine={o} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
