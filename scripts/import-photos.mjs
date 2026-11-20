// Envoie un lot de photos PRÉPARÉES (2400 px max, qualité 80, métadonnées nettoyées : voir docs/photos-methode.md)
// dans la Médiathèque Sanity, avec leur nom de fichier lisible, leur texte alternatif, leur crédit et leurs étiquettes.
//
//   node scripts/import-photos.mjs content/photos/lots/lot-1.json /tmp/photos/prepa            -> simulation
//   SANITY_WRITE_TOKEN=... node scripts/import-photos.mjs content/photos/lots/lot-1.json /tmp/photos/prepa --envoyer
//
// Résultat : content/photos/lots/<lot>-assets.json (nom de fichier -> identifiant Sanity), pour placer les photos.
// Relancer ne crée pas de doublon : Sanity reconnaît un fichier identique et renvoie la même image.

import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const [manifeste, dossier] = process.argv.slice(2);
const ENVOYER = process.argv.includes("--envoyer");
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const PROJET = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "amwjqoim";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJET}.api.sanity.io/v2026-11-01`;
if (!manifeste || !dossier) throw new Error("Usage : node scripts/import-photos.mjs <manifeste.json> <dossier des photos préparées> [--envoyer]");
const lot = JSON.parse(readFileSync(manifeste, "utf8"));

const etiquettes = [...new Set(lot.photos.flatMap((p) => p.etiquettes))].sort();
console.log(`${lot.photos.length} photos, ${etiquettes.length} étiquettes.`);
if (!ENVOYER) process.exit(0);
if (!TOKEN) throw new Error("SANITY_WRITE_TOKEN manquant");

const api = async (chemin, init = {}) => {
  const r = await fetch(`${API}${chemin}`, { ...init, headers: { Authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) } });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};
const muter = (mutations) => api(`/data/mutate/${DATASET}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mutations }) });

// 1. Étiquettes de la Médiathèque (documents « media.tag » de sanity-plugin-media).
const idTag = (nom) => `media-tag-${nom}`;
await muter(etiquettes.map((nom) => ({ createIfNotExists: { _id: idTag(nom), _type: "media.tag", name: { _type: "slug", current: nom } } })));

// 2. Envoi des fichiers, puis titre, texte alternatif, crédit et étiquettes sur chaque image.
const assets = {};
for (const p of lot.photos) {
  const corps = readFileSync(join(dossier, p.fichier));
  const nom = basename(p.fichier);
  const { document } = await api(`/assets/images/${DATASET}?filename=${encodeURIComponent(nom)}&title=${encodeURIComponent(nom.replace(/\.jpg$/, ""))}`, {
    method: "POST",
    headers: { "Content-Type": "image/jpeg" },
    body: corps,
  });
  await muter([
    {
      patch: {
        id: document._id,
        set: {
          title: nom.replace(/\.jpg$/, ""),
          altText: p.alt.fr,
          description: p.usage,
          creditLine: p.credit,
          "opt.media.tags": p.etiquettes.map((t, i) => ({ _type: "reference", _ref: idTag(t), _weak: true, _key: `t${i}` })),
        },
      },
    },
  ]);
  assets[nom] = { id: document._id, alt: p.alt };
  console.log("✓", nom);
}
writeFileSync(manifeste.replace(/\.json$/, "-assets.json"), JSON.stringify(assets, null, 1));
console.log(`Envoyé : ${Object.keys(assets).length} photos.`);
