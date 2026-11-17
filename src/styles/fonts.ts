// Polices de la marque, auto-hébergées par next/font : les fichiers sont
// téléchargés une seule fois au moment du build puis servis depuis notre propre
// domaine. Aucun appel à Google côté visiteur (meilleur pour le RGPD et la vitesse).
import { Inter, Vollkorn } from "next/font/google";

/** Vollkorn : tout ce qui se lit (titres, accroches, textes, légendes). */
export const vollkorn = Vollkorn({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-vollkorn",
  display: "swap",
});

/** Inter : UNIQUEMENT les petites capitales espacées (bandeau, sur-titres, étiquettes). */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-inter",
  display: "swap",
});
