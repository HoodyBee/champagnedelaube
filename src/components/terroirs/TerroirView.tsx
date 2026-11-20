import type { Metadata } from "next";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { getTranslations } from "next-intl/server";
import { CepagePastille } from "@/components/brand/CepagePastille";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { TerroirCards } from "@/components/ui/TerroirCards";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { terroirs, type TerroirKey } from "@/lib/brand";
import { imageObject } from "@/lib/image-jsonld";
import { nav, terroirPages } from "@/lib/site";
import { getTerroir } from "@/sanity/content";

const GRANDS = ["pinot-noir", "meunier", "chardonnay"] as const;
const RARES = ["pinot-blanc", "pinot-gris", "arbane", "petit-meslier"] as const;
const NOUVEAUX = ["chardonnay-rose"] as const;

const hrefOf = (cle: TerroirKey) => terroirPages.find((p) => p.key === cle)!.href;

export async function terroirMetadata(cle: TerroirKey, locale: Locale): Promise<Metadata> {
  const t = await getTerroir(cle, locale);
  return pageMetadata({ locale, href: hrefOf(cle), seo: t.seo, title: t.seo.title ?? t.nom, description: t.seo.description ?? t.intro ?? t.nom, image: t.image });
}

/** Page d'un terroir : ouverture, repères, texte, sols et cépages, secteurs, villages, liens. */
export async function TerroirView({ cle, locale }: { cle: TerroirKey; locale: Locale }) {
  const t = await getTerroir(cle, locale);
  const tT = await getTranslations("terroirPage");
  const tNav = await getTranslations("nav");
  const couleur = `var(--color-${terroirs[cle].color})`;

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("terroirHub"), href: nav.terroirHub.href }, { label: t.nom }]} />
      <section className="border-b border-filet bg-creme-clair">
        <div className="mx-auto grid max-w-7xl items-center gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
          <div className="order-2 lg:order-1">
            <p className="inline-flex items-center gap-1.5 text-sur-titre text-bronze">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-rond" style={{ backgroundColor: couleur }} />
              {tNav("terroirHub")}
            </p>
            <h1 className="mt-space-2 text-titre-post">{t.nom}</h1>
            {t.accroche && <p className="mt-space-3 text-accroche">{t.accroche}</p>}
            {t.intro && <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">{t.intro}</p>}
          </div>
          <Photo image={t.image} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile className="order-1 lg:order-2" />
        </div>
      </section>

      {t.reperes.length > 0 && (
        <div className="border-b border-filet bg-blanc">
          <dl className="mx-auto grid max-w-7xl gap-space-3 px-space-2 py-space-3 sm:grid-cols-2 sm:px-space-4 lg:grid-cols-4">
            {t.reperes.map((r) => (
              <div key={r.label}>
                <dt className="text-sur-titre-petit text-gris-chaud">{r.label}</dt>
                <dd className="mt-1 text-[1.125rem] font-bold leading-snug">{r.valeur}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <Section>
        <div className="grid gap-space-5 lg:grid-cols-[1.6fr_1fr]">
          <RichText value={t.contenu} locale={locale} className="max-w-3xl" />
          <aside className="space-y-space-4 lg:pt-space-2">
            {t.sols && (
              <div className="surface-chaude rounded-carte p-space-3">
                <h2 className="text-sur-titre text-bronze">{tT("sols")}</h2>
                <p className="mt-space-1">{t.sols}</p>
              </div>
            )}
            {t.cepagesDominants.length > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{tT("cepages")}</h2>
                {/* Cépages majoritaires d'abord, puis les autres cépages cultivés (en minorité). */}
                <ul className="mt-space-1 grid grid-cols-2 gap-x-space-2 gap-y-space-1">
                  {t.cepagesMajoritaires.map((c) => (
                    <li key={c}>
                      <CepagePastille cepage={c} note={t.cepagesNotes?.[c]} />
                    </li>
                  ))}
                </ul>
                {(
                  [
                    ["principaux", GRANDS],
                    ["rares", RARES],
                    ["nouveau", NOUVEAUX],
                  ] as const
                ).map(([groupe, liste]) => {
                  const items = t.cepagesDominants.filter((c) => (liste as readonly string[]).includes(c) && !t.cepagesMajoritaires.includes(c));
                  if (!items.length) return null;
                  return (
                    <div key={groupe} className="mt-space-2">
                      <p className="text-sur-titre-petit text-gris-chaud">{tT(`cepagesGroupes.${groupe}`)}</p>
                      <ul className="mt-space-1 grid grid-cols-2 gap-x-space-2 gap-y-space-1">
                        {items.map((c) => (
                          <li key={c}>
                            <CepagePastille cepage={c} note={t.cepagesNotes?.[c]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
            {t.villages.length > 0 && (
              <div>
                <h2 className="text-sur-titre text-bronze">{tT("villages")}</h2>
                <ul className="mt-space-2 flex flex-wrap gap-space-1">
                  {t.villages.map((v) => (
                    <li key={v} className="rounded-etiquette border border-filet px-space-1 py-1 text-sur-titre-petit text-gris-chaud">{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      {t.secteurs.length > 0 && (
        <Section fond="chaude" titre={tT("secteurs")}>
          <ul className="grid gap-space-3 md:grid-cols-2">
            {t.secteurs.map((s) => (
              <li key={s.titre} className="rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
                <h3 className="text-[1.375rem] font-bold leading-tight">{s.titre}</h3>
                {s.texte?.length ? <RichText value={s.texte} locale={locale} className="mt-space-1 text-gris-chaud" /> : <p className="mt-space-1 text-gris-chaud">{s.texteSimple}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {t.galerie.length > 0 && (
        <Section>
          <ul className="grid gap-space-2 sm:grid-cols-2 lg:grid-cols-3">
            {t.galerie.map((g, i) => (
              <li key={i}><Photo image={g} ratio="3/2" sizes="(min-width: 1024px) 33vw, 50vw" /></li>
            ))}
          </ul>
        </Section>
      )}

      <DansLeMag locale={locale} chemins={[hrefOf(cle)]} rubrique="terroirs-cepages" fond={t.secteurs.length ? "chaude" : "blanc"} />

      <Section fond={t.secteurs.length ? "blanc" : "chaude"} titre={tT("autres")}>
        <div className="mx-auto max-w-2xl">
          <TerroirCards exclure={cle} />
        </div>
        <div className="mt-space-4 flex flex-col items-center justify-center gap-space-1 sm:flex-row">
          <ButtonLink href={nav.particuliers[0].href}>{tNav("tasting")}</ButtonLink>
          <ButtonLink href={nav.vignerons.href} variant="secondaire">{tNav("vignerons")}</ButtonLink>
          <ButtonLink href={nav.pro[0].href} variant="secondaire">{tT("offrePro")}</ButtonLink>
        </div>
      </Section>
      {(t.image || t.galerie.length > 0) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [t.image, ...t.galerie].filter((g): g is NonNullable<typeof g> => !!g).map(imageObject) }),
          }}
        />
      )}
    </>
  );
}
