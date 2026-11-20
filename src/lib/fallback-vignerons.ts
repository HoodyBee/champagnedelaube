// Vignerons affichés tant qu'aucune fiche « Vigneron » n'est publiée dans Sanity.
// UNIQUEMENT les informations fournies par Champagne de l'Aube (cahier des charges) :
// rien n'est inventé. Dès qu'un vigneron est publié dans le Studio, ces fiches
// par défaut ne s'affichent plus.

import type { Locale } from "@/i18n/routing";
import type { CepageKey, PictoKey, TerroirKey } from "./brand";

type L = Record<Locale, string>;

export type FallbackVigneron = {
  slug: string;
  nom: string;
  village: string;
  terroir: TerroirKey;
  accroche: L;
  philosophie: L;
  personnes: { nom: string; role: L }[];
  cepages: CepageKey[];
  thematiques: PictoKey[];
  pratiques: L[];
  labels: string[];
  siteWeb: string;
};

export const fallbackVignerons: FallbackVigneron[] = [
  {
    slug: "moutard-dangin",
    nom: "Champagne Moutard*Dangin",
    village: "Polisy",
    terroir: "cote-des-bar",
    accroche: {
      fr: "Cinq générations de vignerons à Polisy, dans la Côte des Bar.",
      en: "Five generations of winemakers in Polisy, in the Côte des Bar.",
      nl: "Vijf generaties wijnmakers in Polisy, in de Côte des Bar.",
      it: "Cinque generazioni di vignaioli a Polisy, nella Côte des Bar.",
      de: "Fünf Winzergenerationen in Polisy, in der Côte des Bar.",
    },
    philosophie: {
      fr: "Cinq générations à Polisy. Corinne Moutard dirige le domaine depuis 1985 avec Christophe Dangin ; Camille et Arnaud Dangin forment la nouvelle génération.",
      en: "Five generations in Polisy. Corinne Moutard has run the estate since 1985 with Christophe Dangin; Camille and Arnaud Dangin are the new generation.",
      nl: "Vijf generaties in Polisy. Corinne Moutard leidt het domein sinds 1985 samen met Christophe Dangin; Camille en Arnaud Dangin vormen de nieuwe generatie.",
      it: "Cinque generazioni a Polisy. Corinne Moutard guida la tenuta dal 1985 con Christophe Dangin; Camille e Arnaud Dangin sono la nuova generazione.",
      de: "Fünf Generationen in Polisy. Corinne Moutard leitet das Weingut seit 1985 gemeinsam mit Christophe Dangin; Camille und Arnaud Dangin sind die neue Generation.",
    },
    personnes: [
      {
        nom: "Corinne Moutard",
        role: {
          fr: "Dirige le domaine depuis 1985",
          en: "Has run the estate since 1985",
          nl: "Leidt het domein sinds 1985",
          it: "Guida la tenuta dal 1985",
          de: "Leitet das Weingut seit 1985",
        },
      },
      {
        nom: "Christophe Dangin",
        role: {
          fr: "Dirige le domaine avec Corinne Moutard",
          en: "Runs the estate with Corinne Moutard",
          nl: "Leidt het domein samen met Corinne Moutard",
          it: "Guida la tenuta con Corinne Moutard",
          de: "Leitet das Weingut gemeinsam mit Corinne Moutard",
        },
      },
      {
        nom: "Camille et Arnaud Dangin",
        role: { fr: "La nouvelle génération", en: "The new generation", nl: "De nieuwe generatie", it: "La nuova generazione", de: "Die neue Generation" },
      },
    ],
    cepages: ["pinot-noir", "chardonnay", "meunier", "pinot-blanc"],
    thematiques: [],
    pratiques: [
      {
        fr: "Culture sans herbicides",
        en: "Farming without herbicides",
        nl: "Teelt zonder herbiciden",
        it: "Coltivazione senza diserbanti",
        de: "Anbau ohne Herbizide",
      },
    ],
    labels: [],
    siteWeb: "https://www.champagnemoutarddangin.fr/",
  },
  {
    slug: "mennetrier",
    nom: "Champagne Mennetrier",
    village: "Arrentières",
    terroir: "cote-des-bar",
    accroche: {
      fr: "Du raisin à la bouteille, tout se fait au domaine, à Arrentières.",
      en: "From grape to bottle, everything happens at the estate in Arrentières.",
      nl: "Van druif tot fles gebeurt alles op het domein in Arrentières.",
      it: "Dall'uva alla bottiglia, tutto avviene in tenuta ad Arrentières.",
      de: "Von der Traube bis zur Flasche geschieht alles auf dem Weingut in Arrentières.",
    },
    philosophie: {
      fr: "Du raisin à la bouteille, tout se fait au domaine : vendanges manuelles, pressurage doux, cuves inox thermorégulées.",
      en: "From grape to bottle, everything happens at the estate: hand harvesting, gentle pressing, temperature-controlled stainless steel tanks.",
      nl: "Van druif tot fles gebeurt alles op het domein: handmatige pluk, zachte persing, temperatuurgestuurde roestvrijstalen tanks.",
      it: "Dall'uva alla bottiglia, tutto avviene in tenuta: vendemmia manuale, pressatura soffice, vasche inox termoregolate.",
      de: "Von der Traube bis zur Flasche geschieht alles auf dem Weingut: Handlese, schonende Pressung, temperaturgesteuerte Edelstahltanks.",
    },
    personnes: [],
    cepages: [],
    thematiques: [],
    pratiques: [
      { fr: "Vendanges manuelles", en: "Hand harvesting", nl: "Handmatige pluk", it: "Vendemmia manuale", de: "Handlese" },
      { fr: "Pressurage doux", en: "Gentle pressing", nl: "Zachte persing", it: "Pressatura soffice", de: "Schonende Pressung" },
      {
        fr: "Cuves inox thermorégulées",
        en: "Temperature-controlled stainless steel tanks",
        nl: "Temperatuurgestuurde roestvrijstalen tanks",
        it: "Vasche inox termoregolate",
        de: "Temperaturgesteuerte Edelstahltanks",
      },
    ],
    labels: ["HVE", "Viticulture durable en Champagne"],
    siteWeb: "https://champagne-mennetrier.com/",
  },
];
