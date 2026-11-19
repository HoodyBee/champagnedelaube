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
    chiffres?: { valeur?: string; label?: Localized }[];
    entreePro?: EntreeRaw;
    entreeEntreprises?: EntreeRaw;
    entreeParticuliers?: EntreeRaw;
    terroir?: BlocRaw;
    vigneronsTitre?: Localized;
    vigneronsIntro?: Localized;
    vigneronsSelection?: VigneronRaw[];
    reassurance?: ArgumentRaw[];
    seo?: SeoRaw;
  }>({
    query: `*[_id == "accueil"][0]{
      hero{surTitre, titre, intro, image ${IMG}}, chiffres,
      entreePro{surTitre, titre, texte, bouton, image ${IMG}},
      entreeEntreprises{surTitre, titre, texte, bouton, image ${IMG}},
      entreeParticuliers{surTitre, titre, texte, bouton, image ${IMG}},
      terroir{icone, surTitre, titre, texte, points, image ${IMG}},
      vigneronsTitre, vigneronsIntro, vigneronsSelection[]->{${VIGNERON_CARD}},
      reassurance, seo}`,
    tags: ["accueil", "vigneron"],
  });
  return {
    hero: heroOf(a?.hero, locale),
    chiffres: (a?.chiffres ?? []).flatMap((c) => {
      const label = L(c.label, locale);
      return c.valeur && label ? [{ valeur: c.valeur, label }] : [];
    }),
    entrees: {
      pro: entreeOf(a?.entreePro, locale),
      entreprises: entreeOf(a?.entreeEntreprises, locale),
      particuliers: entreeOf(a?.entreeParticuliers, locale),
    },
    terroir: blocOf(a?.terroir, locale),
    vigneronsTitre: L(a?.vigneronsTitre, locale),
    vigneronsIntro: L(a?.vigneronsIntro, locale),
    vigneronsSelection: (a?.vigneronsSelection ?? []).filter((v) => v?.slug).map((v) => cardOf(v, locale)),
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
