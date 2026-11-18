// Vérifie que chaque texte de l'interface existe dans TOUTES les langues.
// Référence : messages/fr.json. Lancé automatiquement avant chaque build :
// s'il manque une traduction, le build s'arrête avec la liste des textes à traduire.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["fr", "en", "nl", "it", "de"];
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
  const missing = refKeys.filter((k) => typeof get(messages, k) !== "string" || get(messages, k).trim() === "");
  const extra = keys(messages).filter((k) => get(reference, k) === undefined);
  for (const k of missing) console.error(`✗ [${locale}] traduction manquante : ${k}`);
  for (const k of extra) console.error(`✗ [${locale}] texte inconnu en français : ${k}`);
  problems += missing.length + extra.length;
}

if (problems > 0) {
  console.error(`\n${problems} problème(s) de traduction. Complétez les fichiers messages/*.json.`);
  process.exit(1);
}
console.log(`✓ Traductions complètes : ${refKeys.length} textes × ${locales.length} langues`);
