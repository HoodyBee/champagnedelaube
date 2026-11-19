import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";
import { formatsDegustationActifs, nav } from "@/lib/site";
import { getExperience, getExperiences, getExperienceSlugs, getVignerons } from "@/sanity/content";

type Props = PageProps<"/[locale]/tasting-troyes/[slug]">;

/** Pages générées à l'avance (au moins un paramètre : exigence de Next.js). */
export async function generateStaticParams() {
  const slugs = await getExperienceSlugs();
  return routing.locales.flatMap((locale) => (slugs.length ? slugs : ["bientot"]).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const e = formatsDegustationActifs ? await getExperience(slug, locale) : null;
  if (!e) return {};
  const t = await getTranslations({ locale, namespace: "experiencePage" });
  return pageMetadata({
    locale,
    href: { pathname: "/tasting-troyes/[slug]", params: { slug } },
    seo: e.seo,
    title: t("metaTitle", { titre: e.titre }),
    description: e.accroche ?? e.titre,
  });
}

/** Une expérience de dégustation : description, ce qui est compris, lieu, vignerons, réservation. */
export default async function ExperiencePage({ params }: Props) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  // Formats de dégustation masqués : la page n'est pas affichée (elle reste prête).
  if (!formatsDegustationActifs) notFound();
  const [e, toutes, vignerons] = await Promise.all([getExperience(slug, locale), getExperiences(locale), getVignerons(locale)]);
  if (!e) notFound();

  const t = await getTranslations("experiencePage");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const cites = vignerons.filter((v) => e.vignerons.includes(v.slug));
  const autres = toutes.filter((o) => o.slug !== e.slug).slice(0, 3);
  const personnes =
    e.participantsMin && e.participantsMax
      ? tUi("peopleRange", { min: e.participantsMin, max: e.participantsMax })
      : e.participantsMax
        ? tUi("peopleMax", { max: e.participantsMax })
        : undefined;

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("tasting"), href: nav.particuliers[0].href }, { label: e.titre }]} />
      <section className="mx-auto grid max-w-7xl items-start gap-space-4 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-2 lg:gap-space-5 lg:py-space-5">
        <Photo image={e.image} ratio="4/5" sizes="(min-width: 1024px) 50vw, 100vw" priority compactMobile className="lg:order-2" />
        <div className="lg:order-1">
          <h1 className="text-titre-post">{e.titre}</h1>
          {e.accroche && <p className="mt-space-2 text-accroche text-gris-chaud">{e.accroche}</p>}
          <ul className="mt-space-3 space-y-1 text-gris-chaud">
            {e.duree && (
              <li className="flex items-center gap-space-1"><LineIcon name="duree" size={20} className="text-bronze" />{e.duree}</li>
            )}
            {personnes && (
              <li className="flex items-center gap-space-1"><LineIcon name="groupe" size={20} className="text-bronze" />{personnes}</li>
            )}
            {e.lieu && (
              <li className="flex items-center gap-space-1"><LineIcon name="lieu" size={20} className="text-bronze" />{e.lieu}</li>
            )}
          </ul>
          <p className="mt-space-3 text-[1.0625rem]">
            {e.prixAPartirDe != null
              ? tUi.rich("priceFrom", { price: e.prixAPartirDe, strong: (c) => <strong className="font-bold">{c}</strong> })
              : <span className="text-gris-chaud">{tUi("priceOnRequest")}</span>}
          </p>
          {e.animateur?.nom && <p className="mt-space-1 text-legende text-gris-chaud">{tUi("hostedBy", { name: e.animateur.nom })}</p>}
          {e.description?.length ? <RichText value={e.description} locale={locale} className="mt-space-3" /> : null}
          {e.inclus.length > 0 && (
            <>
              <h2 className="mt-space-4 text-sur-titre text-bronze">{t("inclus")}</h2>
              <ul className="mt-space-2 space-y-space-1">
                {e.inclus.map((i) => (
                  <li key={i} className="flex items-start gap-space-1">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-rond bg-or" />
                    {i}
                  </li>
                ))}
              </ul>
            </>
          )}
          {e.adresse && (e.adresse.nom || e.adresse.adresse) && (
            <>
              <h2 className="mt-space-4 text-sur-titre text-bronze">{t("lieu")}</h2>
              <p className="mt-space-1">
                {[e.adresse.nom, e.adresse.adresse, [e.adresse.codePostal, e.adresse.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
              </p>
            </>
          )}
        </div>
      </section>

      {cites.length > 0 && (
        <Section fond="chaude" titre={t("vignerons")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
            {cites.map((v) => (
              <li key={v.slug}><DomaineCard domaine={v} /></li>
            ))}
          </ul>
        </Section>
      )}

      {e.galerie.length > 0 && (
        <Section titre={t("galerie")}>
          <ul className="grid gap-space-2 sm:grid-cols-2 lg:grid-cols-3">
            {e.galerie.map((g, i) => (
              <li key={i}><Photo image={g} ratio="3/2" sizes="(min-width: 1024px) 33vw, 50vw" /></li>
            ))}
          </ul>
        </Section>
      )}

      <Section fond={cites.length ? "blanc" : "chaude"}>
        <section id="reserver" aria-labelledby="reserver-titre" className="mx-auto max-w-3xl scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
          <LineIcon name="degustation" size={32} className="text-or" />
          <h2 id="reserver-titre" className="mt-space-2 text-titre-section">{t("reserverTitre", { titre: e.titre })}</h2>
          <div className="mt-space-3">
            <LeadForm formId="reservationExperience" context={e.titre} />
          </div>
        </section>
      </Section>

      {autres.length > 0 && (
        <Section titre={t("autres")}>
          <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
            {autres.map((o) => (
              <li key={o.slug}><ExperienceCard experience={o} /></li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
