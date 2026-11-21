import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { SocialLinks } from "@/components/icons/SocialLinks";
import { Link } from "@/i18n/navigation";
import type { Locale, StaticPathname as AppPathname } from "@/i18n/routing";
import { logos } from "@/lib/brand";
import { contentPages, nav, proEntreprises, proEntreprisesHub, siteCredit, telHref, terroirPages } from "@/lib/site";
import { localize } from "@/sanity/lib/i18n";
import { getReglages, socialLinks } from "@/sanity/queries";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Pied de page : fond anthracite, logo rond (posé sur sa pastille crème, ce que
 * le brand book autorise sur fond sombre), liens, coordonnées, réseaux, langues,
 * mention sanitaire et crédit.
 */
export async function Footer({ locales }: { locales: readonly Locale[] }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tLegal = await getTranslations("legal");
  const tMeta = await getTranslations("meta");
  const tSocial = await getTranslations("social");
  const tNews = await getTranslations("newsletter.footer");
  const reglages = await getReglages();

  const signature = localize(reglages.signature, locale) ?? tMeta("tagline");
  const showPhone = reglages.afficherTelephone === true && !!reglages.telephone;

  return (
    <footer className="bg-anthracite text-blanc">
      {/* Inscription aux actualités */}
      <div className="border-b border-blanc/15">
        <div className="mx-auto grid max-w-7xl gap-space-3 px-space-2 py-space-4 sm:px-space-4 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-space-5">
          <div>
            <h2 className="text-sur-titre text-or">{tNews("surTitre")}</h2>
            <p className="mt-space-1 text-accroche text-creme">{tNews("title")}</p>
            <p className="mt-space-1 text-blanc/90">{tNews("text")}</p>
          </div>
          <NewsletterForm variant="sombre" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-space-4 px-space-2 py-space-5 sm:px-space-4 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Image
            src={logos.rondBandeau.src}
            alt={logos.rondBandeau.alt}
            width={240}
            height={240}
            sizes="240px"
            className="h-60 w-60"
          />
          <p className="mt-space-3 max-w-xs text-accroche text-creme">{signature}</p>
        </div>

        <FooterColumn title={t("discover")}>
          <FooterLink href={nav.terroirHub.href}>{tNav("terroirHub")}</FooterLink>
          {terroirPages.map((p) => (
            <FooterLink key={p.href} href={p.href}>{p.label}</FooterLink>
          ))}
          <FooterLink href="/champagne-troyes">{tNav("troyes")}</FooterLink>
          <FooterLink href={nav.vignerons.href}>{tNav("vignerons")}</FooterLink>
          <FooterLink href={nav.mag.href}>{tNav("mag")}</FooterLink>
          {contentPages.map((p) => (
            <FooterLink key={p.href} href={p.href}>{tNav(p.key)}</FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t("offers")}>
          <FooterLink href={proEntreprisesHub}>{tNav("proEntreprises")}</FooterLink>
          {proEntreprises.map((p) => (
            <FooterLink key={p.href} href={p.href}>{tNav(p.key)}</FooterLink>
          ))}
          {nav.particuliers.map((p) => (
            <FooterLink key={p.href} href={p.href}>{tNav(p.key)}</FooterLink>
          ))}
          <FooterLink href={nav.contact.href}>{tNav("contact")}</FooterLink>
        </FooterColumn>

        <div>
          <FooterColumn title={t("contact")}>
            <li>
              <a href={`mailto:${reglages.email}`} className="footer-link" aria-label={`${t("emailLabel")} ${reglages.email}`}>
                {reglages.email}
              </a>
            </li>
            {showPhone && (
              <li>
                <a href={telHref(reglages.telephone!)} className="footer-link" aria-label={`${t("phoneLabel")} ${reglages.telephone}`}>
                  {reglages.telephone}
                </a>
              </li>
            )}
            <li className="text-creme">{t("location")}</li>
          </FooterColumn>
          <SocialLinks
            links={socialLinks(reglages)}
            labels={{
              label: tSocial("label"),
              instagram: tSocial("instagram"),
              facebook: tSocial("facebook"),
              linkedin: tSocial("linkedin"),
            }}
            className="-ml-3 mt-space-2"
            linkClassName="text-blanc hover:text-champagne"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-space-2 pb-space-4 sm:px-space-4">
        <p className="text-sur-titre text-or">{t("languages")}</p>
        <div className="mt-space-2">
          <LanguageSwitcher variant="footer" label={t("languages")} locales={locales} />
        </div>
      </div>

      <div className="border-t border-blanc/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-space-2 px-space-2 py-space-3 sm:px-space-4 md:flex-row md:items-center md:justify-between">
          {/* Mention sanitaire obligatoire (loi Évin) */}
          <p className="text-legende text-blanc">{tLegal("health")}</p>
          <nav aria-label={t("legalNav")}>
            <ul className="flex flex-wrap gap-x-space-3 gap-y-space-1 text-legende">
              <li><Link href="/mentions-legales" className="footer-link">{tLegal("legalNotice")}</Link></li>
              <li><Link href="/politique-de-confidentialite" className="footer-link">{tLegal("privacy")}</Link></li>
            </ul>
          </nav>
        </div>
        <p className="mx-auto max-w-7xl px-space-2 pb-space-3 text-legende text-creme sm:px-space-4">
          {t("credit")}{" "}
          <a href={siteCredit.url} target="_blank" rel="noopener" className="footer-link underline">
            {siteCredit.name}
          </a>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sur-titre text-or">{title}</h2>
      <ul className="mt-space-2 space-y-space-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: AppPathname; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className="footer-link">{children}</Link>
    </li>
  );
}
