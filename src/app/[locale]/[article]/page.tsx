import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getPathname } from "@/i18n/navigation";
import { pageMetadata, SITE_URL } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticle, getArticles, getArticleSlugs, getVignerons, rubriqueHref } from "@/sanity/content";

type Props = PageProps<"/[locale]/[article]">;

/** Articles générés à l'avance pour chaque langue (au moins un paramètre : exigence de Next.js). */
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return routing.locales.flatMap((locale) => (slugs.length ? slugs : ["le-mag-bientot"]).map((article) => ({ locale, article })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, article: slug } = (await params) as { locale: Locale; article: string };
  const a = await getArticle(slug, locale);
  if (!a) return {};
  const meta = await pageMetadata({
    locale,
    href: { pathname: "/[article]", params: { article: slug } },
    seo: a.seo,
    title: `${a.titre} | Champagne de l'Aube`,
    description: a.extrait ?? a.titre,
  });
  return {
    ...meta,
    openGraph: {
      type: "article",
      title: a.titre,
      description: a.extrait,
      publishedTime: a.date,
      images: a.image ? [{ url: a.image.src, alt: a.image.alt }] : undefined,
    },
  };
}

/** Article du Mag, à son adresse historique (racine du site). */
export default async function ArticlePage({ params }: Props) {
  const { locale, article: slug } = (await params) as { locale: Locale; article: string };
  setRequestLocale(locale);
  const [a, tous, labels, vignerons] = await Promise.all([getArticle(slug, locale), getArticles(locale), getRubriqueLabels(locale), getVignerons(locale)]);
  if (!a) notFound();

  const t = await getTranslations("mag");
  const tLegal = await getTranslations("legal");
  // Rubrique principale : fil d'Ariane, sur-titre et données structurées (l'adresse reste unique).
  const rubrique = a.rubriquePrincipale && labels[a.rubriquePrincipale] ? a.rubriquePrincipale : a.rubriques.find((r) => labels[r]);
  const [aDate] = withDates([a], locale);
  const cites = vignerons.filter((v) => a.vignerons.includes(v.slug));

  // Articles liés : mêmes vignerons d'abord, puis même rubrique, puis les plus récents.
  const score = (o: (typeof tous)[number]) =>
    o.vignerons.filter((v) => a.vignerons.includes(v)).length * 3 + o.rubriques.filter((r) => a.rubriques.includes(r)).length;
  const lies = withDates(
    tous
      .filter((o) => o.slug !== a.slug)
      .map((o, i) => ({ o, s: score(o), i }))
      .sort((x, y) => y.s - x.s || x.i - y.i)
      .slice(0, 3)
      .map((x) => x.o),
    locale,
  );

  const url = SITE_URL + getPathname({ href: { pathname: "/[article]", params: { article: slug } }, locale });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titre,
    description: a.extrait,
    image: a.image ? [a.image.src] : undefined,
    datePublished: a.date,
    dateModified: a.updatedAt ?? a.date,
    inLanguage: locale,
    mainEntityOfPage: url,
    articleSection: rubrique ? labels[rubrique] : undefined,
    author: { "@type": "Organization", name: "Champagne de l'Aube", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Champagne de l'Aube",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png` },
    },
    about: cites.map((v) => ({ "@type": "Organization", name: v.nom })),
  };

  return (
    <>
      <Breadcrumb
        locale={locale}
        items={[{ label: t("h1"), href: "/le-mag" }, ...(rubrique ? [{ label: labels[rubrique], href: rubriqueHref(rubrique) }] : []), { label: a.titre }]}
      />
      <article>
        <header className="mx-auto max-w-3xl px-space-2 pb-space-3 pt-space-4 sm:px-space-4 lg:pt-space-5">
          <p className="text-sur-titre text-bronze">{[rubrique && labels[rubrique], aDate.dateLabel].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-space-1 text-titre-post">{a.titre}</h1>
          {a.collaborationCommerciale && (
            <p className="mt-space-2 inline-block rounded-etiquette border border-filet px-space-1 py-0.5 text-sur-titre-petit text-gris-chaud">{tLegal("sponsored")}</p>
          )}
          {a.extrait && <p className="mt-space-3 text-accroche text-gris-chaud">{a.extrait}</p>}
        </header>
        <div data-reveal className="mx-auto max-w-5xl px-space-2 sm:px-space-4">
          <Photo image={a.image} ratio="16/9" sizes="(min-width: 1024px) 1024px, 100vw" priority compactMobile />
        </div>
        {a.contenu?.length ? (
          <div className="mx-auto max-w-3xl px-space-2 py-space-5 sm:px-space-4">
            <RichText value={a.contenu} locale={locale} />
          </div>
        ) : null}
      </article>

      {cites.length > 0 && (
        <Section fond="chaude" titre={t("vignerons")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
            {cites.map((v) => (
              <li key={v.slug}>
                <DomaineCard domaine={v} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {lies.length > 0 && (
        <Section titre={t("lies")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {lies.map((o) => (
              <li key={o.slug}>
                <MagCard article={o} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
