"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useRef } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { buttonClass } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { HONEYPOT, STARTED_AT } from "@/lib/forms/definitions";

/**
 * Inscription aux actualités : e-mail + « 18 ans ou plus » + consentement.
 * Même parcours partout (page Newsletter, pied de page) : un e-mail de confirmation
 * est envoyé, l'inscription n'est effective qu'après le clic (double opt-in).
 */
export function NewsletterForm({ variant = "clair" }: { variant?: "clair" | "sombre" }) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const pathname = usePathname();
  const uid = useId();
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, { status: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);
  const dark = variant === "sombre";

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={`rounded-carte p-space-3 outline-none ${dark ? "border border-blanc/20" : "surface-chaude"}`}>
        <p className={`text-accroche ${dark ? "text-creme" : ""}`}>{t("success.title")}</p>
        <p className={`mt-space-1 ${dark ? "text-blanc" : "text-gris-chaud"}`}>{t("success.text", { email: state.email ?? "" })}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const text = dark ? "text-blanc" : "text-anthracite";
  const muted = dark ? "text-creme" : "text-gris-chaud";
  const errColor = dark ? "text-[#F2A7A0]" : "text-story-accords";

  return (
    <form key={state.nonce ?? 0} action={action} noValidate className="grid gap-space-2" onFocusCapture={startOnInteraction}>
      <input type="hidden" name="_locale" value={locale} />
      <input type="hidden" name="_page" value={pathname} />
      <input ref={markStart} type="hidden" name={STARTED_AT} defaultValue={state.startedAt ?? ""} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && state.message && state.message !== "invalid" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className={`rounded-etiquette border p-space-2 outline-none ${dark ? "border-blanc/30 text-blanc" : "border-story-accords text-story-accords"}`}>
          {t(`errors.${state.message}`)}
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-email`} className={`mb-1 block text-[0.9375rem] font-bold ${text}`}>
          {t("form.email")}
        </label>
        <div className="flex flex-col gap-space-1 sm:flex-row">
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email ?? ""}
            aria-invalid={err.email ? true : undefined}
            aria-describedby={err.email ? `${uid}-email-err` : undefined}
            className="min-h-12 w-full flex-1 rounded-etiquette border border-filet bg-blanc px-space-2 text-anthracite focus:border-bronze focus:outline-none aria-[invalid=true]:border-story-accords"
          />
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className={buttonClass(dark ? "clair" : "primaire", "shrink-0 disabled:opacity-60")}
          >
            {pending ? t("form.sending") : t("form.submit")}
          </button>
        </div>
        {err.email && (
          <p id={`${uid}-email-err`} className={`mt-1 text-[0.875rem] ${errColor}`}>
            {t(`errors.${err.email}`)}
          </p>
        )}
      </div>

      {(["majeur", "consentement"] as const).map((name) => (
        <div key={name}>
          <label className={`flex cursor-pointer items-start gap-space-1 text-[0.9375rem] ${text}`}>
            <input
              type="checkbox"
              name={name}
              required
              aria-invalid={err[name] ? true : undefined}
              aria-describedby={err[name] ? `${uid}-${name}-err` : undefined}
              className={`mt-1 h-5 w-5 shrink-0 ${dark ? "accent-or" : "accent-anthracite"}`}
            />
            <span>
              {name === "majeur"
                ? t("form.majeur")
                : t.rich("form.consentement", {
                    link: (chunks) => (
                      <Link href="/politique-de-confidentialite" className="underline hover:text-bronze">
                        {chunks}
                      </Link>
                    ),
                  })}
            </span>
          </label>
          {err[name] && (
            <p id={`${uid}-${name}-err`} className={`mt-1 text-[0.875rem] ${errColor}`}>
              {t(`errors.${err[name]}`)}
            </p>
          )}
        </div>
      ))}
      <p className={`text-legende ${muted}`}>{t("form.doubleOptIn")}</p>
    </form>
  );
}

/**
 * Anti-robot : note l'heure à laquelle le formulaire apparaît (un humain met plus de
 * 2 secondes à le remplir). Une « ref » de rappel fonctionne aussi quand Next.js a
 * préparé la page à l'avance, contrairement à un useEffect.
 */
function markStart(el: HTMLInputElement | null) {
  if (el && !el.value) el.value = String(Date.now());
}

/** Filet de sécurité : au plus tard, le minuteur démarre à la première interaction avec le formulaire. */
function startOnInteraction(e: React.FocusEvent<HTMLFormElement>) {
  markStart(e.currentTarget.elements.namedItem(STARTED_AT) as HTMLInputElement | null);
}
