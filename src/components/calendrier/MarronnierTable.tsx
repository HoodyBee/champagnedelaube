"use client";

import { useMemo, useState } from "react";
import { COULEUR_CATEGORIE, estExterne, type DateCalendrierVue } from "@/lib/calendrier";
import type { CategorieCalendrier } from "@/sanity/content";

/** Libellé de catégorie sans son emoji (la pastille de couleur suffit dans le tableau). */
const sansEmoji = (s: string) => s.replace(/^\S+\s+/, "");

type Textes = {
  categories: Record<CategorieCalendrier, string>;
  filtreCategorie: string;
  filtreMois: string;
  toutes: string;
  tousLesMois: string;
  colDate: string;
  colJournee: string;
  colCategorie: string;
  colAnecdote: string;
  aConfirmer: string;
  aucune: string;
  /** « {count} dates » : le nombre est inséré à la place de # */
  resultats: string[];
  lienExterne: string;
  lienInterne: string;
};

/**
 * Tableau du marronnier, filtrable par catégorie et par mois.
 * Ordinateur : un tableau, avec un intertitre par mois. Mobile : des cartes empilées.
 */
export function MarronnierTable({ dates, locale, textes, annee }: { dates: DateCalendrierVue[]; locale: string; textes: Textes; annee?: number }) {
  const [categorie, setCategorie] = useState<CategorieCalendrier | "">("");
  const [mois, setMois] = useState("");

  const dansAnnee = useMemo(() => (annee ? dates.filter((d) => d.debut.startsWith(String(annee)) || d.fin.startsWith(String(annee))) : dates), [dates, annee]);
  const categories = (Object.keys(textes.categories) as CategorieCalendrier[]).filter((c) => dansAnnee.some((d) => d.categorie === c));
  const moisDispo = [...new Set(dansAnnee.map((d) => d.mois))].sort();
  const nomMois = (m: string) => {
    const s = new Intl.DateTimeFormat(locale, { month: "long", year: annee ? undefined : "numeric", timeZone: "UTC" }).format(new Date(`${m}-01T00:00:00Z`));
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const visibles = dansAnnee.filter((d) => (!categorie || d.categorie === categorie) && (!mois || d.mois === mois));
  const parMois = moisDispo.map((m) => ({ m, items: visibles.filter((d) => d.mois === m) })).filter((g) => g.items.length);
  const compte = visibles.length === 0 ? textes.resultats[0] : visibles.length === 1 ? textes.resultats[1] : textes.resultats[2].replace("#", String(visibles.length));

  const titre = (d: DateCalendrierVue) => (
    <>
      <span className="font-bold">
        {d.emoji && <span aria-hidden="true">{d.emoji} </span>}
        {d.lien ? (
          <a
            href={d.lien}
            className="underline decoration-or underline-offset-4 hover:text-bronze"
            {...(estExterne(d.lien) ? { target: "_blank", rel: "noopener" } : {})}
          >
            {d.titre}
            <span className="sr-only"> ({estExterne(d.lien) ? textes.lienExterne : textes.lienInterne})</span>
          </a>
        ) : (
          d.titre
        )}
      </span>
      {d.aConfirmer && (
        <span className="ml-space-1 inline-block rounded-etiquette border border-or px-1.5 align-middle text-sur-titre-petit text-bronze">{textes.aConfirmer}</span>
      )}
      {d.regle && <span className="mt-0.5 block text-legende text-gris-chaud">{d.regle}</span>}
    </>
  );
  const pastille = (c: CategorieCalendrier) => (
    <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-rond" style={{ backgroundColor: COULEUR_CATEGORIE[c] }} />
  );

  return (
    <div className="not-prose my-space-4">
      {/* Filtres */}
      <div className="rounded-carte border border-filet bg-creme-clair p-space-2 sm:p-space-3">
        <fieldset>
          <legend className="text-sur-titre-petit text-bronze">{textes.filtreCategorie}</legend>
          <div className="mt-space-1 flex flex-wrap gap-space-1">
            {[["", textes.toutes] as const, ...categories.map((c) => [c, textes.categories[c]] as const)].map(([c, label]) => (
              <button
                key={c || "toutes"}
                type="button"
                aria-pressed={categorie === c}
                onClick={() => setCategorie(c as CategorieCalendrier | "")}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-etiquette border px-space-1 text-[0.9375rem] transition-colors ${
                  categorie === c ? "border-anthracite bg-anthracite text-blanc" : "border-filet bg-blanc hover:border-or"
                }`}
              >
                {c && pastille(c as CategorieCalendrier)}
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-space-2 flex flex-wrap items-center justify-between gap-space-2">
          <label className="flex items-center gap-space-1 text-[0.9375rem]">
            <span className="text-sur-titre-petit text-bronze">{textes.filtreMois}</span>
            <select value={mois} onChange={(e) => setMois(e.target.value)} className="min-h-10 rounded-etiquette border border-filet bg-blanc px-space-1">
              <option value="">{textes.tousLesMois}</option>
              {moisDispo.map((m) => (
                <option key={m} value={m}>
                  {nomMois(m)}
                </option>
              ))}
            </select>
          </label>
          <p aria-live="polite" className="text-[0.9375rem] text-gris-chaud">
            {compte}
          </p>
        </div>
      </div>

      {parMois.length === 0 && <p className="mt-space-3 text-gris-chaud">{textes.aucune}</p>}

      {/* Ordinateur : tableau */}
      {parMois.length > 0 && (
        <div className="mt-space-3 hidden overflow-hidden rounded-carte border border-filet md:block">
          <table className="w-full border-collapse text-left text-[0.9375rem]">
            <thead className="bg-creme">
              <tr>
                <th scope="col" className="w-[7.5rem] px-space-2 py-space-1 text-sur-titre-petit">{textes.colDate}</th>
                <th scope="col" className="px-space-2 py-space-1 text-sur-titre-petit">{textes.colJournee}</th>
                <th scope="col" className="w-[11rem] px-space-2 py-space-1 text-sur-titre-petit">{textes.colCategorie}</th>
                <th scope="col" className="px-space-2 py-space-1 text-sur-titre-petit">{textes.colAnecdote}</th>
              </tr>
            </thead>
            {parMois.map((g) => (
              <tbody key={g.m}>
                <tr>
                  <th scope="rowgroup" colSpan={4} className="border-t border-filet bg-creme-clair px-space-2 py-space-1 font-serif text-[1.125rem] text-bronze">
                    {nomMois(g.m)}
                  </th>
                </tr>
                {g.items.map((d) => (
                  <tr key={d.id} className={`border-t border-filet align-top ${d.categorie === "evenements" ? "bg-champagne/40" : "bg-blanc"}`}>
                    <td className="whitespace-nowrap px-space-2 py-space-1 font-bold">{d.dateLabel}</td>
                    <td className="px-space-2 py-space-1">
                      {titre(d)}
                    </td>
                    <td className="px-space-2 py-space-1">
                      <span className="inline-flex items-center gap-1.5">
                        {pastille(d.categorie)}
                        {sansEmoji(textes.categories[d.categorie])}
                      </span>
                    </td>
                    <td className="px-space-2 py-space-1 text-gris-chaud">{d.anecdote}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      )}

      {/* Mobile : cartes empilées */}
      {parMois.length > 0 && (
        <div className="mt-space-3 space-y-space-3 md:hidden">
          {parMois.map((g) => (
            <section key={g.m} aria-label={nomMois(g.m)}>
              <p className="font-serif text-[1.125rem] text-bronze">{nomMois(g.m)}</p>
              <ul className="mt-space-1 space-y-space-1">
                {g.items.map((d) => (
                  <li
                    key={d.id}
                    className={`rounded-carte border border-filet p-space-2 ${d.categorie === "evenements" ? "bg-champagne/40" : "bg-blanc"}`}
                    style={{ borderLeft: `4px solid ${COULEUR_CATEGORIE[d.categorie]}` }}
                  >
                    <p className="flex flex-wrap items-center gap-x-space-1 text-sur-titre-petit text-gris-chaud">
                      <span className="font-bold text-anthracite">{d.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        {pastille(d.categorie)}
                        {sansEmoji(textes.categories[d.categorie])}
                      </span>
                    </p>
                    <p className="mt-1">
                      {titre(d)}
                    </p>
                    {d.anecdote && <p className="mt-1 text-[0.9375rem] text-gris-chaud">{d.anecdote}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
