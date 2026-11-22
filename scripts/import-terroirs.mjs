// Importe les textes des terroirs (content/terroirs/*.json) dans Sanity, en BROUILLON.
//
//   node scripts/import-terroirs.mjs             -> simulation : écrit le résultat dans
//                                                  docs/import-terroirs-apercu.json, n'envoie rien
//   SANITY_WRITE_TOKEN=... node scripts/import-terroirs.mjs --envoyer
//                                                -> crée / met à jour les brouillons dans Sanity
//
// Ce qui est fait : pour chaque terroir, le brouillon « drafts.terroir-<cle> » reçoit
// accroche, introduction, repères, villages, texte, sols, cépages, secteurs et
// référencement. La photo déjà présente est conservée. L'ancien texte repris de
// WordPress est sauvegardé dans docs/import-terroirs-sauvegarde.json avant d'être remplacé.
// Pour la page centrale, le brouillon « drafts.terroirAube » reçoit ouverture,
// chapitres, cépages et questions. Rien n'est publié : vous relisez et publiez dans le Studio.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "amwjqoim";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJECT}.api.sanity.io/v2026-11-01`;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const ENVOYER = process.argv.includes("--envoyer");
const LANGS = ["fr", "en", "nl", "it"];
const load = (f) => JSON.parse(readFileSync(resolve(root, "content/terroirs", f), "utf8"));

// Adresses traduites des pages citées dans les textes (voir src/i18n/routing.ts).
const PATHS = {
  "/vignerons": { en: "/winemakers", nl: "/wijnmakers", it: "/vignaioli" },
  "/champagne-hotel-restaurants-et-cavistes": {
    en: "/champagne-for-hotels-restaurants-and-wine-shops",
    nl: "/champagne-voor-hotels-restaurants-en-wijnhandels",
    it: "/champagne-per-hotel-ristoranti-ed-enoteche",
  },
};
const localPath = (p, l) => `${l === "fr" ? "" : `/${l}`}${PATHS[p]?.[l] ?? p}/`;

let n = 0;
const key = () => `t${(n++).toString(36)}`;
function bloc(texte, l, style = "normal") {
  const children = [];
  const markDefs = [];
  const re = /\[([^\]]+)\]\((\/[^)]*)\)/g;
  let last = 0;
  for (let m; (m = re.exec(texte)); ) {
    if (m.index > last) children.push({ _type: "span", _key: key(), text: texte.slice(last, m.index), marks: [] });
    const k = key();
    markDefs.push({ _type: "link", _key: k, href: localPath(m[2], l) });
    children.push({ _type: "span", _key: key(), text: m[1], marks: [k] });
    last = m.index + m[0].length;
  }
  if (last < texte.length) children.push({ _type: "span", _key: key(), text: texte.slice(last), marks: [] });
  return { _type: "block", _key: key(), style, markDefs, children };
}
const str = (v, type = "localeString") => ({ _type: type, ...Object.fromEntries(LANGS.filter((l) => v?.[l]).map((l) => [l, v[l]])) });
const rich = (fn) => ({ _type: "localeRichText", ...Object.fromEntries(LANGS.map((l) => [l, fn(l)])) });

function terroirDoc(d) {
  return {
    ...(d.accroche ? { accroche: str(d.accroche) } : {}),
    ...(d.anecdote ? { anecdote: str(d.anecdote, "localeText") } : {}),
    intro: str(d.intro, "localeText"),
    chiffres: d.reperes.map((r) => ({ _type: "repere", _key: key(), label: str(r.label), valeur: str(r.valeur) })),
    villages: d.villages,
    contenu: rich((l) => d.sections.flatMap((s) => [bloc(s.titre[l], l, "h2"), ...s.paragraphes.map((p) => bloc(p[l], l))])),
    ...(d.sols ? { sols: str(d.sols, "localeText") } : {}),
    cepagesDominants: d.cepagesDominants,
    secteurs: (d.secteurs ?? []).map((s) => ({ _type: "blocTexte", _key: key(), titre: str(s.titre), texte: rich((l) => [bloc(s.texte[l], l)]) })),
    seo: { _type: "seo", title: str(d.seo.title), description: str(d.seo.description, "localeText") },
  };
}
function aubeDoc(a) {
  return {
    hero: { _type: "hero", surTitre: str(a.hero.surTitre), titre: str(a.hero.titre), intro: str(a.hero.intro, "localeText") },
    chapitres: a.chapitres.map((c) => ({
      _type: "blocTexte",
      _key: key(),
      titre: str(c.titre),
      texte: rich((l) => [bloc(c.texte[l], l)]),
    })),
    cepagesTitre: str(a.cepagesTitre),
    cepagesIntro: rich((l) => [bloc(a.cepagesIntro[l], l)]),
    cepagesTextes: a.cepagesTextes.map((c) => ({ _type: "cepageTexte", _key: key(), cepage: c.cepage, texte: str(c.texte, "localeText") })),
    faq: a.faq.map((q) => ({ _type: "faqItem", _key: key(), question: str(q.question), reponse: str(q.reponse, "localeText") })),
    seo: { _type: "seo", title: str(a.seo.title), description: str(a.seo.description, "localeText") },
  };
}

const terroirs = ["cote-des-bar", "les-riceys", "montgueux", "villenauxe"].map((c) => load(`${c}.json`));
const docs = [
  ...terroirs.map((d) => ({ _id: `drafts.terroir-${d.cle}`, _type: "terroir", base: { cle: d.cle, nom: d.nom }, set: terroirDoc(d) })),
  { _id: "drafts.terroirAube", _type: "terroirAube", base: {}, set: aubeDoc(load("aube.json")) },
];

if (!ENVOYER) {
  writeFileSync(resolve(root, "docs/import-terroirs-apercu.json"), JSON.stringify(docs, null, 2));
  console.log(`Simulation : ${docs.length} brouillons préparés -> docs/import-terroirs-apercu.json (rien n'a été envoyé).`);
  process.exit(0);
}
if (!TOKEN) {
  console.error("SANITY_WRITE_TOKEN manquant : impossible d'envoyer.");
  process.exit(1);
}
const api = (path, body) =>
  fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${await r.text()}`))));

// Sauvegarde de l'existant (brouillons et versions publiées) avant toute modification.
const ids = docs.flatMap((d) => [d._id, d._id.replace("drafts.", "")]);
const existants = await api(`/data/query/${DATASET}?perspective=raw&query=${encodeURIComponent("*[_id in $ids]")}&$ids=${encodeURIComponent(JSON.stringify(ids))}`);
writeFileSync(resolve(root, "docs/import-terroirs-sauvegarde.json"), JSON.stringify(existants.result, null, 2));

const mutations = [];
for (const d of docs) {
  const publie = existants.result.find((e) => e._id === d._id.replace("drafts.", ""));
  // Le brouillon part de la version publiée si elle existe (photo, galerie conservées).
  mutations.push({ createIfNotExists: { ...(publie ?? {}), _id: d._id, _type: d._type, ...d.base } });
  mutations.push({ patch: { id: d._id, set: d.set } });
}
const res = await api(`/data/mutate/${DATASET}?returnIds=true`, { mutations });
console.log(`Envoyé : ${res.results.length} opérations. Sauvegarde : docs/import-terroirs-sauvegarde.json. Relisez et publiez dans le Studio.`);
