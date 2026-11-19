import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { RubriquePage, rubriqueMetadata } from "@/components/mag/RubriquePage";
import type { Locale } from "@/i18n/routing";

/** Rubrique du Mag, à son adresse historique /tout-savoir-sur-le-champagne/. */
export async function generateMetadata({ params }: PageProps<"/[locale]/tout-savoir-sur-le-champagne">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return rubriqueMetadata("tout-savoir", locale);
}

export default async function ToutSavoirPage({ params }: PageProps<"/[locale]/tout-savoir-sur-le-champagne">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <RubriquePage code="tout-savoir" locale={locale} />;
}
