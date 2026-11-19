// 1. Vérifie que chaque texte de l'interface existe dans TOUTES les langues.
// 2. Vérifie qu'aucune expression interdite par la stratégie de marque n'apparaît
//    dans les textes du site (messages/*.json et code source).
// Référence : messages/fr.json. Lancé automatiquement avant chaque build :
// s'il manque une traduction, le build s'arrête avec la liste des textes à traduire.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["fr", "en", "nl", "it", "de"];
// Langues dont tous les textes doivent être traduits : celles du lancement (FR, EN).
// Le néerlandais, l'italien et l'allemand sont masqués : leurs textes existants sont
// gardés, et ceux qui manquent s'affichent en anglais quand on les réactive.
const required = new Set(["en"]);
const load = (l) => JSON.parse(readFileSync(resolve(root, `messages/${l}.json`), "utf8"));

function keys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}
function get(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

const reference = load("fr");
const refKeys = keys(reference);
let problems = 0;

for (const locale of locales.slice(1)) {
  const messages = load(locale);
  const missing = required.has(locale)
    ? refKeys.filter((k) => typeof get(messages, k) !== "string" || get(messages, k).trim() === "")
    : [];
  const extra = keys(messages).filter((k) => get(reference, k) === undefined);
  for (const k of missing) console.error(`✗ [${locale}] traduction manquante : ${k}`);
  for (const k of extra) console.error(`✗ [${locale}] texte inconnu en français : ${k}`);
  problems += missing.length + extra.length;
}

// --- Expressions interdites ------------------------------------------------
// Champagne de l'Aube est apporteur d'affaires : jamais « sans intermédiaire »,
// jamais « maison de champagne ». Arguments autorisés : « interlocuteur unique »,
// « tarifs directs domaine », « sélection de vignerons indépendants ».
import { readdirSync, statSync } from "node:fs";
const forbidden = [
  /sans\s+interm[ée]diaire/i,
  /maisons?\s+de\s+champagne/i,
  /without\s+(any\s+)?(an\s+)?intermediar/i,
  /no\s+middlem[ae]n/i,
  /champagne\s+house/i,
  /zonder\s+tussenpersoon/i,
  /champagnehuis/i,
  /senza\s+intermediar/i,
  /casa\s+(di|dello)\s+champagne/i,
  /ohne\s+zwischenh[äa]ndler/i,
  /champagnerhaus/i,
  // Décision de novembre 2026 : jamais « Corporate » (on dit « Entreprises »).
  /\bcorporate\b/i,
];
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = resolve(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(json|tsx?)$/.test(name) ? [p] : [];
  });
}
for (const file of [...walk(resolve(root, "messages")), ...walk(resolve(root, "src"))]) {
  const text = readFileSync(file, "utf8");
  for (const re of forbidden) {
    const m = text.match(re);
    if (m) {
      console.error(`✗ Expression interdite « ${m[0]} » dans ${file.replace(root + "/", "")}`);
      problems++;
    }
  }
}

if (problems > 0) {
  console.error(`\n${problems} problème(s) : complétez les traductions ou reformulez les expressions interdites.`);
  process.exit(1);
}
console.log(`✓ Traductions complètes : ${refKeys.length} textes × ${required.size + 1} langues (FR, EN) · aucune expression interdite`);
