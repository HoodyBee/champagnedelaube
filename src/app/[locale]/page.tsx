import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { localizedAlternates, robotsFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { cepages, logos, pictos, terroirs } from "@/lib/brand";
import { Arguments } from "@/components/ui/Arguments";
import { Chiffres } from "@/components/ui/Chiffres";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { EntreeCard } from "@/components/ui/EntreeCard";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { Section } from "@/components/ui/Section";
import { nav } from "@/lib/site";
import tokens from "../../../tokens.json";

// Contenus d'exemple de l'aperçu (seront remplacés par Sanity). Domaines : uniquement
// les informations fournies par le client.
const philosophies: Record<"moutard" | "mennetrier", Record<Locale, string>> = {
  moutard: {
    fr: "Cinq générations à Polisy. Corinne Moutard dirige le domaine depuis 1985 avec Christophe Dangin ; Camille et Arnaud Dangin forment la nouvelle génération.",
    en: "Five generations in Polisy. Corinne Moutard has run the estate since 1985 with Christophe Dangin; Camille and Arnaud Dangin are the new generation.",
    nl: "Vijf generaties in Polisy. Corinne Moutard leidt het domein sinds 1985 samen met Christophe Dangin; Camille en Arnaud Dangin vormen de nieuwe generatie.",
    it: "Cinque generazioni a Polisy. Corinne Moutard guida la tenuta dal 1985 con Christophe Dangin; Camille e Arnaud Dangin sono la nuova generazione.",
    de: "Fünf Generationen in Polisy. Corinne Moutard leitet das Weingut seit 1985 gemeinsam mit Christophe Dangin; Camille und Arnaud Dangin sind die neue Generation.",
  },
  mennetrier: {
    fr: "Du raisin à la bouteille, tout se fait au domaine : vendanges manuelles, pressurage doux, cuves inox thermorégulées.",
    en: "From grape to bottle, everything happens at the estate: hand harvesting, gentle pressing, temperature-controlled stainless steel tanks.",
    nl: "Van druif tot fles gebeurt alles op het domein: handmatige pluk, zachte persing, temperatuurgestuurde roestvrijstalen tanks.",
    it: "Dall'uva alla bottiglia, tutto avviene in tenuta: vendemmia manuale, pressatura soffice, vasche inox termoregolate.",
    de: "Von der Traube bis zur Flasche geschieht alles auf dem Weingut: Handlese, schonende Pressung, temperaturgesteuerte Edelstahltanks.",
  },
};

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
  ["story-villenauxe", "Villenauxe-la-Grande"],
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
  const tHome = await getTranslations("home");
  const tPro = await getTranslations("pro.arguments");
  const tUi = await getTranslations("ui");

  return (
    <div className="mx-auto max-w-5xl px-space-2 py-space-5 sm:px-space-4">
      <header className="flex flex-col items-center text-center">
        <Image
          src={logos.rondBandeau.src}
          alt={logos.rondBandeau.alt}
          width={260}
          height={260}
          priority
          sizes="260px"
        />
        <p className="mt-space-3 text-sur-titre text-bronze">{t("eyebrow")}</p>
        <h1 className="mt-space-2 text-titre-post">{t("title")}</h1>
        <p className="mt-space-2 max-w-prose text-gris-chaud">{t("intro")}</p>

      </header>

      <section className="mt-space-5" aria-labelledby="typo">
        <h2 id="typo" className="text-titre-section">Typographie</h2>
        <div className="surface-chaude mt-space-3 space-y-space-2 rounded-carte p-space-3 sm:p-space-4">
          <p className="text-titre-logo">Champagne</p>
          <p className="inline-block bg-or px-space-2 py-space-1 text-bandeau text-blanc">De l&apos;Aube</p>
          <p className="text-sur-titre text-bronze">Côte des Bar · Les Riceys · Montgueux · Villenauxe-la-Grande</p>
          <p className="text-accroche">Et si le plus beau champagne se cachait au sud ?</p>
          <p className="text-corps max-w-prose">
            Texte courant en Vollkorn Medium, 16 px, interligne 1,55. Une idée par phrase. Des mots simples :
            vif, gourmand, minéral.
          </p>
          <p className="text-corps">
            Terroirs et champagnes de caractère
            <span className="block text-traduction text-gris-chaud">Terroirs and champagnes of character</span>
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


      {/* ---- Aperçu des composants (étape 5) ---- */}
      <div className="-mx-space-2 mt-space-5 sm:-mx-space-4">
        <Chiffres
          items={[
            { valeur: "4", label: tHome("chiffres.terroirs") },
            { valeur: "10", label: tHome("chiffres.domaines") },
            { valeur: "6–13", label: tHome("chiffres.personnes") },
            { valeur: "90 min", label: tHome("chiffres.duree") },
          ]}
        />
        <Section titre={tHome("heroTitre")} surTitre="Côte des Bar · Les Riceys · Montgueux · Villenauxe-la-Grande">
          <div className="grid gap-space-3 md:grid-cols-3">
            {(["pro", "entreprises", "particuliers"] as const).map((k) => (
              <EntreeCard
                key={k}
                href={k === "pro" ? nav.pro[0].href : k === "entreprises" ? nav.entreprises.href : nav.particuliers[0].href}
                surTitre={tHome(`${k}.surTitre`)}
                titre={tHome(`${k}.titre`)}
                texte={tHome(`${k}.texte`)}
                bouton={tHome(`${k}.bouton`)}
                placeholderLabel={tUi("photoSoon")}
              />
            ))}
          </div>
        </Section>
        <Section fond="chaude" titre={tHome("pro.titre")} surTitre={tHome("pro.surTitre")}>
          <Arguments
            items={[
              { icone: "tarif", titre: tPro("tarifs.titre"), texte: tPro("tarifs.texte") },
              { icone: "interlocuteur", titre: tPro("interlocuteur.titre"), texte: tPro("interlocuteur.texte") },
              { icone: "degustation", titre: tPro("degustation.titre"), texte: tPro("degustation.texte") },
            ]}
          />
        </Section>
        <Section titre={tHome("particuliers.titre")} surTitre={tHome("particuliers.surTitre")} align="gauche">
          <div className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            <ExperienceCard experience={{ slug: "atelier-decouverte", titre: "L'Atelier Découverte", etiquette: "nouveau", duree: "90 min", participantsMin: 6, participantsMax: 13, lieu: "Troyes", animateur: { nom: "Julien Mineo" } }} />
            <ExperienceCard experience={{ slug: "accords-mets-champagnes", titre: "Accords mets & champagnes", duree: "90 min", participantsMin: 6, participantsMax: 13, lieu: "Troyes" }} />
            <ExperienceCard experience={{ slug: "degustation-sur-mesure", titre: "Dégustation sur-mesure", etiquette: "sur-mesure", lieu: "Troyes" }} />
          </div>
        </Section>
        <Section fond="chaude" titre={tHome("pro.titre")} align="gauche">
          <div className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
            <DomaineCard domaine={{ slug: "moutard-dangin", nom: "Champagne Moutard-Dangin", village: "Polisy", terroir: "cote-des-bar", philosophie: philosophies.moutard[locale] }} />
            <DomaineCard domaine={{ slug: "mennetrier", nom: "Champagne Mennetrier", village: "Arrentières", terroir: "cote-des-bar", philosophie: philosophies.mennetrier[locale], labels: ["HVE", "Viticulture durable en Champagne"] }} />
          </div>
        </Section>
      </div>
    </div>
  );
}
