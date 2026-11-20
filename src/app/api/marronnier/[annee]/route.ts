import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { avecLibelles } from "@/lib/calendrier";
import { getCalendrier, type CategorieCalendrier } from "@/sanity/content";

/** Couleurs des pastilles (mêmes que sur le site). */
const HEX: Record<CategorieCalendrier, string> = {
  evenements: "#BF9140",
  vins: "#C2416A",
  gastronomie: "#4F8F3F",
  spiritueux: "#5B4A9E",
  salons: "#1B86B8",
};
const couleur = (hex: string) => rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);
const ANTHRACITE = couleur("#1E1E20");
const GRIS = couleur("#5C5650");
const BRONZE = couleur("#8A6420");
const FILET = couleur("#EFE6D2");

/**
 * Le marronnier en PDF (A4), généré à la demande à partir des dates saisies dans Sanity :
 * /api/marronnier/2027?lang=fr. Lien envoyé après le formulaire « Recevoir le calendrier en PDF ».
 */
export async function GET(request: Request, { params }: { params: Promise<{ annee: string }> }) {
  const { annee: brut } = await params;
  const annee = Number(brut);
  if (!Number.isInteger(annee) || annee < 2020 || annee > 2100) return new Response("Année invalide", { status: 400 });
  const lang = new URL(request.url).searchParams.get("lang") ?? "";
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getTranslations({ locale, namespace: "calendrier" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  const dates = avecLibelles(await getCalendrier(locale), locale).filter((d) => d.debut.startsWith(String(annee)) || d.fin.startsWith(String(annee)));

  const pdf = await PDFDocument.create();
  pdf.setTitle(`${t("pdfDocTitre", { annee })} · Champagne de l'Aube`);
  pdf.setAuthor("Champagne de l'Aube");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);

  // Les polices standard ne savent pas écrire les emojis : on les retire, sans rien perdre du texte.
  const propre = (font: PDFFont, s: string) =>
    [...s]
      .map((c) => {
        try {
          font.encodeText(c);
          return c;
        } catch {
          return "";
        }
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  const lignes = (font: PDFFont, size: number, texte: string, largeur: number) => {
    const mots = propre(font, texte).split(" ");
    const out: string[] = [];
    let cur = "";
    for (const m of mots) {
      const essai = cur ? `${cur} ${m}` : m;
      if (font.widthOfTextAtSize(essai, size) > largeur && cur) {
        out.push(cur);
        cur = m;
      } else cur = essai;
    }
    if (cur) out.push(cur);
    return out;
  };

  const L = 595.28;
  const H = 841.89;
  const M = 40;
  const COL = { date: M, titre: M + 78, cat: M + 300, anecdote: M + 395 };
  const LARG = { titre: 214, cat: 90, anecdote: L - M - (M + 395) };
  let page: PDFPage = pdf.addPage([L, H]);
  let y = H - M;
  let numero = 1;

  const piedDePage = (p: PDFPage, n: number) => {
    p.drawLine({ start: { x: M, y: 46 }, end: { x: L - M, y: 46 }, thickness: 0.5, color: FILET });
    p.drawText(propre(regular, `champagnedelaube.fr · ${tLegal("health")}`), { x: M, y: 32, size: 7.5, font: regular, color: GRIS });
    p.drawText(String(n), { x: L - M - 10, y: 32, size: 7.5, font: regular, color: GRIS });
  };
  const nouvellePage = () => {
    piedDePage(page, numero);
    page = pdf.addPage([L, H]);
    numero += 1;
    y = H - M;
  };

  // En-tête
  try {
    const logo = await fetch(new URL("/brand/logos/logo-empile-rond-bandeau.png", request.url)).then((r) => (r.ok ? r.arrayBuffer() : null));
    if (logo) {
      const img = await pdf.embedPng(logo);
      page.drawImage(img, { x: M, y: y - 56, width: 56, height: 56 });
    }
  } catch {
    // Sans logo, le PDF reste lisible.
  }
  page.drawText(propre(regular, t("pdfSurTitre").toUpperCase()), { x: M + 70, y: y - 14, size: 8.5, font: regular, color: BRONZE });
  page.drawText(propre(serif, t("pdfDocTitre", { annee })), { x: M + 70, y: y - 36, size: 20, font: serif, color: ANTHRACITE });
  for (const [i, l] of lignes(regular, 9, t("pdfIntro"), L - 2 * M - 70).entries()) {
    page.drawText(l, { x: M + 70, y: y - 52 - i * 12, size: 9, font: regular, color: GRIS });
  }
  y -= 92;

  // Légende
  let x = M;
  for (const c of Object.keys(HEX) as CategorieCalendrier[]) {
    if (!dates.some((d) => d.categorie === c)) continue;
    const label = propre(regular, t(`categories.${c}`));
    page.drawCircle({ x: x + 3, y: y + 3, size: 3, color: couleur(HEX[c]) });
    page.drawText(label, { x: x + 10, y, size: 8.5, font: regular, color: ANTHRACITE });
    x += regular.widthOfTextAtSize(label, 8.5) + 24;
  }
  y -= 22;

  const fmtMois = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
  const mois = [...new Set(dates.map((d) => d.mois))].sort();
  for (const m of mois) {
    if (y < 120) nouvellePage();
    const titreMois = fmtMois.format(new Date(`${m}-01T00:00:00Z`));
    page.drawText(propre(serif, titreMois.charAt(0).toUpperCase() + titreMois.slice(1)), { x: M, y, size: 13, font: serif, color: BRONZE });
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: L - M, y }, thickness: 0.8, color: couleur("#BF9140") });
    y -= 13;
    for (const d of dates.filter((x) => x.mois === m)) {
      const titre = lignes(bold, 8.5, d.titre + (d.aConfirmer ? ` (${t("aConfirmer")})` : ""), LARG.titre);
      const anecdote = lignes(regular, 7.5, d.anecdote ?? "", LARG.anecdote);
      const cat = lignes(regular, 7.5, t(`categories.${d.categorie}`), LARG.cat - 10);
      const hauteur = Math.max(titre.length * 11, anecdote.length * 9.5, cat.length * 9.5) + 6;
      if (y - hauteur < 60) nouvellePage();
      page.drawText(propre(bold, d.dateLabel), { x: COL.date, y, size: 8.5, font: bold, color: ANTHRACITE });
      titre.forEach((l, i) => page.drawText(l, { x: COL.titre, y: y - i * 11, size: 8.5, font: bold, color: ANTHRACITE }));
      page.drawCircle({ x: COL.cat + 3, y: y + 3, size: 3, color: couleur(HEX[d.categorie]) });
      cat.forEach((l, i) => page.drawText(l, { x: COL.cat + 10, y: y - i * 9.5, size: 7.5, font: regular, color: GRIS }));
      anecdote.forEach((l, i) => page.drawText(l, { x: COL.anecdote, y: y - i * 9.5, size: 7.5, font: regular, color: GRIS }));
      y -= hauteur;
      page.drawLine({ start: { x: M, y: y + 9 }, end: { x: L - M, y: y + 9 }, thickness: 0.3, color: FILET });
    }
    y -= 8;
  }
  if (!dates.length) page.drawText(propre(regular, t("aucune")), { x: M, y, size: 10, font: regular, color: GRIS });
  piedDePage(page, numero);

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="marronnier-${annee}-champagne-de-l-aube.pdf"`,
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
