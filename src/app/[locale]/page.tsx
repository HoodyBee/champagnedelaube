import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";
import { cepages, logos, pictos, terroirs } from "@/lib/brand";
import tokens from "../../../tokens.json";

// PAGE TEMPORAIRE : elle sert uniquement à vérifier que la charte (couleurs,
// polices, logos, pictos) et le multilingue sont bien en place. Elle sera
// remplacée par la vraie page d'accueil à l'étape 5.

const palette = [
  ["blanc", "Fond principal"],
  ["creme-clair", "Touches de chaleur"],
  ["filet", "Filet doré"],
  ["creme", "Logo, rares accents"],
  ["or", "Aplats, bandeau"],
  ["bronze", "Texte doré"],
  ["anthracite", "Encre"],
  ["gris-chaud", "Texte secondaire"],
  ["champagne", "Rond de l'avatar"],
  ["bleu-nuit", "Haut de gamme"],
] as const;

const terroirColors = [
  ["story-cote-des-bar", "Côte des Bar"],
  ["story-riceys", "Les Riceys"],
  ["story-montgueux", "Montgueux"],
  ["story-villenauxe", "Villenauxe"],
] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { alternates: localizedAlternates("/", locale), robots: robotsFor(locale) };
}

export default async function CharteTemporaire({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("charte");
  const tLegal = await getTranslations("legal");

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
        <p className="mt-space-3 text-sur-titre text-bronze">{t("eyebrow")}</p>
        <h1 className="mt-space-2 text-titre-post">{t("title")}</h1>
        <p className="mt-space-2 max-w-prose text-gris-chaud">{t("intro")}</p>

        <nav aria-label={t("otherLanguages")} className="mt-space-3">
          <ul className="flex flex-wrap justify-center gap-space-1">
            {routing.locales.map((l) => (
              <li key={l}>
                <Link
                  href="/"
                  locale={l}
                  lang={l}
                  aria-current={l === locale ? "page" : undefined}
                  className={`inline-block rounded-etiquette border px-space-2 py-space-1 text-sur-titre ${
                    l === locale
                      ? "border-anthracite bg-anthracite text-blanc"
                      : "border-filet text-anthracite hover:border-bronze"
                  }`}
                >
                  {localeNames[l]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="mt-space-5" aria-labelledby="typo">
        <h2 id="typo" className="text-titre-section">Typographie</h2>
        <div className="surface-chaude mt-space-3 space-y-space-2 rounded-carte p-space-3 sm:p-space-4">
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
          <p className="text-legende text-gris-chaud">{tLegal("health")}</p>
        </div>
      </section>

      <section className="mt-space-5" aria-labelledby="couleurs">
        <h2 id="couleurs" className="text-titre-section">Couleurs</h2>
        <p className="mt-space-1 text-gris-chaud">
          Fond principal blanc. Les touches de chaleur sont en crème clair, toujours bordées d&apos;un filet doré.
        </p>
        <ul className="mt-space-3 grid grid-cols-2 gap-space-2 sm:grid-cols-5">
          {palette.map(([name, role]) => (
            <li key={name} className="overflow-hidden rounded-carte border border-filet bg-blanc">
              <div
                className="h-20 border-b border-filet"
                style={{ backgroundColor: `var(--color-${name})` }}
              />
              <p className="px-space-2 pt-space-1 text-sur-titre">{name}</p>
              <p className="px-space-2 text-legende text-gris-chaud">{tokens.color[name].value}</p>
              <p className="px-space-2 pb-space-2 text-legende">{role}</p>
            </li>
          ))}
        </ul>

        <div className="mt-space-4 grid gap-space-2 sm:grid-cols-2">
          <div className="rounded-carte border border-filet bg-blanc p-space-3">
            <p className="text-sur-titre text-bronze">Sur blanc</p>
            <p className="mt-space-1 text-accroche text-bronze">Titre doré en bronze</p>
            <p className="mt-space-1">Texte courant anthracite (16,6:1).</p>
            <p className="text-gris-chaud">Texte secondaire gris chaud (7,2:1).</p>
          </div>
          <div className="surface-chaude rounded-carte p-space-3">
            <p className="text-sur-titre text-bronze">Encadré crème clair + filet</p>
            <p className="mt-space-1 text-accroche text-bronze">Titre doré en bronze</p>
            <p className="mt-space-1">Texte courant anthracite (16,2:1).</p>
            <p className="text-gris-chaud">Texte secondaire gris chaud (7,1:1).</p>
          </div>
        </div>

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

      <section className="surface-chaude mt-space-5 rounded-carte p-space-3 sm:p-space-4" aria-labelledby="pictos">
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

      <footer className="mt-space-5 border-t border-filet pt-space-3 text-center">
        <p className="text-legende text-gris-chaud">{tLegal("health")}</p>
      </footer>
    </main>
  );
}
