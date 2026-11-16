import Image from "next/image";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { cepages, logos, pictos, terroirs } from "@/lib/brand";
import tokens from "../../tokens.json";

// PAGE TEMPORAIRE (étape 2) : elle sert uniquement à vérifier que la charte
// (couleurs, polices, logos, pictos) est bien en place. Elle sera remplacée par
// la vraie page d'accueil à l'étape 5.

const palette = ["or", "bronze", "creme", "champagne", "anthracite", "bleu-nuit", "gris-chaud"] as const;
const terroirColors = [
  ["story-cote-des-bar", "Côte des Bar"],
  ["story-riceys", "Les Riceys"],
  ["story-montgueux", "Montgueux"],
  ["story-villenauxe", "Villenauxe"],
] as const;

export default function CharteTemporaire() {
  return (
    <main className="mx-auto max-w-5xl px-space-2 py-space-5 sm:px-space-4">
      <header className="flex flex-col items-center text-center">
        <Image
          src={logos.principal.src}
          alt={logos.principal.alt}
          width={280}
          height={280}
          priority
          sizes="280px"
        />
        <p className="mt-space-3 text-sur-titre text-bronze">Site en construction · Contrôle de la charte</p>
        <h1 className="mt-space-2 text-titre-post">Le champagne de l&apos;Aube, vigneron par vigneron</h1>
        <p className="mt-space-2 max-w-prose text-gris-chaud">
          Cette page temporaire montre les couleurs, les polices et les pictogrammes de la marque tels
          qu&apos;ils seront utilisés sur le futur site.
        </p>
      </header>

      <section className="mt-space-5" aria-labelledby="typo">
        <h2 id="typo" className="text-titre-section">Typographie</h2>
        <div className="mt-space-3 space-y-space-2 border-t border-or pt-space-3">
          <p className="text-titre-logo">Champagne</p>
          <p className="inline-block bg-or px-space-2 py-space-1 text-bandeau text-blanc">De l&apos;Aube</p>
          <p className="text-sur-titre text-bronze">Côte des Bar · Les Riceys · Montgueux · Villenauxe</p>
          <p className="text-accroche">Et si le plus beau champagne se cachait au sud ?</p>
          <p className="text-corps max-w-prose">
            Texte courant en Vollkorn Medium, 16 px, interligne 1,55. Une idée par phrase. Des mots simples :
            vif, gourmand, minéral.
          </p>
          <p className="text-corps">
            Terroirs &amp; émotions
            <span className="block text-traduction text-gris-chaud">Terroirs &amp; emotions</span>
          </p>
          <p className="text-legende text-gris-chaud">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
          </p>
        </div>
      </section>

      <section className="mt-space-5" aria-labelledby="couleurs">
        <h2 id="couleurs" className="text-titre-section">Couleurs</h2>
        <ul className="mt-space-3 grid grid-cols-2 gap-space-2 sm:grid-cols-4">
          {palette.map((name) => (
            <li key={name} className="overflow-hidden rounded-carte border border-champagne bg-blanc">
              <div className="h-20" style={{ backgroundColor: `var(--color-${name})` }} />
              <p className="px-space-2 pt-space-1 text-sur-titre">{name}</p>
              <p className="px-space-2 pb-space-2 text-legende text-gris-chaud">
                {tokens.color[name].value}
              </p>
            </li>
          ))}
        </ul>
        <ul className="mt-space-3 grid grid-cols-2 gap-space-2 sm:grid-cols-4">
          {terroirColors.map(([token, label]) => (
            <li
              key={token}
              className="flex h-24 items-end rounded-carte p-space-2 text-accroche text-blanc"
              style={{ backgroundColor: `var(--color-${token})` }}
            >
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-space-5" aria-labelledby="terroirs">
        <h2 id="terroirs" className="text-titre-section">Terroirs</h2>
        <ul className="mt-space-3 flex flex-wrap gap-space-2">
          {Object.entries(terroirs).map(([key, asset]) => (
            <li key={key}><BrandBadge asset={asset} size={96} /></li>
          ))}
        </ul>
      </section>

      <section className="mt-space-5" aria-labelledby="pictos">
        <h2 id="pictos" className="text-titre-section">Pictos thématiques</h2>
        <ul className="mt-space-3 flex flex-wrap gap-space-2">
          {Object.entries(pictos).map(([key, asset]) => (
            <li key={key}><BrandBadge asset={asset} size={96} /></li>
          ))}
        </ul>
      </section>

      <section className="mt-space-5" aria-labelledby="cepages">
        <h2 id="cepages" className="text-titre-section">Cépages</h2>
        <ul className="mt-space-3 flex flex-wrap gap-space-2">
          {Object.entries(cepages).map(([key, asset]) => (
            <li key={key}><BrandBadge asset={asset} size={96} /></li>
          ))}
        </ul>
      </section>

      <footer className="mt-space-5 border-t border-or pt-space-3 text-center">
        <p className="text-legende text-gris-chaud">
          L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
        </p>
      </footer>
    </main>
  );
}
