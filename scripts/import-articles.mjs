// Importe les articles du Mag rédigés dans le dépôt (content/articles/*.json) dans Sanity, en BROUILLON.
//
//   node scripts/import-articles.mjs            -> simulation : docs/import-articles-apercu.json, rien n'est envoyé
//   SANITY_WRITE_TOKEN=... node scripts/import-articles.mjs --envoyer
//
// Article déjà existant (ex. « Qu'est-ce qu'un cépage ? ») : son brouillon reçoit le nouveau
// titre, résumé, texte, rubriques et référencement ; la photo et la date sont conservées,
// et l'ancienne version est sauvegardée dans docs/import-articles-sauvegarde.json.
// Nouvel article : un brouillon est créé (adresse, date, rubriques du fichier).
// Article avec « blocs » : texte repris tel quel (pas de réécriture), langues présentes seulement.
// Rien n'est publié : vous relisez, ajoutez une photo et publiez dans le Studio.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "amwjqoim";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJECT}.api.sanity.io/v2026-11-01`;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const ENVOYER = process.argv.includes("--envoyer");
const LANGS = ["fr", "en", "nl", "it"];
const dir = resolve(root, "content/articles");
const articles = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(resolve(dir, f), "utf8")));

const localPath = (p, l) => `${l === "fr" ? "" : `/${l}`}${p}/`;
let n = 0;
const key = () => `a${(n++).toString(36)}`;
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
// Article repris tel quel (ex. article de detectezmoi.com) : blocs déjà découpés
// { style, listItem?, spans: [{ text, strong?, href? }] }, liens externes conservés.
function blocBrut(b) {
  const markDefs = [];
  const children = b.spans.map((s) => {
    const marks = s.strong ? ["strong"] : [];
    if (s.href) {
      const k = key();
      markDefs.push({ _type: "link", _key: k, href: s.href });
      marks.push(k);
    }
    return { _type: "span", _key: key(), text: s.text, marks };
  });
  return { _type: "block", _key: key(), style: b.style, ...(b.listItem ? { listItem: b.listItem, level: 1 } : {}), markDefs, children };
}
const contenu = (a, l) =>
  a.blocs
    ? (a.blocs[l] ?? []).map(blocBrut)
    : a.sections.filter((s) => s.titre[l]).flatMap((s) => [bloc(s.titre[l], l, "h2"), ...s.paragraphes.filter((p) => p[l]).map((p) => bloc(p[l], l))]);
const str = (v, type = "localeString") => ({ _type: type, ...Object.fromEntries(LANGS.filter((l) => v?.[l]).map((l) => [l, v[l]])) });

const docs = articles.map((a) => ({
  _id: `drafts.article-${a.slug}`.slice(0, 120),
  existant: a.existant,
  base: { _type: "article", slug: { _type: "slug", current: a.slug }, ...(a.date ? { date: a.date } : {}) },
  set: {
    titre: str(a.titre),
    extrait: str(a.extrait, "localeText"),
    rubriquePrincipale: a.rubriquePrincipale ?? a.rubriques[0],
    rubriques: a.rubriquePrincipale ? a.rubriques : a.rubriques.slice(1),
    contenu: { _type: "localeRichText", ...Object.fromEntries(LANGS.map((l) => [l, contenu(a, l)]).filter(([, v]) => v.length)) },
    seo: { _type: "seo", title: str(a.seo.title), description: str(a.seo.description, "localeText") },
  },
}));

if (!ENVOYER) {
  writeFileSync(resolve(root, "docs/import-articles-apercu.json"), JSON.stringify(docs, null, 2));
  console.log(`Simulation : ${docs.length} articles préparés -> docs/import-articles-apercu.json (rien n'a été envoyé).`);
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

const ids = docs.flatMap((d) => [d._id, d._id.replace("drafts.", "")]);
const existants = await api(`/data/query/${DATASET}?perspective=raw&query=${encodeURIComponent("*[_id in $ids]")}&$ids=${encodeURIComponent(JSON.stringify(ids))}`);
writeFileSync(resolve(root, "docs/import-articles-sauvegarde.json"), JSON.stringify(existants.result, null, 2));
const mutations = docs.flatMap((d) => {
  const publie = existants.result.find((e) => e._id === d._id.replace("drafts.", ""));
  return [{ createIfNotExists: { ...(publie ?? {}), _id: d._id, ...d.base } }, { patch: { id: d._id, set: d.set } }];
});
const res = await api(`/data/mutate/${DATASET}?returnIds=true`, { mutations });
console.log(`Envoyé : ${res.results.length} opérations. Relisez, ajoutez une photo et publiez dans le Studio.`);
