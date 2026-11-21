import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AgeGate } from "@/components/layout/AgeGate";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { routing, type Locale } from "@/i18n/routing";
import { getArticles } from "@/sanity/content";
import { ageGateScript } from "@/lib/age-gate";
import { newsletterBarScript } from "@/lib/newsletter-bar";
import { NewsletterBar } from "@/components/newsletter/NewsletterBar";
import { getActiveLocales, getReglages, socialLinks } from "@/sanity/queries";
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

  const t = await getTranslations({ locale, namespace: "nav" });
  const [reglages, activeLocales, articles] = await Promise.all([getReglages(), getActiveLocales(), getArticles(locale as Locale)]);
  // Rubriques du Mag qui ont au moins un article publié : les autres sont masquées du menu (et y reviennent seules).
  const rubriquesPubliees = [...new Set(articles.flatMap((a) => a.rubriques))];

  return (
    // suppressHydrationWarning : le script de vérification de l'âge peut ajouter
    // un attribut sur <html> avant l'affichage, c'est voulu.
    <html lang={locale} className={`${vollkorn.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ageGateScript + newsletterBarScript }} />
      </head>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          {/* suppressHydrationWarning : le script de vérification de l'âge peut poser
              l'attribut « inert » sur ce bloc avant que React ne démarre. */}
          <div id="site" className="flex min-h-dvh flex-col" suppressHydrationWarning>
            <a
              href="#contenu"
              className="sr-only z-50 rounded-etiquette bg-anthracite px-space-2 py-space-1 text-blanc focus:not-sr-only focus:fixed focus:left-space-2 focus:top-space-2"
            >
              {t("skipToContent")}
            </a>
            <NewsletterBar />
            <Header social={socialLinks(reglages)} locales={activeLocales} rubriquesPubliees={rubriquesPubliees} />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer locales={activeLocales} />
          </div>
          <AgeGate locales={activeLocales} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
