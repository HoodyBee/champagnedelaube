import { notFound } from "next/navigation";

/**
 * Page technique, jamais liée et hors du plan du site : le proxy (src/proxy.ts) y envoie les
 * adresses qui n'existent pas. Fabriquée à l'avance pour chaque langue, elle affiche la page
 * « introuvable » du site (not-found.tsx), traduite et avec l'en-tête et le pied de page,
 * avec un vrai code 404.
 */
export default function PageIntrouvable() {
  notFound();
}
