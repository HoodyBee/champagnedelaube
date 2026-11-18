"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { confirmNewsletter, type ConfirmState } from "@/app/actions/newsletter";
import { ButtonLink, buttonClass } from "@/components/ui/Button";

/**
 * Bouton « Confirmer mon inscription ». On demande un clic plutôt que de confirmer à
 * l'ouverture du lien : certains anti-spams ouvrent les liens des e-mails tout seuls.
 */
export function ConfirmNewsletter() {
  const t = useTranslations("newsletter.confirm");
  const token = useSearchParams().get("token") ?? "";
  const [state, action, pending] = useActionState<ConfirmState, FormData>(confirmNewsletter, { status: "idle" });

  if (state.status === "idle") {
    if (!token) return <Result title={t("invalid")} text={t("retry")} button={t("retryButton")} href="/newsletter" />;
    return (
      <form action={action} className="mt-space-3">
        <input type="hidden" name="token" value={token} />
        <p className="text-gris-chaud">{t("intro")}</p>
        <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass("primaire", "mt-space-3 disabled:opacity-60")}>
          {pending ? t("sending") : t("button")}
        </button>
      </form>
    );
  }
  if (state.status === "success") return <Result title={t("success")} text={t("successText")} button={t("backHome")} href="/" />;
  return <Result title={t(state.status)} text={t("retry")} button={t("retryButton")} href="/newsletter" />;
}

function Result({ title, text, button, href }: { title: string; text: string; button: string; href: "/" | "/newsletter" }) {
  return (
    <div role="status" className="surface-chaude mt-space-3 rounded-carte p-space-3">
      <p className="text-accroche">{title}</p>
      <p className="mt-space-1 text-gris-chaud">{text}</p>
      <ButtonLink href={href} variant="secondaire" className="mt-space-3">
        {button}
      </ButtonLink>
    </div>
  );
}
