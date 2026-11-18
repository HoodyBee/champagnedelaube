// Reprise des textes de l'ancien site WordPress dans Sanity, EN BROUILLON.
//
//   1. Simulation (rien n'est écrit dans Sanity) :
//        NODE_USE_ENV_PROXY=1 node scripts/import-wordpress.mjs --out dossier/
//      -> dossier/plan.json (ce qui sera créé) et dossier/evin.json (passages à relire)
//   2. Écriture (brouillons uniquement, jamais d'écrasement d'un contenu existant) :
//        NODE_USE_ENV_PROXY=1 SANITY_WRITE_TOKEN=… node scripts/import-wordpress.mjs --out dossier/ --write
//
// Correspondance ancien site -> Sanity :
//   pages terroirs           -> Terroir (texte de la page, photo, accroche = ancien H1)
//   tout-savoir, recettes,
//   vignerons partenaires    -> Autres pages (texte de la page)
//   accueil, Pro, CSE,
//   tasting-troyes           -> champ « Texte de l'ancien site (à reprendre) » de chaque espace
//   7 articles               -> Article (même adresse, rubrique, photo, résumé, date)

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "node-html-parser";

const WP = "https://champagnedelaube.fr";
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "amwjqoim";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJECT}.api.sanity.io/v2026-11-01`;
const args = process.argv.slice(2);
const OUT = resolve(args[args.indexOf("--out") + 1] || "import-wordpress");
const WRITE = args.includes("--write");
const UA = { "user-agent": "Mozilla/5.0 (compatible; champagnedelaube-import/1.0)" };

const key = (s) => createHash("sha1").update(String(s)).digest("hex").slice(0, 12);
const clean = (s) => s.replace(/[​­]/g, "").replace(/\s+/g, " ").trim();
const decode = (s) => parse(`<p>${s}</p>`).text;

// ---------------------------------------------------------------------------
// HTML (Elementor) -> texte enrichi Sanity (Portable Text)
// ---------------------------------------------------------------------------
const SKIP = new Set(["script", "style", "svg", "form", "noscript", "iframe", "nav", "button", "input", "select", "textarea"]);
const BLOCK_STYLE = { p: "normal", h2: "h2", h3: "h3", h4: "h3", h5: "h3", h6: "h3", blockquote: "blockquote", figcaption: "normal" };

function convert(html) {
  const root = parse(html);
  const blocks = [];
  const images = [];
  const removedButtons = [];
  let h1s = [];
  let current = null;

  const start = (style, extra = {}) => {
    flush();
    current = { _type: "block", style, markDefs: [], children: [], ...extra };
  };
  const flush = () => {
    if (!current) return;
    current.children = current.children.filter((c) => c.text !== "");
    if (current.children.length) {
      current.children[0].text = current.children[0].text.replace(/^\s+/, "");
      current.children.at(-1).text = current.children.at(-1).text.replace(/\s+$/, "");
      const text = current.children.map((c) => c.text).join("");
      if (clean(text)) {
        current._key = key(blocks.length + text);
        current.children.forEach((c, i) => (c._key = key(current._key + i)));
        blocks.push(current);
      }
    }
    current = null;
  };
  const addText = (text, marks) => {
    if (!current) start("normal");
    const t = text.replace(/[​­]/g, "").replace(/\s+/g, " ");
    if (!t) return;
    const last = current.children.at(-1);
    if (last && last.marks.join() === marks.join()) last.text += t;
    else current.children.push({ _type: "span", text: t, marks: [...marks] });
  };

  const walk = (node, marks, list) => {
    if (node.nodeType === 3) return addText(decode(node.rawText), marks);
    if (node.nodeType !== 1) return;
    const tag = node.rawTagName?.toLowerCase();
    const cls = node.getAttribute("class") || "";
    if (SKIP.has(tag) || /elementor-icon-list-icon|screen-reader-text/.test(cls)) return;
    if (tag === "a" && /elementor-button/.test(cls)) {
      // Bouton Elementor : gardé comme simple lien dans son propre paragraphe.
      const label = clean(node.text);
      const href = (node.getAttribute("href") || "").trim();
      if (!label) return;
      removedButtons.push(label);
      flush();
      start("normal");
      if (href && !href.startsWith("#")) {
        const def = { _key: key("btn" + href + blocks.length), _type: "link", href: localHref(href) };
        current.markDefs.push(def);
        addText(label, [def._key]);
      } else addText(label, []);
      flush();
      return;
    }
    if (tag === "h1") {
      flush();
      const text = clean(node.text);
      if (text) h1s.push(text);
      if (h1s.length > 1 && text) {
        start("h2");
        addText(text, []);
        flush();
      }
      return;
    }
    if (tag === "img") {
      const src = pickSrc(node);
      const w = Number(node.getAttribute("width") || 0);
      if (!src || /\.svg(\?|$)/.test(src) || (w && w < 120)) return;
      flush();
      const img = { _type: "imageAvecAlt", _key: key("img" + src + blocks.length), src, alt: clean(node.getAttribute("alt") || "") };
      images.push(img);
      blocks.push(img);
      return;
    }
    if (tag === "br") return addText("\n", marks);
    if (tag === "ul" || tag === "ol") {
      flush();
      node.childNodes.forEach((c) => walk(c, marks, tag === "ol" ? "number" : "bullet"));
      flush();
      return;
    }
    if (tag === "li") {
      start("normal", { listItem: list || "bullet", level: 1 });
      node.childNodes.forEach((c) => walk(c, marks, null));
      flush();
      return;
    }
    if (BLOCK_STYLE[tag]) {
      // Un <p> dans un <li> ne doit pas créer de nouveau bloc.
      if (!(tag === "p" && current?.listItem)) start(BLOCK_STYLE[tag]);
      node.childNodes.forEach((c) => walk(c, marks, list));
      if (!current?.listItem) flush();
      return;
    }
    if (tag === "strong" || tag === "b") return node.childNodes.forEach((c) => walk(c, [...marks, "strong"], list));
    if (tag === "a") {
      const href = (node.getAttribute("href") || "").trim();
      if (!href || href.startsWith("#") || href.startsWith("javascript")) return node.childNodes.forEach((c) => walk(c, marks, list));
      if (!current) start("normal");
      const def = { _key: key(href + current.markDefs.length + blocks.length), _type: "link", href: localHref(href) };
      current.markDefs.push(def);
      return node.childNodes.forEach((c) => walk(c, [...marks, def._key], list));
    }
    node.childNodes.forEach((c) => walk(c, marks, list));
    if (/elementor-widget-container/.test(cls) || tag === "div") flush();
  };
  walk(root, [], null);
  flush();

  // Pas deux blocs identiques d'affilée (Elementor duplique parfois mobile/ordinateur).
  const dedup = blocks.filter((b, i) => i === 0 || JSON.stringify(stripKeys(b)) !== JSON.stringify(stripKeys(blocks[i - 1])));
  return { h1s, blocks: dedup, images, removedButtons: removedButtons.filter(Boolean) };
}
const stripKeys = (b) => ({ ...b, _key: undefined, children: b.children?.map((c) => c.text) });

function pickSrc(img) {
  const set = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
  const candidates = set
    .split(",")
    .map((s) => s.trim().split(/\s+/))
    .filter((p) => p[0])
    .sort((a, b) => parseInt(b[1] || "0") - parseInt(a[1] || "0"));
  let src = candidates[0]?.[0] || img.getAttribute("data-src") || img.getAttribute("src") || "";
  if (src.startsWith("data:")) src = img.getAttribute("data-src") || "";
  return src ? new URL(src, WP).href : "";
}

/** Liens internes : on garde l'adresse relative (/vignerons/…) pour le nouveau site. */
function localHref(href) {
  try {
    const u = new URL(href, WP);
    if (/(^|\.)champagnedelaube\.fr$/.test(u.hostname)) return u.pathname + u.search + u.hash;
    return u.href;
  } catch {
    return href;
  }
}

// ---------------------------------------------------------------------------
// Lecture de l'ancien site
// ---------------------------------------------------------------------------
async function wp(path) {
  const res = await fetch(WP + path, { headers: UA });
  if (!res.ok) throw new Error(`${path} : ${res.status}`);
  return res.json();
}
async function seoOf(link) {
  const html = await (await fetch(link, { headers: UA })).text();
  const doc = parse(html);
  const title = clean(doc.querySelector("title")?.text || "").replace(/\s*[-–|]\s*Champagne de l[’']Aube\s*$/i, "").replace(/\s*-\s*$/, "");
  const description = clean(doc.querySelector('meta[name="description"]')?.getAttribute("content") || "");
  return { title, description };
}
async function mediaUrl(id) {
  if (!id) return null;
  try {
    return (await wp(`/wp-json/wp/v2/media/${id}?_fields=source_url,alt_text`)) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Construction des documents
// ---------------------------------------------------------------------------
const TERROIRS = {
  "la-cote-des-bar": { cle: "cote-des-bar", nom: "Côte des Bar" },
  montgueux: { cle: "montgueux", nom: "Montgueux" },
  "villenauxe-la-grande": { cle: "villenauxe", nom: "Villenauxe-la-Grande" },
};
const PAGES = { "tout-savoir-sur-le-champagne": "tout-savoir", "recettes-accords-mets-champagne": "recettes", "vignerons-de-laube-devenez-partenaire-de-nos-degustations": "pro-vignerons" };
const ESPACES = { "champagne-aube": "accueil", "champagne-hotel-restaurants-et-cavistes": "espacePro", "cse-et-cadeaux-dentreprise": "espaceEntreprises", "tasting-troyes": "espaceParticuliers" };

const seoObj = (s) => ({ _type: "seo", title: { fr: s.title }, description: { fr: s.description } });

async function build() {
  const [pages, posts] = await Promise.all([
    wp("/wp-json/wp/v2/pages?per_page=100&status=publish&_fields=id,slug,link,title,content,excerpt,featured_media"),
    wp("/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,slug,link,title,content,excerpt,featured_media,categories,date"),
  ]);
  const docs = [];
  const notes = [];

  for (const p of pages) {
    const c = convert(p.content.rendered);
    const seo = await seoOf(p.link);
    const featured = await mediaUrl(p.featured_media);
    const src = { slug: p.slug, url: p.link, mots: c.blocks.filter((b) => b._type === "block").reduce((n, b) => n + b.children.map((x) => x.text).join("").split(/\s+/).length, 0), images: c.images.length, boutons: c.removedButtons };
    if (TERROIRS[p.slug]) {
      const t = TERROIRS[p.slug];
      const firstImg = c.blocks.find((b) => b._type === "imageAvecAlt");
      docs.push({
        source: src,
        mode: "terroir",
        doc: {
          _id: `drafts.terroir-${t.cle}`,
          _type: "terroir",
          cle: t.cle,
          nom: t.nom,
          accroche: { fr: c.h1s[0] },
          contenu: { fr: c.blocks.filter((b) => b !== firstImg) },
          image: featured ? { _type: "imageAvecAlt", src: featured.source_url, alt: featured.alt_text || "" } : firstImg ? { ...firstImg } : undefined,
          seo: seoObj(seo),
        },
      });
    } else if (PAGES[p.slug]) {
      docs.push({ source: src, mode: "page", doc: { _id: `drafts.page-${PAGES[p.slug]}`, _type: "page", cle: PAGES[p.slug], titre: { fr: c.h1s[0] || decode(p.title.rendered) }, contenu: { fr: c.blocks }, seo: seoObj(seo) } });
    } else if (ESPACES[p.slug]) {
      const reprise = [
        ...(c.h1s[0] ? [{ _type: "block", _key: key("h1" + p.slug), style: "h2", markDefs: [], children: [{ _type: "span", _key: key("h1s" + p.slug), text: `Ancien titre principal : ${c.h1s[0]}`, marks: [] }] }] : []),
        ...c.blocks,
      ];
      docs.push({ source: src, mode: "espace", doc: { _id: `drafts.${ESPACES[p.slug]}`, _type: ESPACES[p.slug], reprise: { fr: reprise }, seo: seoObj(seo) } });
    } else notes.push(`Page non reprise : ${p.slug}`);
  }

  for (const p of posts) {
    const c = convert(p.content.rendered);
    const seo = await seoOf(p.link);
    const featured = await mediaUrl(p.featured_media);
    const rubrique = p.categories.includes(18) || /cepage|labels/.test(p.slug) ? "comprendre" : "recettes";
    const body = c.blocks;
    // Le premier H1 du contenu répète souvent le titre : il n'est pas repris dans le texte.
    docs.push({
      source: { slug: p.slug, url: p.link, images: c.images.length, boutons: c.removedButtons, h1s: c.h1s },
      mode: "article",
      doc: {
        _id: `drafts.article-${p.slug}`.slice(0, 120),
        _type: "article",
        titre: { fr: decode(p.title.rendered) },
        slug: { _type: "slug", current: p.slug },
        rubrique,
        date: p.date.slice(0, 10),
        extrait: { fr: clean(decode(p.excerpt.rendered.replace(/<[^>]+>/g, " "))).replace(/\s*\[…\]\s*$/, "…") },
        image: featured ? { _type: "imageAvecAlt", src: featured.source_url, alt: featured.alt_text || "" } : undefined,
        contenu: { fr: body },
        collaborationCommerciale: false,
        seo: seoObj(seo),
      },
    });
  }

  // Les Riceys n'avait pas de page : fiche vide créée pour la compléter.
  docs.push({ source: { slug: "(aucune page)", url: "" }, mode: "terroir", doc: { _id: "drafts.terroir-les-riceys", _type: "terroir", cle: "les-riceys", nom: "Les Riceys" } });
  return { docs, notes };
}

// ---------------------------------------------------------------------------
// Repérage des passages à relire pour la loi Évin
// ---------------------------------------------------------------------------
const EVIN = [
  [/\b(sublim\w*)/i, "Valorisation subjective du produit (« sublimer ») : préférer une description factuelle de l'accord."],
  [/\b(f[êe]te\w*|festi\w*|f[êe]ter)/i, "Association au caractère festif : la loi Évin interdit d'associer l'alcool à la fête."],
  [/\b(c[ée]l[ée]br\w*)/i, "Association à la célébration / à la fête."],
  [/\b(offr(ez|ir|ons)|offrez-vous|cadeau id[ée]al)/i, "Incitation à l'achat ou au don."],
  [/\b(plaisir\w*|bonheur|euphori\w*|ivresse|enivr\w*|griser?\w*)/i, "Évocation d'un effet ou d'un plaisir lié à la consommation."],
  [/\b(s[ée]duction|s[ée]dui\w+|sensuel\w*|sexy|glamour)/i, "Association à la séduction."],
  [/\b(r[ée]ussite|succ[èe]s|prestig\w*|luxe|luxueu\w*|[ée]lite)/i, "Association à la réussite sociale ou au prestige."],
  [/\b(irr[ée]sistibl\w*|incontournabl\w*|inoubliabl\w*|magiqu\w*|exceptionnel\w*|d'exception|ultime)/i, "Superlatif valorisant : à remplacer par un fait (terroir, cépage, méthode)."],
  [/\b(savourez|d[ée]gustez|buvez|trinquez|craquez|laissez-vous|n'h[ée]sitez pas)/i, "Formule incitative à l'impératif."],
  [/\b(sans mod[ée]ration|[àa] volont[ée]|ap[ée]ro\w*)/i, "Incitation à la consommation."],
  [/\b(bulles? de joie|p[ée]tillant de joie|explosion)/i, "Image hédoniste."],
];
function evinReview(docs) {
  const out = [];
  for (const d of docs) {
    const blocks = [...(d.doc.contenu?.fr ?? []), ...(d.doc.reprise?.fr ?? [])].filter((b) => b._type === "block");
    const texts = [
      ...blocks.map((b) => b.children.map((c) => c.text).join("")),
      d.doc.seo?.description?.fr,
      d.doc.seo?.title?.fr,
      d.doc.accroche?.fr,
      d.doc.titre?.fr,
      d.doc.extrait?.fr,
    ].filter(Boolean);
    for (const text of texts) {
      for (const sentence of text.split(/(?<=[.!?…])\s+/)) {
        for (const [re, why] of EVIN) {
          const m = sentence.match(re);
          if (m) {
            out.push({ document: d.doc._id.replace("drafts.", ""), source: d.source.url, passage: clean(sentence), mot: m[0], pourquoi: why });
            break;
          }
        }
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Écriture dans Sanity (brouillons)
// ---------------------------------------------------------------------------
const token = process.env.SANITY_WRITE_TOKEN || "fourni-par-le-proxy";
async function sanity(path, init = {}) {
  const res = await fetch(API + path, { ...init, headers: { authorization: `Bearer ${token}`, ...init.headers } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Sanity ${path} : ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}
const uploaded = new Map();
const missingImages = [];
async function upload(src, alt) {
  if (!src) return undefined;
  if (missingImages.includes(src)) return undefined;
  if (!uploaded.has(src)) {
    const original = src.replace(/-\d+x\d+(\.\w+)(\?.*)?$/, "$1");
    let res = await fetch(original, { headers: UA });
    if (!res.ok) res = await fetch(src, { headers: UA });
    if (!res.ok) {
      // Image cassée sur l'ancien site : on la saute et on la signale.
      missingImages.push(src);
      return undefined;
    }
    const type = res.headers.get("content-type") || "image/jpeg";
    const name = decodeURIComponent(new URL(res.url).pathname.split("/").pop());
    const asset = await sanity(`/assets/images/${DATASET}?filename=${encodeURIComponent(name)}`, { method: "POST", headers: { "content-type": type }, body: Buffer.from(await res.arrayBuffer()) });
    uploaded.set(src, asset.document._id);
  }
  return { _type: "imageAvecAlt", asset: { _type: "reference", _ref: uploaded.get(src) }, ...(alt ? { alt: { fr: alt } } : {}) };
}
async function withAssets(blocks = []) {
  const out = [];
  for (const b of blocks) {
    if (b._type !== "imageAvecAlt") out.push(b);
    else {
      const img = await upload(b.src, b.alt);
      if (img) out.push({ ...img, _key: b._key });
    }
  }
  return out;
}

async function write(docs) {
  const existing = await sanity(`/data/query/${DATASET}?query=${encodeURIComponent('*[_type in ["terroir","page","article","accueil","espacePro","espaceEntreprises","espaceParticuliers"]]{_id,_type,cle,"slug":slug.current}')}`);
  const report = [];
  for (const { doc, mode } of docs) {
    const d = structuredClone(doc);
    for (const field of ["contenu", "reprise"]) if (d[field]?.fr) d[field] = { _type: "localeRichText", fr: await withAssets(d[field].fr) };
    if (d.image) d.image = await upload(d.image.src, d.image.alt);
    for (const f of ["accroche", "titre"]) if (d[f]) d[f] = { _type: "localeString", ...d[f] };
    if (d.extrait) d.extrait = { _type: "localeText", ...d.extrait };
    if (d.seo) d.seo = { _type: "seo", title: { _type: "localeString", ...d.seo.title }, description: { _type: "localeText", ...d.seo.description } };
    for (const k of Object.keys(d)) if (d[k] === undefined) delete d[k];

    // Un document existe déjà pour ce terroir / cette page / cet article ? On ne l'écrase pas.
    const clash = existing.result.find(
      (e) =>
        e._id.replace(/^drafts\./, "") !== d._id.replace(/^drafts\./, "") &&
        e._type === d._type &&
        ((d.cle && e.cle === d.cle) || (d.slug && e.slug === d.slug.current)),
    );
    let mutations;
    if (mode === "espace") {
      // Documents uniques : on ne touche qu'aux champs vides (reprise, référencement).
      mutations = [{ createIfNotExists: { _id: d._id, _type: d._type } }, { patch: { id: d._id, setIfMissing: { reprise: d.reprise, ...(d.seo ? { seo: d.seo } : {}) } } }];
    } else if (clash) {
      report.push(`${d._id} : non créé, un document « ${clash._id} » existe déjà pour ${d.cle || d.slug.current}`);
      continue;
    } else {
      mutations = [{ createIfNotExists: { _id: d._id, _type: d._type } }, { patch: { id: d._id, setIfMissing: Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith("_"))) } }];
    }
    await sanity(`/data/mutate/${DATASET}?returnIds=true`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mutations }) });
    report.push(`${d._id} : OK`);
  }
  return report;
}

// ---------------------------------------------------------------------------
const { docs, notes } = await build();
mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, "plan.json"), JSON.stringify({ docs, notes }, null, 1));
const evin = evinReview(docs);
writeFileSync(resolve(OUT, "evin.json"), JSON.stringify(evin, null, 1));
console.log(`${docs.length} documents préparés · ${docs.reduce((n, d) => n + (d.source.images ?? 0), 0)} images · ${evin.length} passages à relire (loi Évin)`);
for (const d of docs) console.log(`  ${d.mode.padEnd(8)} ${d.doc._id.padEnd(70)} ← ${d.source.url || d.source.slug}`);
notes.forEach((n) => console.log("  ! " + n));
if (WRITE) {
  const report = await write(docs);
  console.log(`\nÉcriture dans Sanity (${uploaded.size} images téléversées) :`);
  report.forEach((r) => console.log("  " + r));
  if (missingImages.length) {
    console.log(`\nImages introuvables sur l'ancien site (non reprises) :`);
    missingImages.forEach((m) => console.log("  " + m));
  }
}
