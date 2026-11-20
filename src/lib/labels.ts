// Tableau comparatif des labels environnementaux (article « Champagne : labels et certifications »).
// Sources et points vérifiés : docs/labels-sources.md. Logos officiels dans public/labels/.
// Colonne « Label » : le logo officiel ; `logos` vide = logo pas encore fourni (sigle affiché à la place).
import type { Locale } from "@/i18n/routing";

type T = { fr: string; en: string };
export type LabelLigne = {
  cle: string;
  /** Colonne « La démarche » : le nom complet de la démarche. */
  nom: T;
  sigle: string;
  logos: { src: string; nom: string; largeur: number; hauteur: number }[];
  site: string;
  pesticides: T;
  promesse: T;
  /** Indice nature, sur 5. */
  indice: number;
};

export const LABELS: LabelLigne[] = [
  {
    cle: "hve",
    sigle: "HVE",
    nom: { fr: "Haute Valeur Environnementale (niveau 3)", en: "High Environmental Value (level 3)" },
    logos: [{ src: "/labels/logo-hve-haute-valeur-environnementale.svg", nom: "HVE", largeur: 64, hauteur: 64 }],
    site: "https://hve-asso.com/la-hve/",
    pesticides: { fr: "Limités et contrôlés", en: "Limited and monitored" },
    promesse: {
      fr: "Protège la biodiversité locale (haies, insectes). Depuis 2023, les produits classés CMR 1 (les plus dangereux) sont interdits.",
      en: "Protects local biodiversity (hedges, insects). Since 2023, products classed as CMR 1 (the most hazardous) are banned.",
    },
    indice: 3,
  },
  {
    cle: "vdc",
    sigle: "VDC",
    nom: { fr: "VDC (Viticulture Durable en Champagne)", en: "VDC (Sustainable Viticulture in Champagne)" },
    logos: [],
    site: "https://www.champagne.fr/fr/les-engagements-dans-le-champagne",
    pesticides: { fr: "Limités et contrôlés", en: "Limited and monitored" },
    promesse: {
      fr: "Créé par et pour la Champagne. Préserve les paysages, gère l'eau et réduit l'empreinte carbone.",
      en: "Created by and for Champagne. Preserves the landscape, manages water and reduces the carbon footprint.",
    },
    indice: 3,
  },
  {
    cle: "terra-vitis",
    sigle: "Terra Vitis",
    nom: { fr: "Terra Vitis", en: "Terra Vitis" },
    logos: [{ src: "/labels/logo-terra-vitis.png", nom: "Terra Vitis", largeur: 49, hauteur: 64 }],
    site: "https://terravitis.com/",
    pesticides: { fr: "En dernier recours", en: "As a last resort" },
    promesse: {
      fr: "Les produits de synthèse ne sont utilisés que si la récolte est menacée. Traçabilité totale des interventions.",
      en: "Synthetic products are used only when the harvest is at risk. Every intervention is fully traceable.",
    },
    indice: 3,
  },
  {
    cle: "bio",
    sigle: "AB",
    nom: { fr: "Agriculture biologique", en: "Organic farming" },
    logos: [{ src: "/labels/logo-eurofeuille-bio-union-europeenne.svg", nom: "Eurofeuille (bio, Union européenne)", largeur: 96, hauteur: 64 }],
    site: "https://www.agencebio.org/",
    pesticides: { fr: "Interdits", en: "Banned" },
    promesse: {
      fr: "Aucun produit chimique de synthèse : la vigne est protégée uniquement avec des produits d'origine naturelle (dont le cuivre et le soufre, en quantités limitées).",
      en: "No synthetic chemicals: the vines are protected only with products of natural origin (including copper and sulphur, in limited amounts).",
    },
    indice: 4,
  },
  {
    cle: "biodynamie",
    sigle: "Demeter · Biodyvin",
    nom: { fr: "Agriculture biodynamique (Demeter, Biodyvin)", en: "Biodynamic farming (Demeter, Biodyvin)" },
    logos: [
      { src: "/labels/logo-demeter.png", nom: "Demeter", largeur: 86, hauteur: 40 },
      { src: "/labels/logo-biodyvin.png", nom: "Biodyvin", largeur: 65, hauteur: 40 },
    ],
    site: "https://www.demeter.fr/",
    pesticides: { fr: "Interdits", en: "Banned" },
    promesse: {
      fr: "Va plus loin que le bio : préparations biodynamiques et soins naturels, travail souvent guidé par le calendrier lunaire.",
      en: "Goes further than organic: biodynamic preparations and natural treatments, work often guided by the lunar calendar.",
    },
    indice: 5,
  },
];

export const ENTETES: Record<"label" | "demarche" | "pesticides" | "promesse" | "indice" | "indiceSr" | "logo" | "legende", T> = {
  label: { fr: "Label", en: "Label" },
  demarche: { fr: "La démarche", en: "The approach" },
  pesticides: { fr: "Pesticides de synthèse", en: "Synthetic pesticides" },
  promesse: { fr: "La promesse", en: "The promise" },
  indice: { fr: "Indice nature", en: "Nature index" },
  indiceSr: { fr: "Indice nature : # sur 5", en: "Nature index: # out of 5" },
  logo: { fr: "Logo du label #", en: "Logo of the # label" },
  legende: { fr: "Comparatif des labels environnementaux du vin", en: "Comparison of environmental wine labels" },
};

export const tl = (v: T, locale: Locale) => (locale === "fr" ? v.fr : v.en);
