// Génère src/styles/tokens.css à partir de tokens.json (à la racine du dépôt).
//
// tokens.json est la SEULE source des valeurs de la charte : pour changer une
// couleur, une taille ou un espacement, modifiez tokens.json puis lancez
// `npm run tokens` (le script est aussi lancé automatiquement avant chaque build).
// Ne modifiez pas src/styles/tokens.css à la main : il serait écrasé.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(resolve(root, "tokens.json"), "utf8"));
const out = resolve(root, "src/styles/tokens.css");

// Polices : les variables --font-vollkorn et --font-inter sont posées sur <html>
// par next/font (voir src/app/fonts.ts). Les familles de tokens.json servent de
// polices de secours si le fichier de police n'est pas encore chargé.
const fallback = (family) =>
  tokens.font.families[family].split(",").slice(1).join(",").trim();
const fontVar = { serif: "--font-vollkorn", sans: "--font-inter" };

// Sur mobile, les très grands titres sont réduits progressivement (clamp) :
// la taille de référence du brand book est atteinte à partir d'environ 1024 px.
const responsive = {
  "titre-logo": "clamp(2.75rem, 1.6rem + 4.6vw, 4.5rem)",
  "titre-post": "clamp(2.125rem, 1.6rem + 2.2vw, 3rem)",
  "titre-section": "clamp(1.5rem, 1.3rem + 0.8vw, 1.75rem)",
  accroche: "clamp(1.375rem, 1.15rem + 0.9vw, 1.75rem)",
  bandeau: "clamp(1.25rem, 0.9rem + 1.5vw, 2rem)",
};

const lines = [];
const push = (s = "") => lines.push(s);

push("/* FICHIER GÉNÉRÉ par scripts/generate-tokens.mjs à partir de tokens.json.");
push("   Ne pas modifier à la main : lancer `npm run tokens`. */");
push();
push("@theme static {");
push("  /* On repart de zéro pour les couleurs : seules celles de la marque existent. */");
push("  --color-*: initial;");
push("  --color-transparent: transparent;");
push("  --color-current: currentColor;");
for (const [name, { value }] of Object.entries(tokens.color)) {
  push(`  --color-${name}: ${value};`);
}
push();
push(`  --font-serif: var(${fontVar.serif}), ${fallback("serif")};`);
push(`  --font-sans: var(${fontVar.sans}), ${fallback("sans")};`);
push();
for (const [name, value] of Object.entries(tokens.spacing)) {
  // Utilisation : p-space-3, gap-space-2, mt-space-5…
  push(`  --spacing-${name}: ${value};`);
}
push();
const radiusNames = {
  "radius-0": "photo",
  "radius-s": "etiquette",
  "radius-m": "carte",
  "radius-rond": "rond",
};
for (const [name, value] of Object.entries(tokens.radius)) {
  // Utilisation : rounded-photo, rounded-etiquette, rounded-carte, rounded-rond
  push(`  --radius-${radiusNames[name] ?? name}: ${value};`);
}
push("}");
push();

// Styles typographiques -> classes utilitaires : text-titre-post, text-corps…
for (const [name, s] of Object.entries(tokens.font.styles)) {
  push(`@utility text-${name} {`);
  push(`  font-family: var(--font-${s.family});`);
  push(`  font-size: ${responsive[name] ?? s.size};`);
  if (s.lineHeight !== undefined) push(`  line-height: ${s.lineHeight};`);
  push(`  font-weight: ${s.weight};`);
  if (s.letterSpacing) push(`  letter-spacing: ${s.letterSpacing};`);
  if (s.transform) push(`  text-transform: ${s.transform};`);
  if (s.style) push(`  font-style: ${s.style};`);
  push("}");
  push();
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join("\n"));
console.log(`✓ ${out.replace(root + "/", "")} généré depuis tokens.json`);
