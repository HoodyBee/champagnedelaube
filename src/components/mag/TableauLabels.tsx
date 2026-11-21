import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { ENTETES, LABELS, tl, type LabelLigne } from "@/lib/labels";

/** Logo officiel du label (lien vers le site du label), ou son sigle si le logo n'est pas encore fourni. */
function Logos({ l, locale }: { l: LabelLigne; locale: Locale }) {
  return (
    <a href={l.site} target="_blank" rel="noopener" className="inline-flex flex-wrap items-center gap-space-1 no-underline">
      {l.logos.length ? (
        l.logos.map((g) => (
          <Image key={g.src} src={g.src} alt={tl(ENTETES.logo, locale).replace("#", g.nom)} width={g.largeur} height={g.hauteur} className="h-10 w-auto sm:h-12" />
        ))
      ) : (
        <span className="inline-flex h-10 items-center rounded-etiquette border border-filet px-space-1 text-sur-titre-petit text-anthracite sm:h-12">{l.sigle}</span>
      )}
    </a>
  );
}

function Indice({ n, locale }: { n: number; locale: Locale }) {
  return (
    <>
      <span aria-hidden="true">{"🌿".repeat(n)}</span>
      <span className="sr-only">{tl(ENTETES.indiceSr, locale).replace("#", String(n))}</span>
    </>
  );
}

/**
 * Comparatif des labels environnementaux. Ordinateur et tablette : un vrai tableau.
 * Mobile : une carte par label (plus lisible qu'un tableau qui défile de côté).
 */
export function TableauLabels({ locale }: { locale: Locale }) {
  const e = (k: keyof typeof ENTETES) => tl(ENTETES[k], locale);
  return (
    <div className="not-prose my-space-3">
      <div className="hidden overflow-x-auto rounded-carte border border-filet md:block">
        <table className="w-full border-collapse text-left text-[0.9375rem]">
          <caption className="sr-only">{e("legende")}</caption>
          <thead className="bg-creme">
            <tr>
              {(["label", "demarche", "pesticides", "promesse", "indice"] as const).map((k) => (
                <th key={k} scope="col" className="px-space-2 py-space-1 align-bottom text-sur-titre-petit">
                  {e(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LABELS.map((l) => (
              <tr key={l.cle} className="border-t border-filet bg-blanc align-top">
                <td className="px-space-2 py-space-2">
                  <Logos l={l} locale={locale} />
                </td>
                <th scope="row" className="px-space-2 py-space-2 font-bold">
                  {tl(l.nom, locale)}
                </th>
                <td className="px-space-2 py-space-2">{tl(l.pesticides, locale)}</td>
                <td className="px-space-2 py-space-2 text-gris-chaud">{tl(l.promesse, locale)}</td>
                <td className="whitespace-nowrap px-space-2 py-space-2">
                  <Indice n={l.indice} locale={locale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-space-2 md:hidden" aria-label={e("legende")}>
        {LABELS.map((l) => (
          <li key={l.cle} className="rounded-carte border border-filet bg-blanc p-space-2">
            <Logos l={l} locale={locale} />
            <p className="mt-space-1 font-bold leading-snug">{tl(l.nom, locale)}</p>
            <dl className="mt-space-1 space-y-1 text-[0.9375rem]">
              <div>
                <dt className="inline text-sur-titre-petit text-bronze">{e("pesticides")} : </dt>
                <dd className="inline">{tl(l.pesticides, locale)}</dd>
              </div>
              <div>
                <dt className="sr-only">{e("promesse")}</dt>
                <dd className="text-gris-chaud">{tl(l.promesse, locale)}</dd>
              </div>
              <div>
                <dt className="inline text-sur-titre-petit text-bronze">{e("indice")} : </dt>
                <dd className="inline">
                  <Indice n={l.indice} locale={locale} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
