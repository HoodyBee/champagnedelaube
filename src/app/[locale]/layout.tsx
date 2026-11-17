import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/i18n/metadata";
import { inter, vollkorn } from "@/styles/fonts";
import "../globals.css";

// Une version statique de chaque page est générée pour chaque langue.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s · ${t("siteName")}` },
    description: t("defaultDescription"),
    // Site en construction : indexation interdite tant que la refonte n'est pas en ligne
    // (sera levé à l'étape 7, au moment de la mise en production).
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Indique la langue à next-intl pour que les pages restent statiques (rapides).
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${vollkorn.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
