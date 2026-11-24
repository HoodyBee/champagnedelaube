"use client";

import NextLink from "next/link";
import { useParams, usePathname as useNextPathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Flag } from "@/components/icons/Flag";
import { getPathname, Link, usePathname } from "@/i18n/navigation";
import { defaultActiveLocales, localeNames, routing, type Locale } from "@/i18n/routing";

/**
 * Page courante, sous sa forme interne (/vignerons, /[article]…). Au rendu serveur, l'adresse lue peut
 * être l'adresse interne (/en/vignerons) au lieu de l'adresse traduite (/en/winemakers) : on la
 * reconnaît directement, pour ne jamais confondre une page fixe avec un article (/[article]).
 */
function pagePourLiens(pathname: string, brut: string, locale: Locale, params: Record<string, string>): string {
  const pages = routing.pathnames as Record<string, string | Record<string, string>>;
  // Page à paramètres lue sous sa forme interne (/vignerons/mennetrier) : on retrouve le modèle (/vignerons/[slug]).
  if (!pathname.includes("[") && !(pathname in pages) && Object.keys(params).length) {
    const modele = Object.keys(pages).find(
      (k) => k.includes("[") && new RegExp(`^${k.replace(/\[[^\]]+\]/g, "[^/]+")}$`).test(pathname.replace(/\/$/, "")),
    );
    if (modele) return modele;
  }
  if (!pathname.includes("[") || Object.keys(params).length) return pathname;
  const seg = (brut.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/").replace(/\/$/, "") || "/";
  if (seg in pages) return seg;
  const traduite = Object.entries(pages).find(([, v]) => typeof v !== "string" && v[locale] === seg);
  return traduite ? traduite[0] : pathname;
}

type Props = {
  /** Langues proposées (réglage « Langues actives » de Sanity). */
  locales?: readonly Locale[];
  /** "menu" : liste déroulante (en-tête) ; "inline" : liste de boutons (menu mobile,
   *  vérification d'âge) ; "footer" : drapeaux sur fond sombre (pied de page) ;
   *  "compact" : « FR / EN » discret, en teinte secondaire (barre de navigation). */
  variant?: "menu" | "inline" | "footer" | "compact";
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
  const brut = useNextPathname();
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
  const href = { pathname: pagePourLiens(pathname, brut, locale, routeParams), params: routeParams } as Parameters<typeof Link>[0]["href"];

  // Français (langue par défaut, sans préfixe) : lien direct vers l'adresse finale (/vignerons/),
  // et non /fr/vignerons/ qui redirige (détour inutile pour Google). Sans risque : la détection
  // automatique de la langue est désactivée (src/i18n/routing.ts).
  const hrefParDefaut = (() => {
    try {
      const p = getPathname({ href, locale: routing.defaultLocale } as Parameters<typeof getPathname>[0]);
      return p.endsWith("/") ? p : `${p}/`;
    } catch {
      return null;
    }
  })();

  const links = locales.map((l) => {
    const Lien = (l === routing.defaultLocale && hrefParDefaut ? NextLink : Link) as typeof Link;
    return (
    <Lien
      key={l}
      href={(l === routing.defaultLocale && hrefParDefaut ? hrefParDefaut : href) as Parameters<typeof Link>[0]["href"]}
      {...(l === routing.defaultLocale && hrefParDefaut ? {} : { locale: l })}
      lang={l}
      hrefLang={l}
      aria-current={l === locale ? "true" : undefined}
      onClick={() => {
        setOpen(false);
        onNavigate?.();
      }}
      className={
        variant === "compact"
          ? `inline-flex min-h-10 items-center px-1 text-sur-titre-petit transition-colors ${
              l === locale ? "text-anthracite" : "text-gris-chaud hover:text-bronze"
            }`
          : variant === "footer"
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
    </Lien>
    );
  });

  if (variant === "compact") {
    return (
      <nav aria-label={label ?? t("label")}>
        <ul className="flex items-center">
          {links.map((link, i) => (
            <li key={link.key} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className="text-sur-titre-petit text-gris-chaud/40">/</span>}
              {link}
            </li>
          ))}
        </ul>
      </nav>
    );
  }

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
