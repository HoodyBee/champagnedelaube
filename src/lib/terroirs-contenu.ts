// Textes des terroirs rédigés dans le dépôt (content/terroirs/*.json), en attendant
// leur import dans Sanity. Tant qu'aucune fiche Terroir n'est publiée dans le Studio,
// les pages affichent ces textes. Le même convertisseur sert au script d'import.
import type { PortableTextBlock } from "next-sanity";
import aube from "../../content/terroirs/aube.json";
import coteDesBar from "../../content/terroirs/cote-des-bar.json";
import lesRiceys from "../../content/terroirs/les-riceys.json";
import montgueux from "../../content/terroirs/montgueux.json";
import villenauxe from "../../content/terroirs/villenauxe.json";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CepageKey, TerroirKey } from "./brand";

export type T = Partial<Record<Locale, string>>;
export type TerroirContenu = {
  cle: TerroirKey;
  nom: string;
  motCle: string;
  seo: { title: T; description: T };
  accroche: T;
  intro: T;
  reperes: { label: T; valeur: T }[];
  villages: string[];
  cepagesDominants: CepageKey[];
  sols?: T;
  /** Précision sous un cépage (ex. chardonnay rose : autorisé depuis 2025). */
  cepagesNotes?: Partial<Record<CepageKey, T>>;
  secteurs?: { titre: T; texte: T }[];
  sections: { titre: T; paragraphes: T[] }[];
};
export type AubeContenu = {
  seo: { title: T; description: T };
  hero: { surTitre: T; titre: T; intro: T };
  chapitres: { titre: T; texte: T }[];
  cepagesTitre: T;
  cepagesIntro: T;
  cepagesTextes: { cepage: CepageKey; texte: T }[];
  faq: { question: T; reponse: T }[];
};

export const terroirsContenu = { "cote-des-bar": coteDesBar, "les-riceys": lesRiceys, montgueux, villenauxe } as unknown as Record<TerroirKey, TerroirContenu>;
export const aubeContenu = aube as unknown as AubeContenu;

/** Texte dans la langue demandée (secours : anglais, puis français). */
export const tr = (v: T | undefined, locale: Locale) => v?.[locale] ?? v?.en ?? v?.fr ?? "";

let n = 0;
const key = () => `k${(n++).toString(36)}`;

/**
 * Paragraphe avec liens internes « [texte](/adresse) » -> bloc de texte enrichi.
 * Les adresses sont traduites dans la langue de la page (/tasting-troyes -> /en/tasting-troyes).
 */
export function paragrapheEnBloc(texte: string, locale: Locale, style: "normal" | "h2" | "blockquote" = "normal"): PortableTextBlock {
  const children: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const markDefs: { _type: "link"; _key: string; href: string }[] = [];
  const re = /\[([^\]]+)\]\((\/[^)]*)\)/g;
  let last = 0;
  for (let m; (m = re.exec(texte)); ) {
    if (m.index > last) children.push({ _type: "span", _key: key(), text: texte.slice(last, m.index), marks: [] });
    const k = key();
    let href = m[2];
    try {
      href = getPathname({ href: m[2] as never, locale });
    } catch {
      /* adresse non traduite : gardée telle quelle */
    }
    markDefs.push({ _type: "link", _key: k, href: href.endsWith("/") ? href : `${href}/` });
    children.push({ _type: "span", _key: key(), text: m[1], marks: [k] });
    last = m.index + m[0].length;
  }
  if (last < texte.length) children.push({ _type: "span", _key: key(), text: texte.slice(last), marks: [] });
  return { _type: "block", _key: key(), style, markDefs, children } as PortableTextBlock;
}

/** Sections (intertitre + paragraphes) -> texte enrichi complet. */
export function sectionsEnBlocs(sections: TerroirContenu["sections"], locale: Locale): PortableTextBlock[] {
  return sections.flatMap((s) => [
    paragrapheEnBloc(tr(s.titre, locale), locale, "h2"),
    ...s.paragraphes.map((p) => paragrapheEnBloc(tr(p, locale), locale)),
  ]);
}
