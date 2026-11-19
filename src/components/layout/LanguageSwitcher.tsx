"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Flag } from "@/components/icons/Flag";
import { Link, usePathname } from "@/i18n/navigation";
import { defaultActiveLocales, localeNames, type Locale } from "@/i18n/routing";

type Props = {
  /** Langues proposées (réglage « Langues actives » de Sanity). */
  locales?: readonly Locale[];
  /** "menu" : liste déroulante (en-tête) ; "inline" : liste de boutons (menu mobile,
   *  vérification d'âge) ; "footer" : drapeaux sur fond sombre (pied de page). */
  variant?: "menu" | "inline" | "footer";
  /** Titre accessible de la liste (variantes "inline" et "footer"). */
  label?: string;
  onNavigate?: () => void;
};

/**
 * Sélecteur de langue. Chaque langue est un vrai lien (bon pour Google), qui
 * mène à la même page traduite : /vignerons/ -> /en/winemakers/.
 */
export function LanguageSwitcher({ variant = "menu", onNavigate, label, locales = defaultActiveLocales }: Props) {
  const t = useTranslations("langSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Ferme la liste en cliquant ailleurs ou avec la touche Échap.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Même page, autre langue (avec les paramètres des pages dynamiques, ex. [slug]).
  const { locale: _ignored, ...routeParams } = params as Record<string, string>;
  void _ignored;
  const href = { pathname, params: routeParams } as Parameters<typeof Link>[0]["href"];

  const links = locales.map((l) => (
    <Link
      key={l}
      href={href}
      locale={l}
      lang={l}
      hrefLang={l}
      aria-current={l === locale ? "true" : undefined}
      onClick={() => {
        setOpen(false);
        onNavigate?.();
      }}
      className={
        variant === "footer"
          ? `inline-flex min-h-11 items-center gap-space-1 rounded-etiquette border px-space-2 text-sur-titre transition-colors ${
              l === locale ? "border-or text-blanc" : "border-blanc/20 text-blanc hover:border-champagne"
            }`
          : variant === "inline"
          ? `inline-flex min-h-11 items-center rounded-etiquette border px-space-2 text-sur-titre transition-colors ${
              l === locale
                ? "border-anthracite bg-anthracite text-blanc"
                : "border-filet bg-blanc text-anthracite hover:border-bronze"
            }`
          : `flex min-h-11 items-center justify-between gap-space-2 px-space-2 transition-colors hover:bg-creme-clair ${
              l === locale ? "text-bronze" : "text-anthracite"
            }`
      }
    >
      {variant === "footer" && <Flag locale={l} />}
      {variant === "menu" ? (
        localeNames[l]
      ) : (
        <>
          <span aria-hidden="true">{l.toUpperCase()}</span>
          <span className="sr-only">{localeNames[l]}</span>
        </>
      )}
      {variant === "menu" && <span className="text-sur-titre text-gris-chaud">{l.toUpperCase()}</span>}
    </Link>
  ));

  if (variant !== "menu") {
    return (
      <nav aria-label={label ?? t("label")}>
        <ul className="flex flex-wrap gap-space-1">
          {links.map((link) => (
            <li key={link.key}>{link}</li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t("current", { language: localeNames[locale] })}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1 rounded-etiquette px-space-1 text-sur-titre text-anthracite transition-colors hover:text-bronze"
      >
        {locale.toUpperCase()}
        <Chevron open={open} />
      </button>
      <div
        id={listId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-space-1 w-48 overflow-hidden rounded-carte border border-filet bg-blanc py-space-1 shadow-[0_8px_24px_rgba(30,30,32,0.08)]"
      >
        <ul>
          {links.map((link) => (
            <li key={link.key}>{link}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
