"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from "@/lib/age-gate";
import { logos } from "@/lib/brand";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Fenêtre de vérification de l'âge, posée en surcouche au-dessus du site.
 * Elle est toujours présente dans le HTML (masquée par défaut) et ne s'affiche
 * que si le visiteur n'a pas encore répondu (voir src/lib/age-gate.ts).
 */
export function AgeGate() {
  const t = useTranslations("ageGate");
  const [denied, setDenied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-age-gate") !== "open") return;

    // Le reste du site devient inaccessible au clavier et aux lecteurs d'écran.
    // (On cible le bloc #site voisin : Next.js peut garder en mémoire, masquée,
    // la page précédente, avec son propre #site.)
    const site = siteOf(rootRef.current);
    site?.setAttribute("inert", "");
    confirmRef.current?.focus();

    // Garde le focus clavier dans la fenêtre.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      site?.removeAttribute("inert");
    };
  }, []);

  function confirm() {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AGE_COOKIE}=1; Max-Age=${AGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    document.documentElement.removeAttribute("data-age-gate");
    siteOf(rootRef.current)?.removeAttribute("inert");
  }

  return (
    <div
      ref={rootRef}
      className="age-gate fixed inset-0 z-[100] items-center justify-center overflow-y-auto bg-anthracite/75 p-space-2 backdrop-blur-md"
      data-nosnippet
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-text"
        className="age-gate-panel my-auto w-full max-w-xl rounded-carte border border-filet bg-blanc p-space-3 text-center sm:p-space-4"
      >
        <Image src={logos.avatar.src} alt="" width={72} height={72} sizes="72px" className="mx-auto h-18 w-18" />
        <p className="mt-space-2 text-sur-titre text-bronze">{t("eyebrow")}</p>
        <h2 id="age-gate-title" className="mt-space-1 text-accroche">{t("title")}</h2>
        <p id="age-gate-text" className="mt-space-2 text-gris-chaud">{t("text")}</p>

        {denied ? (
          <p role="status" className="surface-chaude mt-space-3 rounded-carte p-space-2">{t("denied")}</p>
        ) : (
          <div className="mt-space-3 flex flex-col gap-space-1 sm:flex-row sm:justify-center">
            <button
              ref={confirmRef}
              type="button"
              onClick={confirm}
              className="min-h-12 whitespace-nowrap rounded-etiquette bg-anthracite px-space-3 text-sur-titre text-blanc transition-colors hover:bg-bleu-nuit"
            >
              {t("confirm")}
            </button>
            <button
              type="button"
              onClick={() => setDenied(true)}
              className="min-h-12 whitespace-nowrap rounded-etiquette border border-filet px-space-3 text-sur-titre text-anthracite transition-colors hover:border-bronze"
            >
              {t("deny")}
            </button>
          </div>
        )}

        <div className="mt-space-3 flex justify-center">
          <LanguageSwitcher variant="inline" />
        </div>
        <p className="mt-space-2 text-legende text-gris-chaud">{t("remember")}</p>
      </div>
    </div>
  );
}

/** Le bloc #site qui précède la fenêtre dans la même page. */
function siteOf(gate: HTMLElement | null) {
  const el = gate?.previousElementSibling;
  return el?.id === "site" ? el : null;
}
