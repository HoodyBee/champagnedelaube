import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TerroirView, terroirMetadata } from "@/components/terroirs/TerroirView";
import type { Locale } from "@/i18n/routing";

/** Terroir : montgueux (adresse historique). */
export async function generateMetadata({ params }: PageProps<"/[locale]/montgueux">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return terroirMetadata("montgueux", locale);
}

export default async function MontgueuxPage({ params }: PageProps<"/[locale]/montgueux">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <TerroirView cle="montgueux" locale={locale} />;
}
