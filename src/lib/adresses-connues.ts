// Adresses inconnues -> vraie page 404, AVANT l'affichage de la page.
//
// Pourquoi : avec les Cache Components de Next.js, une page dont l'adresse contient une partie
// variable (article, vigneron, cépage, rubrique, thème, format de dégustation) commence à
// s'afficher avant de savoir si le contenu existe. Une adresse inconnue y reçoit bien la page
// « introuvable » (avec « noindex »), mais avec le code 200 au lieu de 404. La documentation de
// Next.js recommande de vérifier l'adresse dans le proxy : c'est ce que fait ce fichier.
//
// Prudence : en cas de doute (Sanity injoignable, liste vide…), on laisse passer. La page
// décide alors elle-même, comme avant. Ce fichier ne fait que transformer en vrai 404 les
// adresses dont on est SÛR qu'elles n'existent pas.
import { routing, type Locale } from "@/i18n/routing";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { cepages, type CepageKey } from "./brand";
import { CEPAGES_MASQUES } from "./cepages-contenu";
import { fichesParDefaut } from "./fallback-vignerons";
import { RUBRIQUES_PAR_DEFAUT } from "./rubriques";
import { formatsDegustationActifs } from "./site";
import { THEMES_MAG } from "./themes-mag";

type Sorte = "article" | "vigneron" | "cepage" | "rubrique" | "theme" | "degustation";

/** Les pages à partie variable, avec ce qui permet de vérifier que le contenu existe. */
const MODELES: [keyof typeof routing.pathnames, Sorte][] = [
  ["/[article]", "article"],
  ["/vignerons/[slug]", "vigneron"],
  ["/cepages-champagne/[cepage]", "cepage"],
  ["/le-mag/[rubrique]", "rubrique"],
  ["/le-mag/theme/[theme]", "theme"],
  ["/tasting-troyes/[slug]", "degustation"],
];

const traduire = (cle: keyof typeof routing.pathnames, locale: Locale): string => {
  const p = routing.pathnames[cle] as string | Record<Locale, string>;
  return typeof p === "string" ? p : p[locale];
};
const sansSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const echapper = (s: string) => s.replace(/[.*+?^${}()|\\]/g, "\\$&");

/** Pour chaque langue : les adresses fixes du site et les modèles à partie variable. */
const parLangue = Object.fromEntries(
  routing.locales.map((locale) => {
    const fixes = new Set(
      (Object.keys(routing.pathnames) as (keyof typeof routing.pathnames)[])
        .map((cle) => traduire(cle, locale))
        .filter((p) => !p.includes("["))
        .map(sansSlash),
    );
    const modeles = MODELES.map(([cle, sorte]) => ({
      sorte,
      re: new RegExp(`^${echapper(sansSlash(traduire(cle, locale))).replace(/\[[^\]]+\]/g, "([^/]+)")}$`),
    }));
    return [locale, { fixes, modeles }];
  }),
) as Record<Locale, { fixes: Set<string>; modeles: { sorte: Sorte; re: RegExp }[] }>;

// ---------------------------------------------------------------------------
// Contenus publiés dans Sanity (articles, vignerons, rubriques), gardés 1 minute en mémoire.
// ---------------------------------------------------------------------------
type Publies = { articles: string[]; vignerons: string[]; rubriques: string[] };
const REQUETE = `{
  "articles": *[_type == "article" && defined(slug.current)].slug.current,
  "vignerons": *[_type == "vigneron" && defined(slug.current)].slug.current,
  "rubriques": *[_type == "rubrique" && defined(cle.current)].cle.current
}`;
const DUREE = 60_000;
let memoire: { jusqua: number; donnees: Promise<Publies | null> } | null = null;

async function charger(): Promise<Publies | null> {
  if (!isSanityConfigured) return null;
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(REQUETE)}&perspective=published`;
    const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return null;
    const { result } = (await r.json()) as { result?: Partial<Publies> };
    if (!result || !Array.isArray(result.articles) || !Array.isArray(result.vignerons) || !Array.isArray(result.rubriques)) return null;
    return result as Publies;
  } catch {
    return null;
  }
}

function publies() {
  if (!memoire || Date.now() > memoire.jusqua) {
    const donnees = charger();
    memoire = { jusqua: Date.now() + DUREE, donnees };
    // Échec : on réessaie au bout de 10 secondes plutôt qu'une minute.
    void donnees.then((d) => {
      if (!d && memoire?.donnees === donnees) memoire.jusqua = Date.now() + 10_000;
    });
  }
  return memoire.donnees;
}

/** Le contenu existe-t-il ? `undefined` : on ne sait pas, la page décidera. */
async function existe(sorte: Sorte, slug: string): Promise<boolean | undefined> {
  switch (sorte) {
    case "cepage":
      return slug in cepages && !CEPAGES_MASQUES.includes(slug as CepageKey);
    case "theme":
      return (THEMES_MAG as readonly string[]).includes(slug);
    case "degustation":
      // Formats de dégustation masqués : toutes ces pages sont introuvables.
      return formatsDegustationActifs ? undefined : false;
    case "rubrique": {
      if ((RUBRIQUES_PAR_DEFAUT as readonly string[]).includes(slug)) return true;
      const d = await publies();
      return d ? d.rubriques.includes(slug) : undefined;
    }
    case "vigneron": {
      const d = await publies();
      if (!d) return undefined;
      // Aucune fiche publiée : le site affiche les fiches par défaut (comme getVigneron).
      return d.vignerons.length ? d.vignerons.includes(slug) : fichesParDefaut.some((f) => f.slug === slug);
    }
    case "article": {
      const d = await publies();
      return d ? d.articles.includes(slug) : undefined;
    }
  }
}

/**
 * Renvoie la langue de la page si l'adresse est SÛREMENT introuvable, sinon `null`.
 * Toutes les pages du site figurent dans routing.pathnames (src/i18n/routing.ts) : une adresse qui
 * ne correspond à aucune d'elles n'existe pas.
 * `pathname` : l'adresse demandée (« /xyz/ », « /en/winemakers/abc/ »…).
 */
export async function adresseIntrouvable(pathname: string): Promise<Locale | null> {
  let segments: string[];
  try {
    segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
  // Langue : préfixe /en/, /nl/… ; sans préfixe, le français. « /fr/… » est redirigé par next-intl.
  const premier = segments[0];
  if (premier === routing.defaultLocale) return null;
  const locale: Locale = (routing.locales as readonly string[]).includes(premier) ? (segments.shift() as Locale) : routing.defaultLocale;
  const chemin = "/" + segments.join("/");
  const { fixes, modeles } = parLangue[locale];
  if (fixes.has(chemin)) return null;
  for (const { sorte, re } of modeles) {
    const m = re.exec(chemin);
    if (m) return (await existe(sorte, m[1])) === false ? locale : null;
  }
  // Aucune page du site n'a cette forme d'adresse (ex. /en/a/b/) : introuvable, dans la bonne langue.
  return locale;
}
