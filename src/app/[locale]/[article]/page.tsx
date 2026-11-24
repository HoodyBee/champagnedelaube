import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarronnierBloc } from "@/components/calendrier/MarronnierBloc";
import { EtiquettesArticle } from "@/components/mag/ArticlesEtiquette";
import { MagCard } from "@/components/mag/MagCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getPathname, Link } from "@/i18n/navigation";
import { NOINDEX, pageMetadata, SITE_URL, withSlash } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { imageObject } from "@/lib/image-jsonld";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticle, getArticleLangues, getArticles, getArticleSlugs, getVignerons, rubriqueHref } from "@/sanity/content";

type Props = PageProps<"/[locale]/[article]">;

/**
 * Contenus publiés APRÈS la mise en ligne (nouvel article, nouvelle fiche…) : sans ce réglage,
 * Netlify tente de fabriquer la page à l'avance, échoue et répond « erreur 500 ». Avec lui, la
 * page est construite à la première visite, puis gardée en cache. Les adresses inconnues
 * reçoivent un vrai 404 grâce au proxy (src/lib/adresses-connues.ts).
 */
export const instant = false;

/** Articles générés à l'avance pour chaque langue (au moins un paramètre : exigence de Next.js). */
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return routing.locales.flatMap((locale) => (slugs.length ? slugs : ["le-mag-bientot"]).map((article) => ({ locale, article })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, article: slug } = (await params) as { locale: Locale; article: string };
  const [a, langues] = await Promise.all([getArticle(slug, locale), getArticleLangues()]);
  if (!a) notFound();
  // Article sans traduction dans cette langue : la page affiche le français -> pas d'indexation, canonique vers le français.
  const traduit = (langues[slug] ?? []).includes(locale);
  const meta = await pageMetadata({
    locale,
    href: { pathname: "/[article]", params: { article: slug } },
    seo: a.seo,
    title: titreArticle(a.titre),
    description: a.extrait ?? a.titre,
    image: a.image,
    type: "article",
    article: { publishedTime: a.date, modifiedTime: a.updatedAt },
  });
  if (!traduit && locale !== "fr") {
    meta.robots = NOINDEX;
    meta.alternates = { canonical: withSlash(getPathname({ href: { pathname: "/[article]", params: { article: slug } }, locale: "fr" })) };
  }
  return meta;
}

/**
 * Titre pour Google d'un article sans « Titre pour Google » dans le Studio : on ajoute le nom
 * du site s'il reste de la place (60 caractères au plus), sinon le titre seul.
 */
function titreArticle(titre: string) {
  const long = `${titre} | Champagne de l'Aube`;
  return long.length <= 60 ? long : titre;
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
  // Bloc « Calendrier du marronnier » placé dans le texte (Studio) : tableau filtrable + PDF.
  const blocCal = a.contenu?.find((b) => b._type === "calendrierMarronnier") as { annee?: number } | undefined;
  const blocMarronnier = blocCal ? <MarronnierBloc locale={locale} annee={blocCal.annee} /> : null;
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

  // Chapeau identique au début du texte (ex. article labels) : on ne l'affiche pas deux fois.
  const premierParagraphe = (a.contenu?.find((b) => b._type === "block") as { children?: { text?: string }[] } | undefined)?.children?.map((c) => c.text ?? "").join("") ?? "";
  const norm = (x: string) => x.replace(/\s+/g, " ").trim().toLowerCase();
  const chapeauRepete = !!a.extrait && norm(premierParagraphe).startsWith(norm(a.extrait).slice(0, 80));
  const url = SITE_URL + withSlash(getPathname({ href: { pathname: "/[article]", params: { article: slug } }, locale }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titre,
    description: a.extrait,
    image: a.image ? [imageObject(a.image)] : undefined,
    datePublished: a.date,
    dateModified: a.updatedAt ?? a.date,
    inLanguage: locale,
    mainEntityOfPage: url,
    articleSection: rubrique ? labels[rubrique] : undefined,
    author: { "@type": "Organization", name: "Champagne de l'Aube", url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organisation`,
      name: "Champagne de l'Aube",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png`, width: 3000, height: 3000 },
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
          {a.extrait && !chapeauRepete && <p className="mt-space-3 text-accroche text-gris-chaud">{a.extrait}</p>}
          <EtiquettesArticle codes={a.etiquettes} locale={locale} className="mt-space-3" />
        </header>
        <div data-reveal className="mx-auto max-w-5xl px-space-2 sm:px-space-4">
          <Photo image={a.image} ratio="16/9" sizes="(min-width: 1024px) 1024px, 100vw" priority compactMobile />
        </div>
        {a.contenu?.length ? (
          <div className="mx-auto max-w-3xl px-space-2 py-space-5 sm:px-space-4">
            <RichText value={a.contenu} locale={locale} extras={blocMarronnier ? { calendrierMarronnier: blocMarronnier } : undefined} />
          </div>
        ) : null}
        {/* Étiquette « Marketing » : l'article se termine par un encart vers la page Communication & marketing. */}
        {a.etiquettes.includes("marketing") && (
          <aside aria-labelledby="encart-marketing" className="mx-auto max-w-3xl px-space-2 pb-space-4 sm:px-space-4">
            <div className="rounded-carte border border-or bg-champagne/40 p-space-3 sm:p-space-4">
              <h2 id="encart-marketing" className="text-titre-section">{t("encartMarketing.titre")}</h2>
              <p className="mt-space-1 text-[1.0625rem] text-gris-chaud">{t("encartMarketing.texte")}</p>
              <ButtonLink href="/communication-marketing" className="mt-space-3">
                {t("encartMarketing.bouton")}
              </ButtonLink>
            </div>
          </aside>
        )}
        {/* Continuer la découverte : la rubrique de l'article et deux pages clés, avec des ancres explicites */}
        <nav aria-label={t("plusLoin")} className="mx-auto max-w-3xl px-space-2 pb-space-5 sm:px-space-4">
          <div className="rounded-carte border border-filet bg-creme-clair p-space-3">
            <p className="text-sur-titre-petit text-bronze">{t("plusLoin")}</p>
            <ul className="mt-space-1 space-y-1 text-[1.0625rem]">
              {rubrique && (
                <li>
                  <Link href={rubriqueHref(rubrique)} className="underline decoration-or underline-offset-4 hover:text-bronze">
                    {t("tousArticlesRubrique", { rubrique: labels[rubrique] })}
                  </Link>
                </li>
              )}
              <li>
                <Link href="/tasting-troyes" className="underline decoration-or underline-offset-4 hover:text-bronze">
                  {t("lienDegustations")}
                </Link>
              </li>
              <li>
                <Link href="/vignerons" className="underline decoration-or underline-offset-4 hover:text-bronze">
                  {t("lienSelection")}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
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
