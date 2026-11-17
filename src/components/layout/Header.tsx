"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname as AppPathname } from "@/i18n/routing";
import { logos, terroirs } from "@/lib/brand";
import { contentPages, proPages, terroirPages, type NavKey } from "@/lib/site";
import { Chevron, LanguageSwitcher } from "./LanguageSwitcher";

type Item = { href: AppPathname; label: string; color?: string };

/** En-tête du site : logo (avatar), navigation, Espace Pro, langue. */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const terroirItems: Item[] = terroirPages.map((p) => ({
    href: p.href,
    label: p.label,
    color: `var(--color-${terroirs[p.key].color})`,
  }));
  const toItems = (pages: { key: NavKey; href: AppPathname }[]): Item[] =>
    pages.map((p) => ({ href: p.href, label: t(p.key) }));
  const proItems = toItems(proPages);
  const discoverItems = toItems(contentPages);

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
      <header className="sticky top-0 z-40 border-b border-filet bg-blanc/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-space-2 px-space-2 sm:px-space-4">
          <Link href="/" aria-label={t("homeLink")} className="flex shrink-0 items-center gap-space-1">
            <Image
              src={logos.avatar.src}
              alt=""
              width={48}
              height={48}
              sizes="48px"
              priority
              className="h-12 w-12"
            />
            <span className="text-[1.125rem] font-bold leading-tight lg:hidden xl:inline">
              Champagne de l&apos;Aube
            </span>
          </Link>

          {/* Navigation ordinateur */}
          <nav aria-label={t("mainNav")} className="hidden lg:block">
            <ul className="flex items-center gap-space-1 xl:gap-space-2">
              <li>
                <Dropdown label={t("terroirs")} items={terroirItems} active={isGroupActive(terroirItems)} isActive={isActive} />
              </li>
              <li>
                <NavLink href="/vignerons" active={isActive("/vignerons")}>{t("vignerons")}</NavLink>
              </li>
              <li>
                <NavLink href="/tasting-troyes" active={isActive("/tasting-troyes")}>{t("tasting")}</NavLink>
              </li>
              <li>
                <Dropdown label={t("contents")} items={discoverItems} active={isGroupActive(discoverItems)} isActive={isActive} />
              </li>
              <li>
                <Dropdown label={t("pro")} items={proItems} active={isGroupActive(proItems)} isActive={isActive} align="right" />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-space-1">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/contact"
              aria-current={isActive("/contact") ? "page" : undefined}
              className="hidden min-h-11 items-center rounded-etiquette bg-anthracite px-space-2 text-sur-titre text-blanc transition-colors hover:bg-bleu-nuit lg:inline-flex"
            >
              {t("contact")}
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-etiquette text-anthracite lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <BurgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

      </header>

      {/* En dehors du <header> : son effet de flou empêcherait le panneau de couvrir l'écran. */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        groups={[
          { title: t("terroirs"), items: terroirItems },
          {
            title: t("contents"),
            items: [
              { href: "/vignerons", label: t("vignerons") },
              { href: "/tasting-troyes", label: t("tasting") },
              ...discoverItems,
            ],
          },
          { title: t("pro"), items: proItems },
        ]}
        contact={{ href: "/contact", label: t("contact") }}
        isActive={isActive}
      />
    </MotionConfig>
  );
}

function NavLink({ href, active, children }: { href: AppPathname; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center px-space-1 transition-colors hover:text-bronze ${
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
        className={`inline-flex min-h-11 items-center gap-1 px-space-1 transition-colors hover:text-bronze ${
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
}: {
  open: boolean;
  onClose: () => void;
  groups: { title: string; items: Item[] }[];
  contact: Item;
  isActive: (href: AppPathname) => boolean;
}) {
  const t = useTranslations("nav");

  // Bloque le défilement de la page derrière le menu, et ferme avec Échap.
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-blanc lg:hidden"
        >
          <nav aria-label={t("mainNav")} className="mx-auto max-w-xl px-space-2 pb-space-5 pt-space-3 sm:px-space-4">
            {groups.map((group) => (
              <div key={group.title} className="border-b border-filet py-space-2">
                <p className="text-sur-titre text-bronze">{group.title}</p>
                <ul className="mt-space-1">
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
                          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-rond" style={{ backgroundColor: item.color }} />
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
              <LanguageSwitcher variant="inline" onNavigate={onClose} />
            </div>
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
