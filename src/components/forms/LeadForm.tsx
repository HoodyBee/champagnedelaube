"use client";

import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useRef } from "react";
import { submitLead, type FormState } from "@/app/actions/forms";
import { buttonClass } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { forms, HONEYPOT, STARTED_AT, type FieldDef, type FormId } from "@/lib/forms/definitions";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Formulaire de demande (devis, réservation, inscription, contact…).
 * - `formId` : quel formulaire (voir src/lib/forms/definitions.ts)
 * - `context` : ce que la demande concerne (ex. titre de l'expérience), joint à l'e-mail
 */
export function LeadForm({ formId, context, className = "" }: { formId: FormId; context?: string; className?: string }) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const pathname = usePathname();
  const uid = useId();
  const [state, action, pending] = useActionState<FormState, FormData>(submitLead, { status: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);

  // Après l'envoi, le message de résultat reçoit le focus (lecteurs d'écran, clavier).
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={`surface-chaude rounded-carte p-space-3 outline-none sm:p-space-4 ${className}`}>
        <p className="text-accroche">{t("success.title")}</p>
        <p className="mt-space-1 text-gris-chaud">
          {formId === "catalogue" ? t(state.catalogueSent ? "success.catalogueSent" : "success.catalogueSoon") : t("success.text")}
        </p>
        {state.newsletter && <p className="mt-space-2 text-gris-chaud">{t("success.newsletter")}</p>}
        {formId === "brochureCse" && (
          state.downloadUrl ? (
            <a href={state.downloadUrl} target="_blank" rel="noopener" className={buttonClass("primaire", "mt-space-3")}>
              {t("success.download")}
            </a>
          ) : (
            <p className="mt-space-2 text-gris-chaud">{t("success.brochureByEmail")}</p>
          )
        )}
      </div>
    );
  }

  const def = forms[formId];
  const fields = def.fields as readonly FieldDef[];
  const err = (name: string) => state.errors?.[name];
  const value = (name: string) => state.values?.[name] ?? "";
  const id = (name: string) => `${uid}-${name}`;

  return (
    // La clé change à chaque réponse : le formulaire se réaffiche avec les valeurs saisies.
    <form key={state.nonce ?? 0} action={action} noValidate className={`grid gap-space-2 sm:grid-cols-2 ${className}`} aria-describedby={`${uid}-required`} onFocusCapture={startOnInteraction}>
      <input type="hidden" name="_form" value={formId} />
      <input type="hidden" name="_locale" value={locale} />
      <input type="hidden" name="_page" value={pathname} />
      <input type="hidden" name="_context" value={context ?? ""} />
      <input ref={markStart} type="hidden" name={STARTED_AT} defaultValue={value(STARTED_AT)} />
      {/* Piège à robots : invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-etiquette border border-story-accords bg-blanc p-space-2 text-story-accords outline-none sm:col-span-2">
          {t(`errors.${state.message}`)}
        </div>
      )}

      {fields.map((f) => {
        const required = f.required || (def.contact === "emailOuTelephone" && f.name === "email");
        const common = {
          id: id(f.name),
          name: f.name,
          required: f.required,
          autoComplete: f.autoComplete,
          "aria-invalid": err(f.name) ? true : undefined,
          "aria-describedby": err(f.name) ? `${id(f.name)}-err` : undefined,
          className:
            "w-full rounded-etiquette border border-filet bg-blanc px-space-2 py-[12px] text-[1rem] text-anthracite transition-colors placeholder:text-gris-chaud/60 hover:border-or focus:border-bronze focus:outline-none aria-[invalid=true]:border-story-accords",
        };
        return (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <label htmlFor={id(f.name)} className="mb-1 block text-[0.9375rem] font-bold">
              {t(`fields.${f.name}`)}
              {required && <span aria-hidden="true" className="text-bronze"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={5} maxLength={4000} defaultValue={value(f.name)} />
            ) : f.type === "select" ? (
              <select {...common} defaultValue={value(f.name)}>
                <option value="" disabled>
                  {t("choose")}
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {t(`options.${f.name}.${o}`)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={f.type}
                inputMode={f.type === "number" ? "numeric" : f.type === "tel" ? "tel" : undefined}
                min={f.type === "number" ? f.min : undefined}
                max={f.type === "number" ? f.max : undefined}
                defaultValue={value(f.name)}
              />
            )}
            {err(f.name) && (
              <p id={`${id(f.name)}-err`} className="mt-1 text-[0.875rem] text-story-accords">
                {t(`errors.${err(f.name)}`)}
              </p>
            )}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-space-1">
          <input
            type="checkbox"
            name="majeur"
            required
            defaultChecked={value("majeur") === "on"}
            aria-invalid={err("majeur") ? true : undefined}
            aria-describedby={err("majeur") ? `${uid}-majeur-err` : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-anthracite"
          />
          <span className="font-bold">
            {t("majeur")}
            <span aria-hidden="true" className="text-bronze"> *</span>
          </span>
        </label>
        {err("majeur") && (
          <p id={`${uid}-majeur-err`} className="mt-1 text-[0.875rem] text-story-accords">
            {t("errors.majeur")}
          </p>
        )}
      </div>

      {/* Actualités : facultatif, décoché par défaut (consentement explicite, RGPD). */}
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-space-1">
          <input
            type="checkbox"
            name="newsletter"
            defaultChecked={value("newsletter") === "on"}
            className="mt-1 h-5 w-5 shrink-0 accent-anthracite"
          />
          <span>{t("newsletterOptIn")}</span>
        </label>
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="sm:col-span-2">
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-language={locale} data-theme="light" data-appearance="interaction-only" />
        </div>
      )}

      <div className="flex flex-col gap-space-2 sm:col-span-2">
        <p id={`${uid}-required`} className="text-legende text-gris-chaud">
          {t("requiredHint")}{" "}
          {t.rich("rgpd", {
            link: (chunks) => (
              <Link href="/politique-de-confidentialite" className="underline hover:text-bronze">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass("primaire", "w-full disabled:opacity-60 sm:w-auto sm:self-start")}>
          {pending ? t("sending") : t(`submit.${formId}`)}
        </button>
      </div>
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
