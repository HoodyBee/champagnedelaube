import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { logos } from "@/lib/brand";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Fenêtre de vérification de l'âge, posée en surcouche au-dessus du site.
 * Elle est toujours présente dans le HTML (masquée par défaut) : Google indexe
 * donc tout le contenu. Son fonctionnement (ouverture, boutons, mémorisation,
 * clavier) est entièrement géré par le script de src/lib/age-gate.ts, sans React.
 */
export async function AgeGate({ locales }: { locales: readonly Locale[] }) {
  const t = await getTranslations("ageGate");

  return (
    <div
      data-age-gate-root
      className="age-gate fixed inset-0 z-[100] items-center justify-center overflow-y-auto bg-anthracite/75 p-space-2 backdrop-blur-md"
      data-nosnippet
    >
      <div
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

        <div data-age-actions suppressHydrationWarning className="mt-space-3 flex flex-col gap-space-1 sm:flex-row sm:justify-center">
          <button
            type="button"
            data-age-confirm
            className="min-h-12 whitespace-nowrap rounded-etiquette bg-anthracite px-space-3 text-sur-titre text-blanc transition-colors hover:bg-bleu-nuit"
          >
            {t("confirm")}
          </button>
          <button
            type="button"
            data-age-deny
            className="min-h-12 whitespace-nowrap rounded-etiquette border border-filet px-space-3 text-sur-titre text-anthracite transition-colors hover:border-bronze"
          >
            {t("deny")}
          </button>
        </div>
        <p
          data-age-denied
          hidden
          suppressHydrationWarning
          role="status"
          className="surface-chaude mt-space-3 rounded-carte p-space-2"
        >
          {t("denied")}
        </p>

        <div className="mt-space-3 flex justify-center">
          <LanguageSwitcher variant="inline" locales={locales} />
        </div>
        <p className="mt-space-2 text-legende text-gris-chaud">{t("remember")}</p>
      </div>
    </div>
  );
}
