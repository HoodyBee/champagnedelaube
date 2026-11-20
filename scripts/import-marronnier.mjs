// Importe les dates du marronnier (content/marronnier/journees-<année>.json) dans Sanity,
// en documents « Journée du calendrier » PUBLIÉS (identifiants stables : relancer met à jour).
//
//   node scripts/import-marronnier.mjs 2027            -> simulation
//   SANITY_WRITE_TOKEN=... node scripts/import-marronnier.mjs 2027 --envoyer

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const annee = process.argv[2] ?? "2027";
const ENVOYER = process.argv.includes("--envoyer");
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const API = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "amwjqoim"}.api.sanity.io/v2026-11-01`;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const dates = JSON.parse(readFileSync(resolve(root, `content/marronnier/journees-${annee}.json`), "utf8"));

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const docs = dates.map((d) => ({
  _id: `journee-${d.debut}-${slug(d.titre.fr)}`,
  _type: "journeeCalendrier",
  titre: { _type: "localeString", ...d.titre },
  debut: d.debut,
  ...(d.fin ? { fin: d.fin } : {}),
  categorie: d.categorie,
  ...(d.emoji ? { emoji: d.emoji } : {}),
  anecdote: { _type: "localeText", ...d.anecdote },
  ...(d.regle ? { regle: { _type: "localeString", ...d.regle } } : {}),
  ...(d.lien ? { lien: d.lien } : {}),
  aConfirmer: d.aConfirmer === true,
}));

if (!ENVOYER) {
  console.log(`Simulation : ${docs.length} dates (${annee}). Ajoutez --envoyer pour les publier.`);
  process.exit(0);
}
if (!TOKEN) throw new Error("SANITY_WRITE_TOKEN manquant");
const r = await fetch(`${API}/data/mutate/${DATASET}`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: docs.map((d) => ({ createOrReplace: d })) }),
});
if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
console.log(`Publié : ${docs.length} dates du marronnier ${annee}.`);
