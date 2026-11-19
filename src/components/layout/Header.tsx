"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SocialLinks } from "@/components/icons/SocialLinks";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale, StaticPathname as AppPathname } from "@/i18n/routing";
import { logos, terroirs } from "@/lib/brand";
import { nav, proEntreprises, terroirPages, type NavKey } from "@/lib/site";
import type { SocialLinks as Social } from "@/sanity/queries";
import { Chevron, LanguageSwitcher } from "./LanguageSwitcher";

type Item = { href: AppPathname; label: string; color?: string };

/**
 * En-tête en deux étages :
 *  1. le logo complet (sans sa ligne des terroirs, que l'on écrit en entier juste dessous),
 *     qui défile normalement avec la page ;
 *  2. la barre de navigation, qui reste collée en haut de l'écran. Une fois le logo
 *     sorti de l'écran, la bouteille seule (avatar) apparaît à gauche de la barre.
 * Pas de saut de mise en page : l'en-tête est « collant » avec un décalage égal à la
 * hauteur du premier étage.
 */
export function Header({ social, locales }: { social: Social; locales: readonly Locale[] }) {
  const t = useTranslations("nav");
  const tSocial = useTranslations("social");
  const socialLabels = {
    label: tSocial("label"),
    instagram: tSocial("instagram"),
    facebook: tSocial("facebook"),
    linkedin: tSocial("linkedin"),
  };
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // « Réduit » : le logo est sorti de l'écran, la barre de navigation est collée en haut.
  const headerRef = useRef<HTMLElement>(null);
  const logoRowRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      const row = logoRowRef.current;
      if (!header || !row) return;
      setCompact(header.getBoundingClientRect().top <= -row.offsetHeight + 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toItem = (p: { key: NavKey; href: AppPathname }): Item => ({ href: p.href, label: t(p.key) });
  const terroirItems: Item[] = terroirPages.map((p) => ({
    href: p.href,
    label: p.label,
    color: `var(--color-${terroirs[p.key].color})`,
  }));
  const terroirMenu: Item[] = [toItem(nav.terroirHub), ...terroirItems];
  const degustationItems = nav.particuliers.map(toItem);
  const proItems = proEntreprises.map(toItem);

  const isActive = (href: AppPathname) => pathname === href || pathname.startsWith(`${href}/`);
  const isGroupActive = (items: Item[]) => items.some((i) => isActive(i.href));

  // Le menu mobile se ferme quand on change de page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  return (
    <MotionConfig reducedMotion="user">
      <header ref={headerRef} className="sticky top-[-172px] z-40 bg-creme-clair lg:top-[-224px]">
        {/* Étage 1 : le logo complet, puis les 4 terroirs écrits en entier (ordinateur). */}
        <div ref={logoRowRef} className="flex h-[172px] flex-col items-center justify-center lg:h-[224px]">
          <Link href="/" aria-label={t("homeLink")} className="block p-[19px] lg:p-[20px]" tabIndex={compact ? -1 : undefined}>
            <Image
              src={logos.sansTerroirs.src}
              alt=""
              width={150}
              height={143}
              sizes="(min-width: 1024px) 150px, 140px"
              priority
              className="h-[133px] w-[140px] lg:h-[143px] lg:w-[150px]"
            />
          </Link>
          <nav aria-label={t("terroirBand")} className="hidden lg:block">
            <ul className="flex items-center justify-center gap-space-1">
              {terroirItems.map((item, i) => (
                <li key={item.href} className="flex items-center gap-space-1">
                  {i > 0 && <span aria-hidden="true" className="text-sur-titre-petit text-gris-chaud">·</span>}
                  <Link
                    href={item.href}
                    tabIndex={compact ? -1 : undefined}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`inline-flex items-center gap-[6px] py-1 text-sur-titre-petit transition-colors hover:text-bronze ${
                      isActive(item.href) ? "text-bronze" : "text-gris-chaud"
                    }`}
                  >
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-rond" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Étage 2 : la barre de navigation, collée en haut de l'écran au défilement. */}
        <div
          className={`border-y border-filet transition-[background-color,box-shadow] duration-300 ${
            compact ? "bg-creme-clair/95 shadow-[0_6px_18px_rgba(30,30,32,0.05)] backdrop-blur-sm" : "bg-creme-clair"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-space-2 px-space-2 sm:px-space-4 2xl:max-w-[1440px]">
            <div className="flex min-w-0 items-center gap-space-2">
              {/* La bouteille seule, une fois le logo complet sorti de l'écran. */}
              <Link
                href="/"
                aria-label={t("homeLink")}
                aria-hidden={!compact}
                tabIndex={compact ? undefined : -1}
                className={`shrink-0 transition-opacity duration-300 ${compact ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Image src={logos.avatar.src} alt="" width={44} height={44} sizes="44px" className="h-11 w-11" />
              </Link>

              {/* Navigation ordinateur */}
              <nav aria-label={t("mainNav")} className="hidden xl:block">
                <ul className="flex items-center gap-1 2xl:gap-space-1">
                  <li>
                    <Dropdown label={t("terroirHub")} items={terroirMenu} active={isGroupActive(terroirMenu)} isActive={isActive} />
                  </li>
                  <li>
                    <NavLink href={nav.vignerons.href} active={isActive(nav.vignerons.href)}>{t("vignerons")}</NavLink>
                  </li>
                  <li>
                    <Dropdown label={t("tasting")} items={degustationItems} active={isGroupActive(degustationItems)} isActive={isActive} />
                  </li>
                  <li>
                    <NavLink href={nav.mag.href} active={isActive(nav.mag.href)}>{t("mag")}</NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-space-1">
              <div className="hidden xl:block">
                <Dropdown label={t("proEntreprises")} items={proItems} active={isGroupActive(proItems)} isActive={isActive} align="right" />
              </div>
              <div className="hidden xl:block">
                <LanguageSwitcher locales={locales} />
              </div>
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className="hidden min-h-11 items-center rounded-etiquette bg-anthracite px-space-2 text-sur-titre text-blanc transition-colors hover:bg-bleu-nuit xl:inline-flex"
              >
                {t("contact")}
              </Link>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-space-1 rounded-etiquette px-space-1 text-sur-titre text-anthracite xl:hidden"
                aria-expanded={mobileOpen}
                aria-controls="menu-mobile"
                onClick={() => setMobileOpen(true)}
              >
                {t("menu")}
                <BurgerIcon open={false} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* En dehors du <header> : son effet de flou empêcherait le panneau de couvrir l'écran. */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        groups={[
          { title: t("terroirHub"), items: terroirMenu },
          { items: [toItem(nav.vignerons)] },
          { title: t("tasting"), items: degustationItems },
          { items: [toItem(nav.mag)] },
          { title: t("proEntreprises"), items: proItems },
        ]}
        contact={{ href: "/contact", label: t("contact") }}
        isActive={isActive}
        locales={locales}
        social={<SocialLinks links={social} labels={socialLabels} className="-ml-3" linkClassName="text-anthracite hover:text-bronze" />}
      />
    </MotionConfig>
  );
}

function NavLink({ href, active, children }: { href: AppPathname; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center whitespace-nowrap px-space-1 transition-colors hover:text-bronze ${
        active ? "text-bronze underline decoration-or decoration-2 underline-offset-8" : ""
      }`}
    >
      {children}
    </Link>
  );
}

/** Menu déroulant : s'ouvre au clic ou au survol, se ferme avec Échap ou en cliquant ailleurs. */
function Dropdown({
  label,
  items,
  active,
  isActive,
  align = "left",
}: {
  label: string;
  items: Item[];
  active: boolean;
  isActive: (href: AppPathname) => boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  // Ouvert par le survol : le clic qui suit ne doit pas le refermer aussitôt.
  const openedByHover = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || open) return;
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        openedByHover.current = false;
        setOpen(false);
      }}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            return;
          }
          setOpen((v) => !v);
        }}
        className={`inline-flex min-h-11 items-center gap-1 whitespace-nowrap px-space-1 transition-colors hover:text-bronze ${
          active ? "text-bronze" : ""
        }`}
      >
        {label}
        <Chevron open={open} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full z-50 pt-space-1 ${align === "right" ? "right-0" : "left-0"}`}
          >
            <ul className="w-72 overflow-hidden rounded-carte border border-filet bg-blanc py-space-1 shadow-[0_8px_24px_rgba(30,30,32,0.08)]">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center gap-space-1 px-space-2 py-space-1 leading-snug transition-colors hover:bg-creme-clair ${
                      isActive(item.href) ? "text-bronze" : ""
                    }`}
                  >
                    {item.color && (
                      <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-rond" style={{ backgroundColor: item.color }} />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  groups,
  contact,
  isActive,
  locales,
  social,
}: {
  social: ReactNode;
  open: boolean;
  onClose: () => void;
  groups: { title?: string; items: Item[] }[];
  contact: Item;
  isActive: (href: AppPathname) => boolean;
  locales: readonly Locale[];
}) {
  const t = useTranslations("nav");
  const closeRef = useRef<HTMLButtonElement>(null);

  // Bloque le défilement de la page derrière le menu, place le focus sur « Fermer »,
  // ferme avec Échap et rend le focus au bouton « Menu ».
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label={t("mainNav")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-y-auto bg-creme-clair xl:hidden"
        >
          <div className="sticky top-0 z-10 border-b border-filet bg-creme-clair">
            <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-space-2 sm:px-space-4">
              <Link href="/" aria-label={t("homeLink")} onClick={onClose}>
                <Image src={logos.avatar.src} alt="" width={44} height={44} sizes="44px" className="h-11 w-11" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 items-center gap-space-1 rounded-etiquette px-space-1 text-sur-titre text-anthracite"
              >
                {t("closeMenu")}
                <BurgerIcon open />
              </button>
            </div>
          </div>
          <nav aria-label={t("mainNav")} className="mx-auto max-w-xl px-space-2 pb-space-5 pt-space-1 sm:px-space-4">
            {groups.map((group) => (
              <div key={group.title ?? group.items[0].href} className="border-b border-filet py-space-2">
                {group.title && <p className="text-sur-titre text-bronze">{group.title}</p>}
                <ul className={group.title ? "mt-space-1" : ""}>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        onClick={onClose}
                        className={`flex min-h-11 items-center gap-space-1 text-[1.125rem] ${
                          isActive(item.href) ? "text-bronze" : ""
                        }`}
                      >
                        {item.color && (
                          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-rond" style={{ backgroundColor: item.color }} />
                        )}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              href={contact.href}
              onClick={onClose}
              className="mt-space-3 flex min-h-12 items-center justify-center rounded-etiquette bg-anthracite text-sur-titre text-blanc"
            >
              {contact.label}
            </Link>
            <div className="mt-space-3">
              <LanguageSwitcher variant="inline" locales={locales} onNavigate={onClose} />
            </div>
            <div className="mt-space-2">{social}</div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}
