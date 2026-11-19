// Lecture des contenus Sanity pour les pages, dans la langue demandée.
// Chaque fonction renvoie des données prêtes à afficher ; un champ vide vaut
// `undefined` et la page utilise alors son texte par défaut (messages/*.json).

import type { PortableTextBlock } from "next-sanity";
import type { Img } from "@/components/ui/types";
import type { DomaineCardData } from "@/components/ui/DomaineCard";
import type { Locale } from "@/i18n/routing";
import type { CepageKey, PictoKey, TerroirKey } from "@/lib/brand";
import { fallbackVignerons } from "@/lib/fallback-vignerons";
import type { LineIconName } from "@/lib/line-icons";
import { localize, type Localized } from "./lib/i18n";
import { sanityFetch } from "./lib/fetch";
import { urlFor } from "./lib/image";

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------
const IMG = `{alt, credit, hotspot, crop, asset->{_id, url, metadata{lqip, dimensions{width, height}}}}`;
type SanityImg = {
  alt?: Localized;
  credit?: string;
  hotspot?: unknown;
  crop?: unknown;
  asset?: { _id: string; url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
} | null;

/** Image Sanity -> image prête pour next/image (recadrée selon le point d'intérêt). */
export function toImg(img: SanityImg | undefined, locale: Locale, width = 1600): Img | null {
  if (!img?.asset?._id) return null;
  const d = img.asset.metadata?.dimensions ?? { width: 1600, height: 1067 };
  return {
    src: urlFor(img as never).width(width).fit("max").url(),
    alt: localize(img.alt, locale) ?? "",
    width,
    height: Math.round((width * d.height) / d.width),
    blurDataURL: img.asset.metadata?.lqip,
  };
}

const L = (v: Localized | undefined, locale: Locale) => localize(v, locale) || undefined;
type LocalizedBlocks = Localized<PortableTextBlock[]>;
type SeoRaw = { title?: Localized; description?: Localized; noIndex?: boolean; image?: SanityImg };
export type Seo = { title?: string; description?: string; noIndex?: boolean };
const seoOf = (s: SeoRaw | undefined, locale: Locale): Seo => ({
  title: L(s?.title, locale),
  description: L(s?.description, locale),
  noIndex: s?.noIndex,
});

// ---------------------------------------------------------------------------
// Briques communes
// ---------------------------------------------------------------------------
type HeroRaw = { surTitre?: Localized; titre?: Localized; intro?: Localized; image?: SanityImg };
export type Hero = { surTitre?: string; titre?: string; intro?: string; image: Img | null };
const heroOf = (h: HeroRaw | undefined, locale: Locale): Hero => ({
  surTitre: L(h?.surTitre, locale),
  titre: L(h?.titre, locale),
  intro: L(h?.intro, locale),
  image: toImg(h?.image, locale),
});

type BlocRaw = { icone?: LineIconName; surTitre?: Localized; titre?: Localized; texte?: LocalizedBlocks; points?: Localized[]; image?: SanityImg };
export type Bloc = { icone?: LineIconName; surTitre?: string; titre?: string; texte?: PortableTextBlock[]; points: string[]; image: Img | null };
const blocOf = (b: BlocRaw | undefined, locale: Locale): Bloc => ({
  icone: b?.icone,
  surTitre: L(b?.surTitre, locale),
  titre: L(b?.titre, locale),
  texte: localize(b?.texte, locale),
  points: (b?.points ?? []).map((p) => L(p, locale)).filter((p): p is string => !!p),
  image: toImg(b?.image, locale),
});

type ArgumentRaw = { icone?: LineIconName; titre?: Localized; texte?: Localized };
export type Argument = { icone?: LineIconName; titre: string; texte?: string };
const argumentsOf = (list: ArgumentRaw[] | undefined, locale: Locale): Argument[] =>
  (list ?? []).flatMap((a) => {
    const titre = L(a.titre, locale);
    return titre ? [{ icone: a.icone, titre, texte: L(a.texte, locale) }] : [];
  });

const faqOf = (list: { question?: Localized; reponse?: Localized }[] | undefined, locale: Locale) =>
  (list ?? []).flatMap((q) => {
    const question = L(q.question, locale);
    const reponse = L(q.reponse, locale);
    return question && reponse ? [{ question, reponse }] : [];
  });

// ---------------------------------------------------------------------------
// Vignerons
// ---------------------------------------------------------------------------
const VIGNERON_CARD = `nom, "slug": slug.current, village, "terroir": terroir->cle, accroche, philosophie, partenaire, espacePro,
  collaborationCommerciale, cepages, thematiques, labels, portrait ${IMG}, image ${IMG}, ordre`;

type VigneronRaw = {
  nom: string;
  slug: string;
  village?: string;
  terroir?: TerroirKey;
  accroche?: Localized;
  philosophie?: Localized;
  partenaire?: boolean;
  espacePro?: boolean;
  collaborationCommerciale?: boolean;
  cepages?: CepageKey[];
  thematiques?: PictoKey[];
  labels?: string[];
  portrait?: SanityImg;
  image?: SanityImg;
};

export type Vigneron = DomaineCardData & { accroche?: string; espacePro: boolean; partenaire: boolean };

const cardOf = (v: VigneronRaw, locale: Locale): Vigneron => ({
  slug: v.slug,
  nom: v.nom,
  village: v.village,
  terroir: v.terroir,
  philosophie: L(v.philosophie, locale),
  accroche: L(v.accroche, locale),
  portrait: toImg(v.portrait, locale, 900) ?? toImg(v.image, locale, 900),
  thematiques: v.thematiques ?? [],
  labels: v.labels ?? [],
  espacePro: v.espacePro !== false,
  partenaire: v.partenaire !== false,
});

const fallbackCards = (locale: Locale): Vigneron[] =>
  fallbackVignerons.map((f) => ({
    slug: f.slug,
    nom: f.nom,
    village: f.village,
    terroir: f.terroir,
    philosophie: f.philosophie[locale],
    accroche: f.accroche[locale],
    portrait: null,
    thematiques: f.thematiques,
    labels: f.labels,
    espacePro: true,
    partenaire: true,
  }));

/** Tous les vignerons publiés ; à défaut, les fiches par défaut. */
export async function getVignerons(locale: Locale): Promise<Vigneron[]> {
  const list = await sanityFetch<VigneronRaw[]>({
    query: `*[_type == "vigneron" && defined(slug.current)] | order(coalesce(ordre, 100) asc, nom asc){${VIGNERON_CARD}}`,
    tags: ["vigneron", "terroir"],
  });
  return list?.length ? list.map((v) => cardOf(v, locale)) : fallbackCards(locale);
}

export type VigneronDetail = Vigneron & {
  image: Img | null;
  intro?: string;
  histoire?: PortableTextBlock[];
  personnes: { nom: string; role?: string; photo: Img | null }[];
  cepages: CepageKey[];
  pratiques: string[];
  siteWeb?: string;
  instagram?: string;
  logo: Img | null;
  galerie: Img[];
  collaborationCommerciale: boolean;
  seo: Seo;
};

export async function getVigneron(slug: string, locale: Locale): Promise<VigneronDetail | null> {
  const v = await sanityFetch<
    | (VigneronRaw & {
        intro?: Localized;
        histoire?: LocalizedBlocks;
        personnes?: { nom?: string; role?: Localized; photo?: SanityImg }[];
        pratiques?: Localized[];
        siteWeb?: string;
        instagram?: string;
        logo?: SanityImg;
        galerie?: SanityImg[];
        seo?: SeoRaw;
      })
    | null
  >({
    query: `*[_type == "vigneron" && slug.current == $slug][0]{${VIGNERON_CARD}, intro, histoire, personnes[]{nom, role, photo ${IMG}},
      pratiques, siteWeb, instagram, logo ${IMG}, galerie[] ${IMG}, seo}`,
    params: { slug },
    tags: ["vigneron", "terroir"],
  });
  if (v) {
    return {
      ...cardOf(v, locale),
      image: toImg(v.image, locale) ?? toImg(v.portrait, locale),
      intro: L(v.intro, locale),
      histoire: localize(v.histoire, locale),
      personnes: (v.personnes ?? []).filter((p) => p.nom).map((p) => ({ nom: p.nom!, role: L(p.role, locale), photo: toImg(p.photo, locale, 400) })),
      cepages: v.cepages ?? [],
      pratiques: (v.pratiques ?? []).map((p) => L(p, locale)).filter((p): p is string => !!p),
      siteWeb: v.siteWeb,
      instagram: v.instagram,
      logo: toImg(v.logo, locale, 400),
      galerie: (v.galerie ?? []).map((g) => toImg(g, locale, 1200)).filter((g): g is Img => !!g),
      collaborationCommerciale: v.collaborationCommerciale === true,
      seo: seoOf(v.seo, locale),
    };
  }
  // Aucune fiche publiée : fiche par défaut, seulement si aucun vigneron n'est publié.
  const published = await sanityFetch<number>({ query: `count(*[_type == "vigneron" && defined(slug.current)])`, tags: ["vigneron"] });
  if (published) return null;
  const f = fallbackVignerons.find((x) => x.slug === slug);
  if (!f) return null;
  return {
    ...fallbackCards(locale).find((c) => c.slug === slug)!,
    image: null,
    intro: undefined,
    histoire: undefined,
    personnes: f.personnes.map((p) => ({ nom: p.nom, role: p.role[locale], photo: null })),
    cepages: f.cepages,
    pratiques: f.pratiques.map((p) => p[locale]),
    siteWeb: f.siteWeb,
    logo: null,
    galerie: [],
    collaborationCommerciale: false,
    seo: {},
  };
}

/** Adresses des fiches vignerons, pour les générer à l'avance. */
export async function getVigneronSlugs(): Promise<string[]> {
  const slugs = await sanityFetch<string[]>({ query: `*[_type == "vigneron" && defined(slug.current)].slug.current`, tags: ["vigneron"] });
  return slugs?.length ? slugs : fallbackVignerons.map((f) => f.slug);
}

// ---------------------------------------------------------------------------
// Accueil
// ---------------------------------------------------------------------------
type EntreeRaw = { surTitre?: Localized; titre?: Localized; texte?: Localized; bouton?: Localized; image?: SanityImg };
export type Entree = { surTitre?: string; titre?: string; texte?: string; bouton?: string; image: Img | null };
const entreeOf = (e: EntreeRaw | undefined, locale: Locale): Entree => ({
  surTitre: L(e?.surTitre, locale),
  titre: L(e?.titre, locale),
  texte: L(e?.texte, locale),
  bouton: L(e?.bouton, locale),
  image: toImg(e?.image, locale, 1200),
});

export async function getAccueil(locale: Locale) {
  const a = await sanityFetch<{
    hero?: HeroRaw;
    chiffres?: { valeur?: Localized | string; label?: Localized }[];
    entreePro?: EntreeRaw;
    entreeEntreprises?: EntreeRaw;
    entreeParticuliers?: EntreeRaw;
    terroir?: BlocRaw;
    photoPleineLargeur?: SanityImg;
    selectionTitre?: Localized;
    selectionTexte?: Localized;
    reassurance?: ArgumentRaw[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "accueil"][0]{
      hero{surTitre, titre, intro, image ${IMG}}, chiffres,
      entreePro{surTitre, titre, texte, bouton, image ${IMG}},
      entreeEntreprises{surTitre, titre, texte, bouton, image ${IMG}},
      entreeParticuliers{surTitre, titre, texte, bouton, image ${IMG}},
      terroir{icone, surTitre, titre, texte, points, image ${IMG}},
      photoPleineLargeur ${IMG}, selectionTitre, selectionTexte,
      reassurance, seo}`,
    tags: ["accueil"],
  });
  return {
    hero: heroOf(a?.hero, locale),
    chiffres: (a?.chiffres ?? []).flatMap((c) => {
      const label = L(c.label, locale);
      const valeur = typeof c.valeur === "string" ? c.valeur : L(c.valeur, locale);
      return valeur && label ? [{ valeur, label }] : [];
    }),
    entrees: {
      pro: entreeOf(a?.entreePro, locale),
      entreprises: entreeOf(a?.entreeEntreprises, locale),
      particuliers: entreeOf(a?.entreeParticuliers, locale),
    },
    terroir: blocOf(a?.terroir, locale),
    photoPleineLargeur: toImg(a?.photoPleineLargeur, locale, 2400),
    selectionTitre: L(a?.selectionTitre, locale),
    selectionTexte: L(a?.selectionTexte, locale),
    reassurance: argumentsOf(a?.reassurance, locale),
    seo: seoOf(a?.seo, locale),
  };
}

// ---------------------------------------------------------------------------
// Espace Pro
// ---------------------------------------------------------------------------
export async function getEspacePro(locale: Locale) {
  const p = await sanityFetch<{
    hero?: HeroRaw;
    profils?: BlocRaw[];
    arguments?: ArgumentRaw[];
    portfolioTitre?: Localized;
    portfolioIntro?: Localized;
    references?: { nom?: string; ville?: string; logo?: SanityImg }[];
    grilleTitre?: Localized;
    grilleTexte?: Localized;
    degustationTitre?: Localized;
    degustationTexte?: Localized;
    faq?: { question?: Localized; reponse?: Localized }[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "espacePro"][0]{hero{surTitre, titre, intro, image ${IMG}}, profils[]{icone, surTitre, titre, texte, points, image ${IMG}},
      arguments, portfolioTitre, portfolioIntro, references[]{nom, ville, logo ${IMG}},
      grilleTitre, grilleTexte, degustationTitre, degustationTexte, faq, seo}`,
    tags: ["espacePro"],
  });
  return {
    hero: heroOf(p?.hero, locale),
    profils: (p?.profils ?? []).map((b) => blocOf(b, locale)).filter((b) => b.titre),
    arguments: argumentsOf(p?.arguments, locale),
    portfolioTitre: L(p?.portfolioTitre, locale),
    portfolioIntro: L(p?.portfolioIntro, locale),
    references: (p?.references ?? []).filter((r) => r.nom).map((r) => ({ nom: r.nom!, ville: r.ville, logo: toImg(r.logo, locale, 400) })),
    grilleTitre: L(p?.grilleTitre, locale),
    grilleTexte: L(p?.grilleTexte, locale),
    degustationTitre: L(p?.degustationTitre, locale),
    degustationTexte: L(p?.degustationTexte, locale),
    faq: faqOf(p?.faq, locale),
    seo: seoOf(p?.seo, locale),
  };
}

// ---------------------------------------------------------------------------
// Prochain événement (affiché seulement s'il y en a un à venir)
// ---------------------------------------------------------------------------
export async function getProchainEvenement(locale: Locale) {
  const e = await sanityFetch<{
    titre?: Localized;
    slug?: string;
    debut: string;
    lieu?: { nom?: string; ville?: string };
    places?: number;
    complet?: boolean;
    accroche?: Localized;
    image?: SanityImg;
  } | null>({
    // Cache court (une heure) : un événement passé disparaît de lui-même.
    query: `*[_type == "evenement" && dateTime(debut) > dateTime(now())] | order(debut asc)[0]{titre, "slug": slug.current, debut, lieu, places, complet, accroche, image ${IMG}}`,
    tags: ["evenement"],
    life: "hours",
  });
  if (!e?.debut || !L(e.titre, locale)) return null;
  return {
    titre: L(e.titre, locale)!,
    debut: e.debut,
    lieu: [e.lieu?.nom, e.lieu?.ville].filter(Boolean).join(", "),
    places: e.places,
    complet: e.complet === true,
    accroche: L(e.accroche, locale),
    image: toImg(e.image, locale, 1200),
  };
}

// ---------------------------------------------------------------------------
// Page fixe (Autres pages) : texte complet
// ---------------------------------------------------------------------------
export async function getPageContent(cle: string, locale: Locale) {
  const p = await sanityFetch<{
    surTitre?: Localized;
    titre?: Localized;
    intro?: Localized;
    image?: SanityImg;
    contenu?: LocalizedBlocks;
    faq?: { question?: Localized; reponse?: Localized }[];
    collaborationCommerciale?: boolean;
    seo?: SeoRaw;
  } | null>({
    query: `*[_type == "page" && cle == $cle][0]{surTitre, titre, intro, image ${IMG}, contenu, faq, collaborationCommerciale, seo}`,
    params: { cle },
    tags: ["page"],
  });
  return {
    surTitre: L(p?.surTitre, locale),
    titre: L(p?.titre, locale),
    intro: L(p?.intro, locale),
    image: toImg(p?.image, locale),
    contenu: localize(p?.contenu, locale),
    faq: faqOf(p?.faq, locale),
    collaborationCommerciale: p?.collaborationCommerciale === true,
    seo: seoOf(p?.seo, locale),
  };
}

// ---------------------------------------------------------------------------
// Le Mag : articles et rubriques
// ---------------------------------------------------------------------------

/** Rubriques prêtes à l'emploi (renommables en créant une rubrique du même code dans Sanity). */
export const RUBRIQUES_PAR_DEFAUT = ["tout-savoir", "accords", "portraits"] as const;
/** Rubriques qui ont leur propre page (adresses historiques). */
export const PAGES_RUBRIQUE = {
  "tout-savoir": "/tout-savoir-sur-le-champagne",
  accords: "/recettes-accords-mets-champagne",
} as const;
/** Anciennes rubriques de WordPress -> codes du Mag. */
const RUBRIQUE_ANCIENNE: Record<string, string> = { comprendre: "tout-savoir", recettes: "accords" };

export type Rubrique = { cle: string; titre?: string; description?: string };

export async function getRubriquesSanity(locale: Locale): Promise<Rubrique[]> {
  const list = await sanityFetch<{ cle?: string; titre?: Localized; description?: Localized }[]>({
    query: `*[_type == "rubrique" && defined(cle.current)] | order(coalesce(ordre, 10) asc){"cle": cle.current, titre, description}`,
    tags: ["rubrique"],
  });
  return (list ?? []).flatMap((r) => (r.cle ? [{ cle: r.cle, titre: L(r.titre, locale), description: L(r.description, locale) }] : []));
}

const ARTICLE_CARD = `"slug": slug.current, titre, date, extrait, image ${IMG}, collaborationCommerciale,
  rubrique, rubriques, "autresRubriques": autresRubriques[]->cle.current, "vignerons": vignerons[]->slug.current`;
type ArticleRaw = {
  slug: string;
  titre?: Localized;
  date?: string;
  extrait?: Localized;
  image?: SanityImg;
  collaborationCommerciale?: boolean;
  rubrique?: string;
  rubriques?: string[];
  autresRubriques?: (string | null)[];
  vignerons?: (string | null)[];
};
export type ArticleCard = {
  slug: string;
  titre: string;
  date?: string;
  extrait?: string;
  image: Img | null;
  rubriques: string[];
  vignerons: string[];
  collaborationCommerciale: boolean;
};
const articleCardOf = (a: ArticleRaw, locale: Locale): ArticleCard | null => {
  const titre = L(a.titre, locale);
  if (!titre || !a.slug) return null;
  const rubriques = [
    ...(a.rubriques ?? []),
    ...(a.autresRubriques ?? []).filter((r): r is string => !!r),
    ...(a.rubrique && !a.rubriques?.length ? [RUBRIQUE_ANCIENNE[a.rubrique] ?? a.rubrique] : []),
  ];
  return {
    slug: a.slug,
    titre,
    date: a.date,
    extrait: L(a.extrait, locale),
    image: toImg(a.image, locale, 1200),
    rubriques: [...new Set(rubriques)],
    vignerons: (a.vignerons ?? []).filter((v): v is string => !!v),
    collaborationCommerciale: a.collaborationCommerciale === true,
  };
};

/** Tous les articles publiés, du plus récent au plus ancien. */
export async function getArticles(locale: Locale): Promise<ArticleCard[]> {
  const list = await sanityFetch<ArticleRaw[]>({
    query: `*[_type == "article" && defined(slug.current)] | order(coalesce(date, _createdAt) desc){${ARTICLE_CARD}}`,
    tags: ["article", "rubrique", "vigneron"],
  });
  return (list ?? []).map((a) => articleCardOf(a, locale)).filter((a): a is ArticleCard => !!a);
}

export type ArticleDetail = ArticleCard & { contenu?: PortableTextBlock[]; seo: Seo; updatedAt?: string };

export async function getArticle(slug: string, locale: Locale): Promise<ArticleDetail | null> {
  const a = await sanityFetch<(ArticleRaw & { contenu?: LocalizedBlocks; seo?: SeoRaw; _updatedAt?: string }) | null>({
    query: `*[_type == "article" && slug.current == $slug][0]{${ARTICLE_CARD}, contenu, seo, _updatedAt}`,
    params: { slug },
    tags: ["article", "rubrique", "vigneron"],
  });
  const card = a ? articleCardOf(a, locale) : null;
  if (!a || !card) return null;
  return { ...card, contenu: localize(a.contenu, locale), seo: seoOf(a.seo, locale), updatedAt: a._updatedAt };
}

export async function getArticleSlugs(): Promise<string[]> {
  return (await sanityFetch<string[]>({ query: `*[_type == "article" && defined(slug.current)].slug.current`, tags: ["article"] })) ?? [];
}

// ---------------------------------------------------------------------------
// Entreprises & CSE
// ---------------------------------------------------------------------------
export async function getEspaceEntreprises(locale: Locale) {
  const p = await sanityFetch<{
    hero?: HeroRaw;
    coffrets?: BlocRaw;
    animations?: BlocRaw;
    devisTitre?: Localized;
    devisTexte?: Localized;
    brochureTitre?: Localized;
    brochureTexte?: Localized;
    faq?: { question?: Localized; reponse?: Localized }[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "espaceEntreprises"][0]{hero{surTitre, titre, intro, image ${IMG}},
      coffrets{icone, surTitre, titre, texte, points, image ${IMG}}, animations{icone, surTitre, titre, texte, points, image ${IMG}},
      devisTitre, devisTexte, brochureTitre, brochureTexte, faq, seo}`,
    tags: ["espaceEntreprises"],
  });
  return {
    hero: heroOf(p?.hero, locale),
    coffrets: blocOf(p?.coffrets, locale),
    animations: blocOf(p?.animations, locale),
    devisTitre: L(p?.devisTitre, locale),
    devisTexte: L(p?.devisTexte, locale),
    brochureTitre: L(p?.brochureTitre, locale),
    brochureTexte: L(p?.brochureTexte, locale),
    faq: faqOf(p?.faq, locale),
    seo: seoOf(p?.seo, locale),
  };
}

// ---------------------------------------------------------------------------
// Nos Dégustations (espace Particuliers) : expériences et rendez-vous
// ---------------------------------------------------------------------------
export async function getEspaceParticuliers(locale: Locale) {
  const p = await sanityFetch<{
    hero?: HeroRaw;
    chiffres?: { valeur?: Localized | string; label?: Localized }[];
    experiencesTitre?: Localized;
    experiencesIntro?: Localized;
    evenementsTitre?: Localized;
    evenementsPrives?: BlocRaw;
    faq?: { question?: Localized; reponse?: Localized }[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "espaceParticuliers"][0]{hero{surTitre, titre, intro, image ${IMG}}, chiffres, experiencesTitre, experiencesIntro,
      evenementsTitre, evenementsPrives{icone, surTitre, titre, texte, points, image ${IMG}}, faq, seo}`,
    tags: ["espaceParticuliers"],
  });
  return {
    hero: heroOf(p?.hero, locale),
    chiffres: (p?.chiffres ?? []).flatMap((c) => {
      const label = L(c.label, locale);
      const valeur = typeof c.valeur === "string" ? c.valeur : L(c.valeur, locale);
      return valeur && label ? [{ valeur, label }] : [];
    }),
    experiencesTitre: L(p?.experiencesTitre, locale),
    experiencesIntro: L(p?.experiencesIntro, locale),
    evenementsTitre: L(p?.evenementsTitre, locale),
    evenementsPrives: blocOf(p?.evenementsPrives, locale),
    faq: faqOf(p?.faq, locale),
    seo: seoOf(p?.seo, locale),
  };
}

const EXPERIENCE_CARD = `"slug": slug.current, titre, etiquette, image ${IMG}, accroche, duree, participantsMin, participantsMax, lieu,
  prixAPartirDe, animateur{nom, role, photo ${IMG}}`;
type ExperienceRaw = {
  slug: string;
  titre?: Localized;
  etiquette?: "nouveau" | "places-limitees" | "sur-mesure";
  image?: SanityImg;
  accroche?: Localized;
  duree?: Localized;
  participantsMin?: number;
  participantsMax?: number;
  lieu?: Localized;
  prixAPartirDe?: number | null;
  animateur?: { nom?: string; role?: Localized; photo?: SanityImg };
};
export type Experience = {
  slug: string;
  titre: string;
  etiquette?: "nouveau" | "places-limitees" | "sur-mesure";
  image: Img | null;
  accroche?: string;
  duree?: string;
  participantsMin?: number;
  participantsMax?: number;
  lieu?: string;
  prixAPartirDe?: number | null;
  animateur?: { nom?: string; role?: string; photo: Img | null };
};
const experienceOf = (e: ExperienceRaw, locale: Locale): Experience | null => {
  const titre = L(e.titre, locale);
  if (!titre || !e.slug) return null;
  return {
    slug: e.slug,
    titre,
    etiquette: e.etiquette,
    image: toImg(e.image, locale, 1000),
    accroche: L(e.accroche, locale),
    duree: L(e.duree, locale),
    participantsMin: e.participantsMin,
    participantsMax: e.participantsMax,
    lieu: L(e.lieu, locale),
    prixAPartirDe: e.prixAPartirDe ?? null,
    animateur: e.animateur?.nom ? { nom: e.animateur.nom, role: L(e.animateur.role, locale), photo: toImg(e.animateur.photo, locale, 200) } : undefined,
  };
};

/** Expériences visibles (case « Afficher cette expérience »), dans l'ordre choisi. */
export async function getExperiences(locale: Locale): Promise<Experience[]> {
  const list = await sanityFetch<ExperienceRaw[]>({
    query: `*[_type == "experience" && actif != false && defined(slug.current)] | order(coalesce(ordre, 10) asc){${EXPERIENCE_CARD}}`,
    tags: ["experience"],
  });
  return (list ?? []).map((e) => experienceOf(e, locale)).filter((e): e is Experience => !!e);
}

export type ExperienceDetail = Experience & {
  description?: PortableTextBlock[];
  inclus: string[];
  adresse?: { nom?: string; adresse?: string; codePostal?: string; ville?: string; lienCarte?: string };
  vignerons: string[];
  galerie: Img[];
  seo: Seo;
};

export async function getExperience(slug: string, locale: Locale): Promise<ExperienceDetail | null> {
  const e = await sanityFetch<
    | (ExperienceRaw & {
        description?: LocalizedBlocks;
        inclus?: Localized[];
        adresse?: ExperienceDetail["adresse"];
        vignerons?: (string | null)[];
        galerie?: SanityImg[];
        seo?: SeoRaw;
      })
    | null
  >({
    query: `*[_type == "experience" && actif != false && slug.current == $slug][0]{${EXPERIENCE_CARD}, description, inclus, adresse,
      "vignerons": vignerons[]->slug.current, galerie[] ${IMG}, seo}`,
    params: { slug },
    tags: ["experience", "vigneron"],
  });
  const card = e ? experienceOf(e, locale) : null;
  if (!e || !card) return null;
  return {
    ...card,
    description: localize(e.description, locale),
    inclus: (e.inclus ?? []).map((i) => L(i, locale)).filter((i): i is string => !!i),
    adresse: e.adresse,
    vignerons: (e.vignerons ?? []).filter((v): v is string => !!v),
    galerie: (e.galerie ?? []).map((g) => toImg(g, locale, 1200)).filter((g): g is Img => !!g),
    seo: seoOf(e.seo, locale),
  };
}

export async function getExperienceSlugs(): Promise<string[]> {
  return (await sanityFetch<string[]>({ query: `*[_type == "experience" && actif != false && defined(slug.current)].slug.current`, tags: ["experience"] })) ?? [];
}

export type Evenement = {
  slug?: string;
  titre: string;
  debut: string;
  fin?: string;
  lieu: string;
  lienCarte?: string;
  places?: number;
  complet: boolean;
  prix?: number;
  prixPrecision?: string;
  accroche?: string;
  description?: PortableTextBlock[];
  image: Img | null;
  collaborationCommerciale: boolean;
};

/** Événements ponctuels à venir (un événement passé disparaît de lui-même). */
export async function getEvenementsAVenir(locale: Locale): Promise<Evenement[]> {
  const list = await sanityFetch<
    {
      titre?: Localized;
      slug?: string;
      debut?: string;
      fin?: string;
      lieu?: { nom?: string; adresse?: string; ville?: string; lienCarte?: string };
      places?: number;
      complet?: boolean;
      prix?: number;
      prixPrecision?: Localized;
      accroche?: Localized;
      description?: LocalizedBlocks;
      image?: SanityImg;
      collaborationCommerciale?: boolean;
    }[]
  >({
    query: `*[_type == "evenement" && dateTime(debut) > dateTime(now())] | order(debut asc){titre, "slug": slug.current, debut, fin, lieu, places,
      complet, prix, prixPrecision, accroche, description, image ${IMG}, collaborationCommerciale}`,
    tags: ["evenement"],
    life: "hours",
  });
  return (list ?? []).flatMap((e) => {
    const titre = L(e.titre, locale);
    if (!titre || !e.debut) return [];
    return [
      {
        slug: e.slug,
        titre,
        debut: e.debut,
        fin: e.fin,
        lieu: [e.lieu?.nom, e.lieu?.adresse, e.lieu?.ville].filter(Boolean).join(", "),
        lienCarte: e.lieu?.lienCarte,
        places: e.places,
        complet: e.complet === true,
        prix: e.prix,
        prixPrecision: L(e.prixPrecision, locale),
        accroche: L(e.accroche, locale),
        description: localize(e.description, locale),
        image: toImg(e.image, locale, 1200),
        collaborationCommerciale: e.collaborationCommerciale === true,
      },
    ];
  });
}

// ---------------------------------------------------------------------------
// Terroirs : fiche publiée dans Sanity, sinon textes rédigés dans le dépôt
// ---------------------------------------------------------------------------
export type TerroirPage = {
  cle: TerroirKey;
  nom: string;
  accroche?: string;
  intro?: string;
  image: Img | null;
  reperes: { label: string; valeur: string }[];
  villages: string[];
  contenu?: PortableTextBlock[];
  sols?: string;
  cepagesDominants: CepageKey[];
  secteurs: { titre: string; texte?: PortableTextBlock[]; texteSimple?: string }[];
  galerie: Img[];
  seo: Seo;
};

export async function getTerroir(cle: TerroirKey, locale: Locale): Promise<TerroirPage> {
  const t = await sanityFetch<{
    nom?: string;
    accroche?: Localized;
    intro?: Localized;
    image?: SanityImg;
    chiffres?: { label?: Localized; valeur?: Localized }[];
    villages?: string[];
    contenu?: LocalizedBlocks;
    sols?: Localized;
    cepagesDominants?: CepageKey[];
    secteurs?: BlocRaw[];
    galerie?: SanityImg[];
    seo?: SeoRaw;
  } | null>({
    query: `*[_type == "terroir" && cle == $cle][0]{nom, accroche, intro, image ${IMG}, chiffres, villages, contenu, sols, cepagesDominants,
      secteurs[]{icone, surTitre, titre, texte, points, image ${IMG}}, galerie[] ${IMG}, seo}`,
    params: { cle },
    tags: ["terroir"],
  });
  const { terroirsContenu, tr, sectionsEnBlocs } = await import("@/lib/terroirs-contenu");
  const d = terroirsContenu[cle];
  const contenuSanity = localize(t?.contenu, locale);
  // Fiche publiée et remplie : elle l'emporte ; sinon, textes du dépôt (image Sanity gardée si présente).
  if (t && L(t.accroche, locale) && contenuSanity?.length) {
    return {
      cle,
      nom: t.nom ?? d.nom,
      accroche: L(t.accroche, locale),
      intro: L(t.intro, locale),
      image: toImg(t.image, locale),
      reperes: (t.chiffres ?? []).flatMap((c) => {
        const label = L(c.label, locale);
        const valeur = L(c.valeur, locale);
        return label && valeur ? [{ label, valeur }] : [];
      }),
      villages: t.villages ?? [],
      contenu: contenuSanity,
      sols: L(t.sols, locale),
      cepagesDominants: t.cepagesDominants ?? [],
      secteurs: (t.secteurs ?? []).map((s) => blocOf(s, locale)).filter((s) => s.titre).map((s) => ({ titre: s.titre!, texte: s.texte })),
      galerie: (t.galerie ?? []).map((g) => toImg(g, locale, 1200)).filter((g): g is Img => !!g),
      seo: seoOf(t.seo, locale),
    };
  }
  return {
    cle,
    nom: d.nom,
    accroche: tr(d.accroche, locale),
    intro: tr(d.intro, locale),
    image: toImg(t?.image, locale),
    reperes: d.reperes.map((r) => ({ label: tr(r.label, locale), valeur: tr(r.valeur, locale) })),
    villages: d.villages,
    contenu: sectionsEnBlocs(d.sections, locale),
    sols: d.sols ? tr(d.sols, locale) : undefined,
    cepagesDominants: d.cepagesDominants,
    secteurs: (d.secteurs ?? []).map((s) => ({ titre: tr(s.titre, locale), texteSimple: tr(s.texte, locale) })),
    galerie: [],
    seo: { title: tr(d.seo.title, locale), description: tr(d.seo.description, locale) },
  };
}

export type TerroirAubePage = {
  hero: Hero;
  chapitres: { titre: string; texte?: PortableTextBlock[]; image: Img | null }[];
  cepagesTitre: string;
  cepagesIntro?: PortableTextBlock[];
  cepagesTextes: { cepage: CepageKey; texte: string }[];
  faq: { question: string; reponse: string }[];
  seo: Seo;
};

export async function getTerroirAube(locale: Locale): Promise<TerroirAubePage> {
  const p = await sanityFetch<{
    hero?: HeroRaw;
    chapitres?: BlocRaw[];
    cepagesTitre?: Localized;
    cepagesIntro?: LocalizedBlocks;
    cepagesTextes?: { cepage?: CepageKey; texte?: Localized }[];
    faq?: { question?: Localized; reponse?: Localized }[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "terroirAube"][0]{hero{surTitre, titre, intro, image ${IMG}}, chapitres[]{icone, surTitre, titre, texte, points, image ${IMG}},
      cepagesTitre, cepagesIntro, cepagesTextes, faq, seo}`,
    tags: ["terroirAube"],
  });
  const { aubeContenu: a, tr, paragrapheEnBloc } = await import("@/lib/terroirs-contenu");
  const hero = heroOf(p?.hero, locale);
  const chapitresSanity = (p?.chapitres ?? []).map((b) => blocOf(b, locale)).filter((b) => b.titre && b.texte?.length);
  const faq = faqOf(p?.faq, locale);
  const textes = (p?.cepagesTextes ?? []).flatMap((c) => {
    const texte = L(c.texte, locale);
    return c.cepage && texte ? [{ cepage: c.cepage, texte }] : [];
  });
  return {
    hero: {
      surTitre: hero.surTitre ?? tr(a.hero.surTitre, locale),
      titre: hero.titre ?? tr(a.hero.titre, locale),
      intro: hero.intro ?? tr(a.hero.intro, locale),
      image: hero.image,
    },
    chapitres: chapitresSanity.length
      ? chapitresSanity.map((c) => ({ titre: c.titre!, texte: c.texte, image: c.image }))
      : a.chapitres.map((c, i) => ({
          titre: tr(c.titre, locale),
          texte: [paragrapheEnBloc(tr(c.texte, locale).replace(/ ?\[VOTRE ANECDOTE\].*$/, ""), locale)].concat(
            tr(c.texte, locale).includes("[VOTRE ANECDOTE]")
              ? [paragrapheEnBloc(tr(c.texte, locale).slice(tr(c.texte, locale).indexOf("[VOTRE ANECDOTE]")), locale)]
              : [],
          ),
          image: (p?.chapitres?.[i] && toImg(p.chapitres[i].image, locale)) || null,
        })),
    cepagesTitre: L(p?.cepagesTitre, locale) ?? tr(a.cepagesTitre, locale),
    cepagesIntro: localize(p?.cepagesIntro, locale)?.length ? localize(p?.cepagesIntro, locale) : [paragrapheEnBloc(tr(a.cepagesIntro, locale), locale)],
    cepagesTextes: textes.length ? textes : a.cepagesTextes.map((c) => ({ cepage: c.cepage, texte: tr(c.texte, locale) })),
    faq: faq.length ? faq : a.faq.map((q) => ({ question: tr(q.question, locale), reponse: tr(q.reponse, locale) })),
    seo: { ...seoOf(p?.seo, locale), title: L(p?.seo?.title, locale) ?? tr(a.seo.title, locale), description: L(p?.seo?.description, locale) ?? tr(a.seo.description, locale) },
  };
}
