import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale, StaticPathname as AppPathname } from "@/i18n/routing";
import { logos } from "@/lib/brand";
import { contentPages, proPages, telHref, terroirPages } from "@/lib/site";
import { localize } from "@/sanity/lib/i18n";
import { getReglages } from "@/sanity/queries";

/**
 * Pied de page : fond anthracite, logo rond (posé sur sa pastille crème, ce que
 * le brand book autorise sur fond sombre), liens, coordonnées et mention sanitaire.
 */
export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tLegal = await getTranslations("legal");
  const tMeta = await getTranslations("meta");
  const reglages = await getReglages();

  const promesse = localize(reglages.promesse, locale) ?? tMeta("defaultDescription");
  const signature = localize(reglages.signature, locale) ?? tMeta("tagline");

  return (
    <footer className="bg-anthracite text-blanc">
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
          <p className="mt-space-3 max-w-xs text-creme">{promesse}</p>
          <p className="mt-space-1 text-sur-titre text-or">{signature}</p>
        </div>

        <FooterColumn title={t("discover")}>
          {terroirPages.map((p) => (
            <FooterLink key={p.href} href={p.href}>{p.label}</FooterLink>
          ))}
          <FooterLink href="/vignerons">{tNav("vignerons")}</FooterLink>
          <FooterLink href="/tasting-troyes">{tNav("tasting")}</FooterLink>
          {contentPages.map((p) => (
            <FooterLink key={p.href} href={p.href}>{tNav(p.key)}</FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t("pro")}>
          {proPages.map((p) => (
            <FooterLink key={p.href} href={p.href}>{tNav(p.key)}</FooterLink>
          ))}
          <FooterLink href="/contact">{tNav("contact")}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t("contact")}>
          <li>
            <a href={`mailto:${reglages.email}`} className="footer-link" aria-label={`${t("emailLabel")} ${reglages.email}`}>
              {reglages.email}
            </a>
          </li>
          <li>
            <a href={telHref(reglages.telephone)} className="footer-link" aria-label={`${t("phoneLabel")} ${reglages.telephone}`}>
              {reglages.telephone}
            </a>
          </li>
          <li>
            <a
              href={`https://www.instagram.com/${reglages.instagram}/`}
              className="footer-link"
              rel="noopener"
              target="_blank"
              aria-label={`${t("instagramLabel")} : @${reglages.instagram}`}
            >
              @{reglages.instagram}
            </a>
          </li>
          <li className="pt-space-1 text-creme">{t("location")}</li>
        </FooterColumn>
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
