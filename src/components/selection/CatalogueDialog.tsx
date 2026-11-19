"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { buttonClass } from "@/components/ui/Button";

/**
 * Bouton « Recevoir notre sélection » : ouvre une fenêtre avec le formulaire court
 * (nom, e-mail, profil). Le catalogue PDF des Réglages du site part par e-mail.
 */
export function CatalogueDialog({ variant = "primaire", className = "" }: { variant?: "primaire" | "secondaire"; className?: string }) {
  const t = useTranslations("selection");
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={buttonClass(variant, className)} aria-haspopup="dialog">
        {t("bouton")}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="catalogue-titre"
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-carte border border-filet bg-blanc p-0 text-left text-anthracite backdrop:bg-anthracite/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-space-3 sm:p-space-4">
          <div className="flex items-start justify-between gap-space-2">
            <div>
              <p className="text-sur-titre text-bronze">{t("surTitre")}</p>
              <h2 id="catalogue-titre" className="mt-space-1 text-titre-section">{t("dialogTitre")}</h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mr-space-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-etiquette text-anthracite hover:text-bronze"
              aria-label={t("fermer")}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <p className="mt-space-1 text-gris-chaud">{t("dialogTexte")}</p>
          <LeadForm formId="catalogue" className="mt-space-3" />
        </div>
      </dialog>
    </>
  );
}
