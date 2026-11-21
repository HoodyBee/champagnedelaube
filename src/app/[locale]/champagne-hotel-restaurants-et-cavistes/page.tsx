import type { Metadata } from "next";
import { DansLeMag } from "@/components/mag/DansLeMag";
import { SanityImage as Image } from "@/components/ui/SanityImage";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { Arguments } from "@/components/ui/Arguments";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { DomaineCard } from "@/components/ui/DomaineCard";
import { Faq } from "@/components/ui/Faq";
import { Hero } from "@/components/ui/Hero";
import { LineIcon } from "@/components/ui/LineIcon";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { nav } from "@/lib/site";
import { getEspacePro, getVignerons } from "@/sanity/content";

const HREF = "/champagne-hotel-restaurants-et-cavistes" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/champagne-hotel-restaurants-et-cavistes">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "proPage" });
  const p = await getEspacePro(locale);
  return pageMetadata({ locale, href: HREF, seo: p.seo, title: t("metaTitle"), description: t("metaDescription"), image: p.hero.image });
}

/** Espace Professionnels : restaurants, cavistes, hôtels. */
export default async function EspacePro({ params }: PageProps<"/[locale]/champagne-hotel-restaurants-et-cavistes">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("proPage");
  const tArg = await getTranslations("pro.arguments");
  const tNav = await getTranslations("nav");
  const tUi = await getTranslations("ui");
  const [p, vignerons] = await Promise.all([getEspacePro(locale), getVignerons(locale)]);

  const profils = p.profils.length
    ? p.profils.map((b) => ({ titre: b.titre!, texte: b.texte, points: b.points, image: b.image }))
    : (["restaurants", "cavistes", "hotels", "epiceries"] as const).map((k) => ({
        titre: t(`profils.${k}.titre`),
        texte: undefined,
        points: [t(`profils.${k}.texte`)],
        image: null,
      }));
  const args = p.arguments.length
    ? p.arguments
    : [
        { icone: "tarif" as const, titre: tArg("tarifs.titre"), texte: tArg("tarifs.texte") },
        { icone: "interlocuteur" as const, titre: tArg("interlocuteur.titre"), texte: tArg("interlocuteur.texte") },
        { icone: "degustation" as const, titre: tArg("degustation.titre"), texte: tArg("degustation.texte") },
      ];
  const domaines = vignerons.filter((v) => v.espacePro);

  return (
    <>
      <Breadcrumb locale={locale} items={[{ label: tNav("proEntreprises"), href: "/espace-pro-entreprises" }, { label: tNav("proChr") }]} />
      <Hero
        surTitre={p.hero.surTitre ?? t("surTitre")}
        titre={p.hero.titre ?? t("h1")}
        intro={p.hero.intro ?? t("intro")}
        image={p.hero.image}
        placeholderLabel={tUi("photoSoon")}
        actions={
          <>
            <ButtonLink href={{ pathname: HREF, hash: "grille" }}>{t("ctaGrille")}</ButtonLink>
            <ButtonLink href={{ pathname: HREF, hash: "degustation" }} variant="secondaire">
              {t("ctaDegustation")}
            </ButtonLink>
          </>
        }
      />

      <Section id="arguments" titre={t("argumentsTitre")}>
        <Arguments items={args} />
      </Section>

      <Section id="profils" fond="chaude" titre={t("profilsTitre")}>
        <ul className="grid gap-space-3 sm:grid-cols-2 lg:grid-cols-4">
          {profils.map((b) => (
            <li key={b.titre} className="flex flex-col overflow-hidden rounded-carte border border-filet bg-blanc">
              {b.image ? (
                <Photo image={b.image} ratio="4/3" sizes="(min-width: 1024px) 25vw, 50vw" placeholderLabel={tUi("photoSoon")} />
              ) : null}
              <div className="p-space-3">
                <h3 className="text-[1.25rem] font-bold">{b.titre}</h3>
                {b.texte?.length ? <RichText value={b.texte} locale={locale} className="mt-space-1 text-gris-chaud" /> : null}
                {b.points.map((pt) => (
                  <p key={pt} className="mt-space-1 text-gris-chaud">{pt}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="domaines" surTitre={t("portfolioSurTitre")} titre={p.portfolioTitre ?? t("portfolioTitre")} intro={p.portfolioIntro ?? t("portfolioIntro")}>
        <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-4">
          {domaines.map((v) => (
            <li key={v.slug}>
              <DomaineCard domaine={v} />
            </li>
          ))}
        </ul>
        <div className="mt-space-4 text-center">
          <ButtonLink href={nav.vignerons.href} variant="secondaire">
            {t("portfolioCta")}
          </ButtonLink>
        </div>
      </Section>

      {p.references.length > 0 && (
        <Section id="references" fond="chaude" titre={t("referencesTitre")}>
          <ul className="flex flex-wrap items-center justify-center gap-space-4">
            {p.references.map((r) => (
              <li key={r.nom} className="flex flex-col items-center gap-1 text-center">
                {r.logo ? (
                  <Image src={r.logo.src} alt={r.nom} width={160} height={80} className="h-16 w-auto object-contain grayscale" />
                ) : (
                  <span className="text-[1.125rem] font-bold">{r.nom}</span>
                )}
                {r.ville && <span className="text-legende text-gris-chaud">{r.ville}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="demandes" fond={p.references.length ? "blanc" : "chaude"}>
        <div className="grid gap-space-4 lg:grid-cols-2">
          {(
            [
              ["grille", "document", p.grilleTitre ?? t("grilleTitre"), p.grilleTexte ?? t("grilleTexte"), "grillePro"],
              ["degustation", "degustation", p.degustationTitre ?? t("degustationTitre"), p.degustationTexte ?? t("degustationTexte"), "degustationPro"],
            ] as const
          ).map(([id, icone, titre, texte, formId]) => (
            <section key={id} id={id} aria-labelledby={`${id}-titre`} className="scroll-mt-28 rounded-carte border border-filet bg-blanc p-space-3 sm:p-space-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-rond border border-filet bg-creme-clair text-bronze">
                <LineIcon name={icone} size={24} />
              </span>
              <h2 id={`${id}-titre`} className="mt-space-2 text-titre-section">{titre}</h2>
              <p className="mt-space-1 mb-space-3 text-gris-chaud">{texte}</p>
              <LeadForm formId={formId} />
            </section>
          ))}
        </div>
      </Section>

      {p.faq.length > 0 && (
        <Section id="questions" titre={tUi("faqTitle")}>
          <Faq items={p.faq} />
        </Section>
      )}

      <DansLeMag locale={locale} chemins={["/champagne-hotel-restaurants-et-cavistes"]} rubrique="actualites" />

      {/* Invitation au partenariat pour les établissements (même texte que sur Dégustations privées). */}
      <Section id="partenariat-etablissements">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-space-2 text-center">
          <LineIcon name="interlocuteur" size={32} className="text-or" />
          <h2 className="text-titre-section">{t("etablissementTitre")}</h2>
          <p className="text-[1.0625rem] text-gris-chaud">{t("etablissementTexte")}</p>
          <ButtonLink href={{ pathname: "/contact", hash: "pro" }}>{t("etablissementCta")}</ButtonLink>
        </div>
      </Section>

      <Section id="vignerons-partenaires" fond="chaude">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-space-2 text-center">
          <h2 className="text-titre-section">{t("partenaireTitre")}</h2>
          <p className="text-gris-chaud">{t("partenaireTexte")}</p>
          <ButtonLink href={nav.pro[1].href} variant="secondaire">
            {t("partenaireCta")}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
