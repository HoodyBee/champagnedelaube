"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NL_BAR_KEY } from "@/lib/newsletter-bar";

/**
 * Fin bandeau d'annonce au-dessus de l'en-tête : invitation discrète à recevoir les
 * actualités, refermable (choix mémorisé). Il défile avec la page : l'en-tête,
 * lui, reste fixé en haut. Masqué sur les pages Newsletter elles-mêmes.
 */
export function NewsletterBar() {
  const t = useTranslations("newsletter.bar");
  const pathname = usePathname();

  // Après un changement de langue, Next.js reconstruit <html> : on réapplique le choix.
  useEffect(() => {
    try {
      if (localStorage.getItem(NL_BAR_KEY) === "0") document.documentElement.setAttribute("data-nl-bar", "hidden");
    } catch {}
  }, [pathname]);

  if (pathname.startsWith("/newsletter")) return null;

  function close() {
    try {
      localStorage.setItem(NL_BAR_KEY, "0");
    } catch {}
    document.documentElement.setAttribute("data-nl-bar", "hidden");
  }

  return (
    <div className="nl-bar bg-bleu-nuit text-creme" data-nosnippet>
      <div className="relative mx-auto flex min-h-9 max-w-7xl items-center justify-center px-space-5 py-1 text-center">
        <p className="text-sur-titre-petit">
          <span className="hidden sm:inline">{t("text")} </span>
          <Link href="/newsletter" className="whitespace-nowrap text-champagne underline decoration-or underline-offset-4 hover:text-blanc">
            {t("cta")}
          </Link>
        </p>
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-space-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-creme hover:text-blanc sm:right-space-2"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
