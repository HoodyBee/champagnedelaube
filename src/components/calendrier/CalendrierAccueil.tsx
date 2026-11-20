"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { COULEUR_CATEGORIE, couvre, estExterne, type DateCalendrierVue } from "@/lib/calendrier";
import type { CategorieCalendrier } from "@/sanity/content";

type Textes = {
  categories: Record<CategorieCalendrier, string>;
  precedent: string;
  suivant: string;
  prochaines: string;
  voirTout: string;
  aucuneProchaine: string;
  legende: string;
  aConfirmer: string;
  fermer: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const moisCle = (y: number, m: number) => `${y}-${pad(m + 1)}`;
const ajouterMois = (cle: string, n: number) => {
  const [y, m] = cle.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return moisCle(d.getUTCFullYear(), d.getUTCMonth());
};
const pasDAbonnement = () => () => {};
const aujourdhuiParis = () => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());

/**
 * Petit calendrier de l'accueil : mes événements (pastille or) et les journées du marronnier
 * (pastille de leur catégorie). Ordinateur : deux mois côte à côte ; mobile : un mois, flèches ou glissement.
 * Au clic (ou au survol) d'un jour : le nom de la journée ou de l'événement, avec son lien.
 */
export function CalendrierAccueil({
  dates,
  locale,
  textes,
  hrefTout,
  aujourdhuiServeur,
}: {
  dates: DateCalendrierVue[];
  locale: string;
  textes: Textes;
  hrefTout: string;
  aujourdhuiServeur: string;
}) {
  // Premier mois affiché : le mois en cours, ou le mois de la prochaine date s'il n'y a rien d'ici là.
  const moisDeDepart = (t: string) => {
    const prochaine = dates.find((d) => d.fin >= t);
    const suivant = ajouterMois(t.slice(0, 7), 1);
    return prochaine && prochaine.debut.slice(0, 7) > suivant ? ajouterMois(prochaine.debut.slice(0, 7), 0) : t.slice(0, 7);
  };
  // La page peut être servie depuis le cache : la date du jour est relue chez le visiteur.
  const aujourdhui = useSyncExternalStore(
    pasDAbonnement,
    aujourdhuiParis,
    () => aujourdhuiServeur,
  );
  // Mois affiché = mois de départ + décalage choisi avec les flèches.
  const [decalage, setDecalage] = useState(0);
  const [jourActif, setJourActif] = useState<string | null>(null);
  const touchX = useRef<number | null>(null);

  const derniers = useMemo(() => dates.reduce((max, d) => (d.fin.slice(0, 7) > max ? d.fin.slice(0, 7) : max), aujourdhui.slice(0, 7)), [dates, aujourdhui]);
  const premier = aujourdhui.slice(0, 7);
  const depart = moisDeDepart(aujourdhui);
  const debut = ajouterMois(depart, decalage);
  const peutReculer = debut > premier;
  const peutAvancer = debut < derniers;
  const aller = (n: number) => {
    setJourActif(null);
    const s = ajouterMois(debut, n);
    if (s >= premier && s <= derniers) setDecalage((d) => d + n);
  };

  const prochaines = useMemo(() => {
    const futures = dates.filter((d) => d.fin >= aujourdhui);
    const evts = futures.filter((d) => d.categorie === "evenements").slice(0, 3);
    const journees = futures.filter((d) => d.categorie !== "evenements").slice(0, 5 - evts.length);
    return [...evts, ...journees];
  }, [dates, aujourdhui]);

  const fmtMois = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const fmtJourLong = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  const jours = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i))),
  );

  const mois = (cle: string, className = "") => {
    const [y, m] = cle.split("-").map(Number);
    const premierJour = new Date(Date.UTC(y, m - 1, 1));
    const decalage = (premierJour.getUTCDay() + 6) % 7; // lundi en premier
    const nbJours = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const titre = fmtMois.format(premierJour);
    return (
      <div key={cle} className={className}>
        <p className="text-center font-serif text-[1.125rem] font-bold">{titre.charAt(0).toUpperCase() + titre.slice(1)}</p>
        <div role="grid" aria-label={titre} className="mt-space-1 grid grid-cols-7 gap-0.5 text-center">
          <div role="row" className="contents">
            {jours.map((j, i) => (
              <span role="columnheader" key={i} className="py-1 text-sur-titre-petit text-gris-chaud">
                {j}
              </span>
            ))}
          </div>
          <div role="row" className="contents">
            {Array.from({ length: decalage }, (_, i) => (
              <span key={`v${i}`} role="gridcell" />
            ))}
            {Array.from({ length: nbJours }, (_, i) => {
              const jour = `${cle}-${pad(i + 1)}`;
              const items = dates.filter((d) => couvre(d, jour));
              const estAujourdhui = jour === aujourdhui;
              const passe = jour < aujourdhui;
              const cats = [...new Set(items.map((d) => d.categorie))].slice(0, 3);
              if (!items.length) {
                return (
                  <span
                    key={jour}
                    role="gridcell"
                    className={`flex h-10 flex-col items-center justify-center rounded-etiquette text-[0.875rem] ${passe ? "text-gris-chaud/50" : "text-gris-chaud"} ${estAujourdhui ? "ring-1 ring-or" : ""}`}
                  >
                    {i + 1}
                  </span>
                );
              }
              const label = `${fmtJourLong.format(new Date(`${jour}T00:00:00Z`))} : ${items.map((d) => d.titre).join(", ")}`;
              return (
                <span key={jour} role="gridcell" className="relative">
                  <button
                    type="button"
                    aria-label={label}
                    aria-expanded={jourActif === jour}
                    onClick={() => setJourActif((a) => (a === jour ? null : jour))}
                    onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setJourActif(jour)}
                    className={`flex h-10 w-full flex-col items-center justify-center rounded-etiquette text-[0.875rem] font-bold transition-colors hover:bg-creme ${
                      jourActif === jour ? "bg-creme" : ""
                    } ${estAujourdhui ? "ring-1 ring-or" : ""} ${passe ? "opacity-60" : ""}`}
                  >
                    {i + 1}
                    <span aria-hidden="true" className="mt-0.5 flex gap-0.5">
                      {cats.map((c) => (
                        <span key={c} className="h-1.5 w-1.5 rounded-rond" style={{ backgroundColor: COULEUR_CATEGORIE[c] }} />
                      ))}
                    </span>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const itemsActifs = jourActif ? dates.filter((d) => couvre(d, jourActif)) : [];

  const ligne = (d: DateCalendrierVue) => (
    <span className="flex items-start gap-space-1">
      <span aria-hidden="true" className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-rond" style={{ backgroundColor: COULEUR_CATEGORIE[d.categorie] }} />
      <span>
        <span className="block text-sur-titre-petit text-gris-chaud">
          {d.dateLabel}
          {d.aConfirmer && ` · ${textes.aConfirmer}`}
        </span>
        {d.lien ? (
          <a
            href={d.lien}
            className="underline decoration-or underline-offset-4 hover:text-bronze"
            {...(estExterne(d.lien) ? { target: "_blank", rel: "noopener" } : {})}
          >
            {d.emoji && <span aria-hidden="true">{d.emoji} </span>}
            {d.titre}
          </a>
        ) : (
          <span>
            {d.emoji && <span aria-hidden="true">{d.emoji} </span>}
            {d.titre}
          </span>
        )}
      </span>
    </span>
  );

  return (
    <div className="grid gap-space-4 lg:grid-cols-[1.6fr_1fr] lg:gap-space-5">
      <div
        className="rounded-carte border border-filet bg-blanc p-space-2 sm:p-space-3"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) aller(dx < 0 ? 1 : -1);
        }}
        onMouseLeave={() => window.matchMedia("(hover: hover)").matches && setJourActif(null)}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => aller(-1)}
            disabled={!peutReculer}
            aria-label={textes.precedent}
            className="inline-flex h-10 w-10 items-center justify-center rounded-rond border border-filet transition-colors hover:border-or disabled:opacity-30"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => aller(1)}
            disabled={!peutAvancer}
            aria-label={textes.suivant}
            className="inline-flex h-10 w-10 items-center justify-center rounded-rond border border-filet transition-colors hover:border-or disabled:opacity-30"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div aria-live="polite" className="mt-space-1 grid gap-space-3 md:grid-cols-2">
          {mois(debut)}
          {mois(ajouterMois(debut, 1), "hidden md:block")}
        </div>

        {/* Détail du jour choisi */}
        <div className="mt-space-2 min-h-[3.5rem] border-t border-filet pt-space-2" aria-live="polite">
          {itemsActifs.length > 0 ? (
            <div className="flex items-start justify-between gap-space-2">
              <ul className="space-y-space-1">
                {itemsActifs.map((d) => (
                  <li key={d.id}>
                    {ligne(d)}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setJourActif(null)} className="text-sur-titre-petit text-gris-chaud hover:text-bronze">
                {textes.fermer}
              </button>
            </div>
          ) : (
            <ul aria-label={textes.legende} className="flex flex-wrap gap-x-space-2 gap-y-1 text-[0.8125rem] text-gris-chaud">
              {(Object.keys(textes.categories) as CategorieCalendrier[])
                .filter((c) => dates.some((d) => d.categorie === c))
                .map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2 w-2 rounded-rond" style={{ backgroundColor: COULEUR_CATEGORIE[c] }} />
                    {textes.categories[c].replace(/^\S+\s/, "")}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <p className="text-sur-titre text-bronze">{textes.prochaines}</p>
        {prochaines.length ? (
          <ul className="mt-space-2 space-y-space-2">
            {prochaines.map((d) => (
              <li key={d.id} className={d.categorie === "evenements" ? "rounded-carte bg-champagne/40 p-space-1" : ""}>
                {ligne(d)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-space-2 text-gris-chaud">{textes.aucuneProchaine}</p>
        )}
        <a href={hrefTout} className="mt-space-3 inline-flex items-center gap-space-1 text-sur-titre-petit hover:text-bronze">
          {textes.voirTout} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
