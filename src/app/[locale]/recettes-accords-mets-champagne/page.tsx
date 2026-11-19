import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { RubriquePage, rubriqueMetadata } from "@/components/mag/RubriquePage";
import type { Locale } from "@/i18n/routing";

/** Rubrique du Mag, à son adresse historique /recettes-accords-mets-champagne/. */
export async function generateMetadata({ params }: PageProps<"/[locale]/recettes-accords-mets-champagne">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return rubriqueMetadata("accords", locale);
}

export default async function AccordsPage({ params }: PageProps<"/[locale]/recettes-accords-mets-champagne">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <RubriquePage code="accords" locale={locale} />;
}
