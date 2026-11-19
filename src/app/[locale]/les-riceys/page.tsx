import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TerroirView, terroirMetadata } from "@/components/terroirs/TerroirView";
import type { Locale } from "@/i18n/routing";

/** Terroir : les-riceys (adresse historique). */
export async function generateMetadata({ params }: PageProps<"/[locale]/les-riceys">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return terroirMetadata("les-riceys", locale);
}

export default async function LesRiceysPage({ params }: PageProps<"/[locale]/les-riceys">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return <TerroirView cle="les-riceys" locale={locale} />;
}
