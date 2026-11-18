import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConfirmNewsletter } from "@/components/newsletter/ConfirmNewsletter";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/newsletter/confirmation">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "newsletter.confirm" });
  // Page technique : jamais dans Google.
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function ConfirmationPage({ params }: PageProps<"/[locale]/newsletter/confirmation">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("newsletter.confirm");
  return (
    <div className="mx-auto max-w-xl px-space-2 py-space-5 text-center sm:px-space-4">
      <h1 className="text-titre-post">{t("title")}</h1>
      <Suspense>
        <ConfirmNewsletter />
      </Suspense>
    </div>
  );
}
