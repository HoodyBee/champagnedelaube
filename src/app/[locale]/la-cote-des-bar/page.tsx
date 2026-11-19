import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TerroirView, terroirMetadata } from "@/components/terroirs/TerroirView";
import type { Locale } from "@/i18n/routing";

/** Terroir : la-cote-des-bar (adresse historique). */
export async function generateMetadata({ params }: PageProps<"/[locale]/la-cote-des-bar">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return terroirMetadata("cote-des-bar", locale);
}

export default async function CoteDesBarPage({ params }: PageProps<"/[locale]/la-cote-des-bar">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <TerroirView cle="cote-des-bar" locale={locale} />;
}
