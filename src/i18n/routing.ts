import { defineRouting } from "next-intl/routing";

// Langues du site. Le français est la langue par défaut : ses URL n'ont pas de
// préfixe (/vignerons/), les autres langues en ont un (/en/winemakers/, /de/winzer/).
export const locales = ["fr", "en", "nl", "it", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/**
 * Langues dont les contenus sont rédigés et qui peuvent être indexées par Google.
 * Le néerlandais, l'italien et l'allemand existent déjà (structure prête), mais tant que leurs
 * textes ne sont pas traduits, leurs pages affichent l'anglais en secours : on les
 * garde hors de Google (noindex, absentes du sitemap et des balises hreflang) pour
 * éviter le contenu dupliqué. Pour publier une langue, ajoutez-la ici.
 */
export const indexedLocales: readonly Locale[] = ["fr", "en"];

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
    "/les-riceys": "/les-riceys",
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

    // Champagne pour mariage (nouvelle page, référencement « champagne mariage Troyes »)
    "/champagne-mariage-troyes": {
      fr: "/champagne-mariage-troyes",
      en: "/wedding-champagne-troyes",
      nl: "/champagne-voor-bruiloft-troyes",
      it: "/champagne-per-matrimonio-troyes",
      de: "/hochzeitschampagner-troyes",
    },

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
      en: "/corporate-gifts-and-events",
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
