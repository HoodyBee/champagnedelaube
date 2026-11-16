import type { Metadata, Viewport } from "next";
import { inter, vollkorn } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.champagnedelaube.fr"),
  title: {
    default: "Champagne de l'Aube — Terroirs & émotions",
    template: "%s · Champagne de l'Aube",
  },
  description:
    "Faire découvrir le champagne aubois, vigneron par vigneron : Côte des Bar, Les Riceys, Montgueux, Villenauxe.",
  // Site en construction : on interdit l'indexation tant que la refonte n'est pas en ligne.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F9ECCE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${vollkorn.variable} ${inter.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
