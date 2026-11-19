// Registre des fichiers de marque (logos, pictos, terroirs, cépages).
//
// Tous les composants du site passent par ce fichier pour afficher un logo ou un
// picto. Pour remplacer une vignette PNG par sa future version SVG :
//   1. déposez le fichier dans le même dossier de public/brand/ (ex. pictos/bio.svg) ;
//   2. changez l'extension ci-dessous (bio.png -> bio.svg) et, si le SVG n'a plus
//      de fond ni de texte, passez `format` de "vignette" à "picto".
// Rien d'autre à modifier dans le code.

/** "vignette" = carré 1080 px avec fond de couleur et nom intégrés (fichiers actuels).
 *  "picto" = pictogramme seul, sans fond ni texte (futures versions SVG). */
export type AssetFormat = "vignette" | "picto";

export type BrandAsset = {
  src: string;
  /** Nom affiché et texte alternatif. */
  label: string;
  /** Nom du token de couleur (tokens.json) associé. */
  color: string;
  width: number;
  height: number;
  format: AssetFormat;
};

const vignette = (
  src: string,
  label: string,
  color: string,
): BrandAsset => ({ src, label, color, width: 1080, height: 1080, format: "vignette" });

// ---------------------------------------------------------------------------
// Logos — ne jamais les modifier, recolorer ni déformer (voir BRAND_BOOK.md §1).
// ---------------------------------------------------------------------------
export const logos = {
  /** Logo principal : empilé, bandeau doré. Minimum 240 px de large à l'écran. */
  principal: {
    src: "/brand/logos/logo-empile-carre-bandeau.png",
    alt: "Champagne de l'Aube",
    width: 3000,
    height: 3000,
    minWidth: 240,
  },
  /** Version une couleur, quand le doré est impossible. */
  noir: {
    src: "/brand/logos/logo-empile-carre-noir.png",
    alt: "Champagne de l'Aube",
    width: 3000,
    height: 3000,
    minWidth: 240,
  },
  /** Version ronde (badges, stickers). */
  rondBandeau: {
    src: "/brand/logos/logo-empile-rond-bandeau.png",
    alt: "Champagne de l'Aube",
    width: 3000,
    height: 3000,
    minWidth: 240,
  },
  rondNoir: {
    src: "/brand/logos/logo-empile-rond-noir.png",
    alt: "Champagne de l'Aube",
    width: 3000,
    height: 3000,
    minWidth: 240,
  },
  /**
   * Logo empilé SANS la ligne des terroirs (en-tête). Simple recadrage du fichier
   * officiel, fond rendu transparent, sans aucune retouche du dessin.
   * Minimum 140 px de large ; les terroirs sont alors écrits à part, en entier.
   */
  sansTerroirs: {
    src: "/brand/logos/logo-empile-sans-terroirs.png",
    alt: "Champagne de l'Aube",
    width: 1000,
    height: 952,
    minWidth: 140,
  },
  /** La bouteille seule : favicon, et en-tête une fois réduit au défilement. */
  avatar: {
    src: "/brand/logos/avatar.png",
    alt: "Champagne de l'Aube",
    width: 3000,
    height: 3000,
    minWidth: 40,
  },
} as const;

// ---------------------------------------------------------------------------
// Terroirs — chacun avec sa couleur du brand book.
// ---------------------------------------------------------------------------
export const terroirs = {
  "cote-des-bar": vignette("/brand/terroirs/cote-des-bar.png", "Côte des Bar", "story-cote-des-bar"),
  "les-riceys": vignette("/brand/terroirs/les-riceys.png", "Les Riceys", "story-riceys"),
  montgueux: vignette("/brand/terroirs/montgueux.png", "Montgueux", "story-montgueux"),
  villenauxe: vignette("/brand/terroirs/villenauxe.png", "Villenauxe-la-Grande", "story-villenauxe"),
} as const;

// ---------------------------------------------------------------------------
// Thèmes éditoriaux (rubriques).
// ---------------------------------------------------------------------------
export const themes = {
  degustations: vignette("/brand/themes/degustations.png", "Dégustations", "champagne"),
  "accords-en-cuisine": vignette("/brand/themes/accords-en-cuisine.png", "Accords en cuisine", "story-accords"),
  "art-et-champagne": vignette("/brand/themes/art-et-champagne.png", "Art & Champagne", "story-art"),
  "autres-bulles": vignette("/brand/themes/autres-bulles.png", "Autres bulles auboises", "story-bulles"),
  "les-copains": vignette("/brand/themes/les-copains.png", "Les copains", "story-regions"),
  "autres-regions": vignette("/brand/themes/autres-regions.png", "Autres régions", "story-regions"),
  "vos-partages": vignette("/brand/themes/vos-partages.png", "Vos partages", "anthracite"),
  evenements: vignette("/brand/themes/evenements.png", "Événements", "story-evenements"),
} as const;

// ---------------------------------------------------------------------------
// Pictos thématiques — badges et filtres des fiches vignerons.
// Les clés serviront de valeurs dans le CMS (étape 3) : ne pas les renommer.
// ---------------------------------------------------------------------------
export const pictos = {
  "champagne-de-femmes": vignette("/brand/pictos/champagne-de-femmes.png", "Champagne de femmes", "theme-femmes"),
  bio: vignette("/brand/pictos/bio.png", "Bio", "theme-bio"),
  biodynamie: vignette("/brand/pictos/biodynamie.png", "Biodynamie", "theme-biodynamie"),
  "cepages-rares-et-anciens": vignette("/brand/pictos/cepages-rares-et-anciens.png", "Cépages rares et anciens", "theme-rares"),
  millesimes: vignette("/brand/pictos/millesimes.png", "Millésimes", "theme-millesimes"),
  "coteaux-champenois": vignette("/brand/pictos/coteaux-champenois.png", "Coteaux champenois", "theme-coteaux"),
  "rose-des-riceys": vignette("/brand/pictos/rose-des-riceys.png", "Rosé des Riceys", "theme-rose-riceys"),
} as const;

// ---------------------------------------------------------------------------
// Cépages — regroupés par famille (noirs, blancs, gris et roses).
// ---------------------------------------------------------------------------
export const cepages = {
  "pinot-noir": vignette("/brand/cepages/pinot-noir.png", "Pinot noir", "cepage-noir"),
  meunier: vignette("/brand/cepages/meunier.png", "Meunier", "cepage-noir"),
  chardonnay: vignette("/brand/cepages/chardonnay.png", "Chardonnay", "cepage-blanc"),
  "pinot-blanc": vignette("/brand/cepages/pinot-blanc.png", "Pinot blanc", "cepage-blanc"),
  arbane: vignette("/brand/cepages/arbane.png", "Arbane", "cepage-blanc"),
  "petit-meslier": vignette("/brand/cepages/petit-meslier.png", "Petit Meslier", "cepage-blanc"),
  "pinot-gris": vignette("/brand/cepages/pinot-gris.png", "Pinot gris", "cepage-gris"),
  "chardonnay-rose": vignette("/brand/cepages/chardonnay-rose.png", "Chardonnay rose", "cepage-gris"),
} as const;

export type TerroirKey = keyof typeof terroirs;
export type PictoKey = keyof typeof pictos;
export type CepageKey = keyof typeof cepages;
