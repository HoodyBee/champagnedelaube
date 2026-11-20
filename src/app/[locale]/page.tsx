import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CarteTerroirs } from "@/components/home/CarteTerroirs";
import { SocialIcon } from "@/components/icons/SocialLinks";
import { MagCard } from "@/components/mag/MagCard";
import { CatalogueDialog } from "@/components/selection/CatalogueDialog";
import { ButtonLink } from "@/components/ui/Button";
import { Chiffres } from "@/components/ui/Chiffres";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { getPathname, Link } from "@/i18n/navigation";
import { pageMetadata, SITE_URL, withSlash } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { terroirs } from "@/lib/brand";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { nav, terroirPages } from "@/lib/site";
import { CalendrierAccueil } from "@/components/calendrier/CalendrierAccueil";
import { dateDuJourParis, getCalendrierVue } from "@/lib/calendrier-serveur";
import { CATEGORIES_CALENDRIER, getAccueil, getArticles, getCuvees, getSlugArticleMarronnier, getTerroir } from "@/sanity/content";
import { getReglages } from "@/sanity/queries";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "home" });
  const a = await getAccueil(locale);
  return pageMetadata({ locale, href: "/", seo: a.seo, title: t("metaTitle"), description: t("metaDescription"), image: a.hero.image });
}

/**
 * Accueil, en magazine. Hiérarchie : les terroirs et l'identité, les dégustations privées,
 * les vignerons (portraits), la sélection (secondaire, progressive), l'espace pro, Le Mag,
 * puis un dernier appel au contact. Une marque de découverte, pas une boutique.
 * Les sections sans contenu publié se replient proprement (aucun contenu inventé).
 */
export default async function Accueil({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const tMag = await getTranslations("mag");
  const tLegal = await getTranslations("legal");
  const tSel = await getTranslations("selection");
  const tCal = await getTranslations("calendrier");
  const [calendrier, slugMarronnier, aujourdhui] = await Promise.all([getCalendrierVue(locale), getSlugArticleMarronnier(), dateDuJourParis()]);
  const [a, reglages, cuvees, articles, labels, ...fiches] = await Promise.all([
    getAccueil(locale),
    getReglages(),
    getCuvees(locale, { accueil: true }),
    getArticles(locale),
    getRubriqueLabels(locale),
    ...terroirPages.map((p) => getTerroir(p.key, locale)),
  ]);

  const chiffres = a.chiffres.length
    ? a.chiffres
    : (["vignoble", "appellations", "pinot", "degustation"] as const).map((k) => ({
        valeur: t(`chiffres.${k}.valeur`),
        label: t(`chiffres.${k}.label`),
      }));
  const portraits = withDates(articles.filter((x) => x.rubriques.includes("portraits")), locale).slice(0, 3);
  const dejaVus = new Set(portraits.map((p) => p.slug));
  const derniers = withDates(articles.filter((x) => !dejaVus.has(x.slug)), locale).slice(0, 3);

  // Alternance blanc / crème clair, quelles que soient les sections affichées.
  const sections = ["terroirs", "degustations", ...(portraits.length ? ["portraits"] : []), "pepites", "pro", "mag", "calendrier"] as const;
  const fond = (id: (typeof sections)[number]) => (sections.indexOf(id) % 2 === 1 ? "chaude" : "blanc");

  // Données structurées : l'organisation et son activité locale à Troyes.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Champagne de l'Aube",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png`,
    image: `${SITE_URL}/brand/logos/logo-empile-rond-bandeau.png`,
    email: reglages.email,
    address: { "@type": "PostalAddress", addressLocality: "Troyes", addressRegion: "Aube", addressCountry: "FR" },
    areaServed: "Aube",
    sameAs: ["https://www.instagram.com/champagnedelaube/", "https://www.facebook.com/292357553960308/"],
  };

  return (
    <>
      {/* 1. La promesse */}
      <Hero
        surTitre={a.hero.surTitre ?? t("heroSurTitre")}
        titre={a.hero.titre ?? t("heroTitre")}
        intro={a.hero.intro ?? t("heroIntro")}
        image={a.hero.image}
        placeholder="sobre"
        placeholderText={t("photoAVenir")}
        actions={
          <>
            <ButtonLink href={{ pathname: nav.particuliers[0].href, hash: "organiser" }}>{a.heroCtaDegustation ?? t("heroCtaDegustation")}</ButtonLink>
            <ButtonLink href={nav.terroirHub.href} variant="secondaire">
              {a.heroCtaTerroirs ?? t("heroCtaTerroirs")}
            </ButtonLink>
          </>
        }
      />
      <Chiffres items={chiffres} />

      {/* 2. Les terroirs de l'Aube : carte stylisée et 4 portes d'entrée */}
      <Section id="terroirs" fond={fond("terroirs")}>
        <div className="grid items-center gap-space-4 lg:grid-cols-[1fr_1fr] lg:gap-space-5">
          <div className="flex flex-col">
            <p className="text-sur-titre text-bronze">{t("terroirsSurTitre")}</p>
            <h2 className="mt-space-1 text-titre-section sm:text-[2rem]">{t("terroirsTitre")}</h2>
            <p className="mt-space-2 max-w-lg text-[1.0625rem] text-gris-chaud">{t("terroirsIntro")}</p>
            <div className="mx-auto mt-space-4 w-full max-w-md lg:max-w-[440px]">
              <CarteTerroirs legende={t("carteLegende")} troyes={t("carteTroyes")} />
            </div>
          </div>
          <ul className="grid gap-space-2 sm:grid-cols-2">
            {terroirPages.map((p, i) => (
              <li key={p.key}>
                <Link href={p.href} className="group flex h-full flex-col overflow-hidden rounded-carte border border-filet bg-blanc transition-colors hover:border-bronze">
                  <Photo image={fiches[i].image} ratio="4/3" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <span className="flex flex-1 flex-col p-space-2">
                    <span className="inline-flex items-center gap-1.5 text-[1.25rem] font-bold leading-tight group-hover:text-bronze">
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-rond" style={{ backgroundColor: `var(--color-${terroirs[p.key].color})` }} />
                      {p.label}
                    </span>
                    <span className="mt-1 text-[0.9375rem] text-gris-chaud">{t(`terroirsCartes.${p.key}`)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-space-4 text-center">
          <ButtonLink href={nav.terroirHub.href} variant="secondaire">
            {t("terroirsCta")}
          </ButtonLink>
        </div>
      </Section>

      {/* 3. Dégustations privées : section immersive, bien repérable */}
      <Section id="degustations-privees" fond={fond("degustations")}>
        <div className="grid items-center gap-space-4 lg:grid-cols-[1.15fr_1fr] lg:gap-space-5">
          <Photo image={a.degustationImage} ratio="4/3" sizes="(min-width: 1024px) 55vw, 100vw" placeholder="sobre" placeholderText={t("photoAVenir")} />
          <div>
            <LineIcon name="degustation" size={32} className="text-or" />
            <h2 className="mt-space-2 text-titre-section sm:text-[2.25rem]">{a.degustationTitre ?? t("degustTitre")}</h2>
            <p className="mt-space-2 text-accroche">{a.degustationAccroche ?? t("degustAccroche")}</p>
            <p className="mt-space-2 text-[1.0625rem] text-gris-chaud">{a.degustationTexte ?? t("degustTexte")}</p>
            <p className="mt-space-3 border-l-2 border-or pl-space-2 text-[1.25rem] font-bold italic text-bronze">{t("degustSignature")}</p>
            <div className="mt-space-4 flex flex-col gap-space-1 sm:flex-row sm:flex-wrap">
              <ButtonLink href={{ pathname: nav.particuliers[0].href, hash: "organiser" }}>{t("degustCta")}</ButtonLink>
              <ButtonLink href={nav.particuliers[0].href} variant="secondaire">
                {t("degustCtaSecondaire")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Rencontres et portraits : seulement si des portraits sont publiés dans Le Mag */}
      {portraits.length > 0 && (
        <Section id="portraits" fond={fond("portraits")} surTitre={t("portraitsSurTitre")} titre={t("portraitsTitre")} intro={t("portraitsIntro")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {portraits.map((x) => (
              <li key={x.slug}>
                <MagCard article={x} labels={labels} lire={tMag("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 5. Les pépites du moment : section secondaire, sobre (cuvées publiées dans Sanity ; sinon introduction et liens seuls) */}
      <Section id="pepites" fond={fond("pepites")} align="gauche" surTitre={t("pepitesSurTitre")} titre={a.pepitesTitre ?? t("pepitesTitre")} intro={a.pepitesIntro ?? t("pepitesIntro")}>
        {cuvees.length > 0 && (
          <ul className={`grid gap-space-4 sm:grid-cols-2 ${cuvees.length >= 3 ? "lg:grid-cols-3" : ""} ${cuvees.length === 1 ? "mx-auto max-w-md sm:grid-cols-1" : ""}`}>
            {cuvees.slice(0, 3).map((c) => (
              <li key={c.id}>
                <article className="group relative flex h-full flex-col">
                  <div className="overflow-hidden rounded-carte">
                    <Photo image={c.photo} ratio="4/5" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <p className="mt-space-2 text-sur-titre-petit text-bronze">{[c.domaine, c.village].filter(Boolean).join(" · ")}</p>
                  <h3 className="mt-1 text-[1.375rem] font-bold leading-tight">{c.nom}</h3>
                  {c.histoire && <p className="mt-space-1 text-gris-chaud">{c.histoire}</p>}
                  {c.vigneronSlug && (
                    <Link
                      href={{ pathname: "/vignerons/[slug]", params: { slug: c.vigneronSlug } }}
                      className="mt-auto inline-flex items-center gap-space-1 pt-space-2 text-sur-titre-petit text-anthracite after:absolute after:inset-0 group-hover:text-bronze"
                    >
                      {tSel("decouvrirDomaine")} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
        <div className={`flex flex-col items-start gap-space-2 sm:flex-row sm:items-center sm:gap-space-3 ${cuvees.length ? "mt-space-4" : ""}`}>
          <Link href={nav.vignerons.href} className="inline-flex min-h-11 items-center gap-space-1 text-sur-titre-petit text-anthracite hover:text-bronze">
            {t("pepitesLien")} <span aria-hidden="true">→</span>
          </Link>
          <CatalogueDialog variant="secondaire" />
        </div>
      </Section>

      {/* 6. Espace Pro & Entreprises */}
      <Section id="pro" fond={fond("pro")} surTitre={t("proSurTitre")} titre={t("proTitre")} intro={t("proIntro")}>
        <div className="grid gap-space-3 md:grid-cols-2">
          {(
            [
              ["proCarte", "tarif", nav.pro[0].href],
              ["entCarte", "coffret", nav.entreprises.href],
            ] as const
          ).map(([k, icone, href]) => (
            <div key={k} className="flex flex-col rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
              <LineIcon name={icone} size={32} className="text-or" />
              <h3 className="mt-space-2 text-[1.5rem] font-bold leading-tight">{t(`${k}Titre`)}</h3>
              <p className="mt-space-1 flex-1 text-gris-chaud">{t(`${k}Texte`)}</p>
              <ButtonLink href={href} variant="secondaire" className="mt-space-3 self-start">
                {t(`${k}Cta`)}
              </ButtonLink>
            </div>
          ))}
        </div>
        <p className="mt-space-3 text-center">
          <Link href={nav.pro[1].href} className="text-bronze underline underline-offset-4">
            {tNav("proVignerons")}
          </Link>
        </p>
      </Section>

      {/* 7. Le Mag du Champagne */}
      <Section id="le-mag" fond={fond("mag")} surTitre={t("magSurTitre")} titre={t("magTitre")} intro={t("magIntro")}>
        {derniers.length > 0 && (
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {derniers.map((x) => (
              <li key={x.slug}>
                <MagCard article={x} labels={labels} lire={tMag("lire")} sponsored={tLegal("sponsored")} />
              </li>
            ))}
          </ul>
        )}
        <div className={`text-center ${derniers.length ? "mt-space-4" : ""}`}>
          <ButtonLink href={nav.mag.href} variant="secondaire">
            {t("magCta")}
          </ButtonLink>
        </div>
      </Section>

      {/* 7 bis. Le calendrier : mes événements et les journées du marronnier, qui se répondent */}
      {calendrier.length > 0 && (
        <Section id="calendrier" fond={fond("calendrier")} align="gauche" surTitre={tCal("accueilSurTitre")} titre={tCal("accueilTitre")} intro={tCal("accueilIntro")}>
          <CalendrierAccueil
            dates={calendrier}
            locale={locale}
            aujourdhuiServeur={aujourdhui}
            hrefTout={
              slugMarronnier
                ? withSlash(getPathname({ href: { pathname: "/[article]", params: { article: slugMarronnier } }, locale }))
                : withSlash(getPathname({ href: "/le-mag", locale }))
            }
            textes={{
              categories: Object.fromEntries(CATEGORIES_CALENDRIER.map((c) => [c, tCal(`categories.${c}`)])) as Record<(typeof CATEGORIES_CALENDRIER)[number], string>,
              precedent: tCal("precedent"),
              suivant: tCal("suivant"),
              prochaines: tCal("prochaines"),
              voirTout: tCal("voirTout"),
              aucuneProchaine: tCal("aucuneProchaine"),
              legende: tCal("legende"),
              aConfirmer: tCal("aConfirmer"),
              fermer: tCal("fermer"),
            }}
          />
        </Section>
      )}

      {/* 8. Dernier appel : le motif vitrail, en décor discret */}
      <Section id="contact">
        <div className="vitrail relative overflow-hidden rounded-carte border border-filet px-space-3 py-space-5 text-center sm:px-space-5">
          <div className="relative mx-auto max-w-2xl rounded-carte bg-creme-clair/90 px-space-3 py-space-4 sm:px-space-5">
            <h2 className="text-titre-section sm:text-[2rem]">{t("finalTitre")}</h2>
            <p className="mx-auto mt-space-2 max-w-xl text-[1.0625rem] text-gris-chaud">{t("finalTexte")}</p>
            <div className="mt-space-3 flex flex-col items-center justify-center gap-space-1 sm:flex-row">
              <ButtonLink href={nav.contact.href}>{t("finalCta")}</ButtonLink>
              <a href={`mailto:${reglages.email}`} className="inline-flex min-h-12 items-center px-space-2 text-bronze underline underline-offset-4">
                {reglages.email}
              </a>
            </div>
            {reglages.instagramUrl && (
              <a
                href={reglages.instagramUrl}
                target="_blank"
                rel="noopener"
                className="mt-space-2 inline-flex min-h-11 items-center gap-space-1 text-sur-titre-petit text-anthracite hover:text-bronze"
              >
                <SocialIcon name="instagram" size={18} />
                {t("instagram")}
              </a>
            )}
          </div>
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
