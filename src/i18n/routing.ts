import { defineRouting } from "next-intl/routing";

// Langues du site. Le français est la langue par défaut : ses URL n'ont pas de
// préfixe (/vignerons/), les autres langues en ont un (/en/winemakers/, /de/winzer/).
export const locales = ["fr", "en", "nl", "it", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/**
 * Langues actives par défaut : affichées dans les sélecteurs de langue et ouvertes
 * à Google. Le réglage « Langues actives » des Réglages du site (Sanity) l'emporte.
 * Les autres langues gardent leurs pages, leurs URL et leurs traductions, mais elles
 * sont masquées des sélecteurs, en noindex et hors sitemap : on les réactive en
 * cochant la langue dans Sanity.
 */
export const defaultActiveLocales: readonly Locale[] = ["fr", "en"];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  nl: "Nederlands",
  it: "Italiano",
  de: "Deutsch",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // Le site d'origine est en français : on ne redirige pas automatiquement selon
  // la langue du navigateur (meilleur pour le référencement et pour les touristes
  // qui partagent un lien). Le choix se fait avec le sélecteur de langue.
  localeDetection: false,
  // URL traduites. La clé (à gauche) est le dossier dans src/app/[locale]/ et
  // l'URL française historique, conservée pour le référencement.
  // Les noms de lieux ne se traduisent pas.
  pathnames: {
    "/": "/",

    // Le terroir de l'Aube (page centrale, nouvelle)
    "/le-terroir-de-laube": {
      fr: "/le-terroir-de-laube",
      en: "/the-aube-terroir",
      nl: "/het-terroir-van-de-aube",
      it: "/il-terroir-dellaube",
      de: "/das-terroir-der-aube",
    },

    // Terroirs
    "/la-cote-des-bar": "/la-cote-des-bar",
    // Les cépages de l'appellation : page générale et une page par cépage (/cepages-champagne/pinot-noir/)
    "/cepages-champagne": {
      fr: "/cepages-champagne",
      en: "/champagne-grape-varieties",
      nl: "/champagne-druivenrassen",
      it: "/vitigni-champagne",
      de: "/champagner-rebsorten",
    },
    "/cepages-champagne/[cepage]": {
      fr: "/cepages-champagne/[cepage]",
      en: "/champagne-grape-varieties/[cepage]",
      nl: "/champagne-druivenrassen/[cepage]",
      it: "/vitigni-champagne/[cepage]",
      de: "/champagner-rebsorten/[cepage]",
    },
    "/les-riceys": "/les-riceys",
    // Espace Pro : services de communication (Detectezmoi.com) et nos vignerons partenaires
    "/communication-marketing": {
      fr: "/communication-marketing",
      en: "/communication-and-marketing",
      nl: "/communicatie-en-marketing",
      it: "/comunicazione-e-marketing",
      de: "/kommunikation-und-marketing",
    },
    "/nos-partenaires": {
      fr: "/nos-partenaires",
      en: "/our-partners",
      nl: "/onze-partners",
      it: "/i-nostri-partner",
      de: "/unsere-partner",
    },
    "/montgueux": "/montgueux",
    "/villenauxe-la-grande": "/villenauxe-la-grande",

    // Vignerons
    "/vignerons": {
      fr: "/vignerons",
      en: "/winemakers",
      nl: "/wijnmakers",
      it: "/vignaioli",
      de: "/winzer",
    },
    "/vignerons/[slug]": {
      fr: "/vignerons/[slug]",
      en: "/winemakers/[slug]",
      nl: "/wijnmakers/[slug]",
      it: "/vignaioli/[slug]",
      de: "/winzer/[slug]",
    },

    // Espace Particuliers (URL historique, déjà en anglais) et ses expériences
    "/tasting-troyes": "/tasting-troyes",
    "/tasting-troyes/[slug]": "/tasting-troyes/[slug]",

    // Vos Grands Événements (mariage, baptême, commandes groupées).
    // URL courte « champagne-mariage » ; les autres occasions auront leurs pages, reliées entre elles.
    "/champagne-mariage": {
      fr: "/champagne-mariage",
      en: "/wedding-champagne",
      nl: "/champagne-voor-bruiloft",
      it: "/champagne-per-matrimonio",
      de: "/hochzeitschampagner",
    },
    // Le Mag (espace éditorial : tous les articles, par rubrique)
    "/le-mag": "/le-mag",
    // Pages des rubriques sans adresse historique (/le-mag/terroirs-cepages/…)
    "/le-mag/[rubrique]": "/le-mag/[rubrique]",
    // Articles du Mag : à la racine du site, adresses historiques conservées (/mon-article/)
    "/[article]": "/[article]",
    // Où trouver nos pépites ? (cachée tant que l'interrupteur des Réglages est éteint)
    "/ou-trouver-nos-pepites": {
      fr: "/ou-trouver-nos-pepites",
      en: "/where-to-find-our-gems",
      nl: "/waar-vind-je-onze-parels",
      it: "/dove-trovare-le-nostre-perle",
      de: "/wo-sie-unsere-perlen-finden",
    },

    // Espace Pro
    "/champagne-hotel-restaurants-et-cavistes": {
      fr: "/champagne-hotel-restaurants-et-cavistes",
      en: "/champagne-for-hotels-restaurants-and-wine-shops",
      nl: "/champagne-voor-hotels-restaurants-en-wijnhandels",
      it: "/champagne-per-hotel-ristoranti-ed-enoteche",
      de: "/champagner-fuer-hotels-restaurants-und-weinhandlungen",
    },
    "/cse-et-cadeaux-dentreprise": {
      fr: "/cse-et-cadeaux-dentreprise",
      en: "/business-gifts-and-events",
      nl: "/bedrijfsgeschenken-en-evenementen",
      it: "/regali-aziendali-ed-eventi",
      de: "/firmengeschenke-und-firmenevents",
    },
    "/vignerons-de-laube-devenez-partenaire-de-nos-degustations": {
      fr: "/vignerons-de-laube-devenez-partenaire-de-nos-degustations",
      en: "/aube-winemakers-become-a-tasting-partner",
      nl: "/wijnmakers-uit-de-aube-word-partner",
      it: "/vignaioli-dellaube-diventate-partner",
      de: "/winzer-der-aube-werden-sie-partner",
    },

    // Contenus
    "/recettes-accords-mets-champagne": {
      fr: "/recettes-accords-mets-champagne",
      en: "/champagne-food-pairing-recipes",
      nl: "/recepten-champagne-en-gerechten",
      it: "/ricette-abbinamenti-champagne",
      de: "/rezepte-champagner-und-speisen",
    },
    "/tout-savoir-sur-le-champagne": {
      fr: "/tout-savoir-sur-le-champagne",
      en: "/all-about-champagne",
      nl: "/alles-over-champagne",
      it: "/tutto-sullo-champagne",
      de: "/alles-ueber-champagner",
    },

    // Newsletter (inscription et confirmation)
    "/newsletter": { fr: "/newsletter", en: "/newsletter", nl: "/nieuwsbrief", it: "/newsletter", de: "/newsletter" },
    "/newsletter/confirmation": {
      fr: "/newsletter/confirmation",
      en: "/newsletter/confirmation",
      nl: "/nieuwsbrief/bevestiging",
      it: "/newsletter/conferma",
      de: "/newsletter/bestaetigung",
    },

    // Contact et légal
    "/contact": { fr: "/contact", en: "/contact", nl: "/contact", it: "/contatti", de: "/kontakt" },
    "/mentions-legales": {
      fr: "/mentions-legales",
      en: "/legal-notice",
      nl: "/juridische-informatie",
      it: "/note-legali",
      de: "/impressum",
    },
    "/politique-de-confidentialite": {
      fr: "/politique-de-confidentialite",
      en: "/privacy-policy",
      nl: "/privacybeleid",
      it: "/informativa-sulla-privacy",
      de: "/datenschutz",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Pages sans paramètre (utilisables directement dans un lien de menu). */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
