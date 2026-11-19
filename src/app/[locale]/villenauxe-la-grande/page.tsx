import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TerroirView, terroirMetadata } from "@/components/terroirs/TerroirView";
import type { Locale } from "@/i18n/routing";

/** Terroir : villenauxe-la-grande (adresse historique). */
export async function generateMetadata({ params }: PageProps<"/[locale]/villenauxe-la-grande">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return terroirMetadata("villenauxe", locale);
}

export default async function VillenauxePage({ params }: PageProps<"/[locale]/villenauxe-la-grande">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <TerroirView cle="villenauxe" locale={locale} />;
}
