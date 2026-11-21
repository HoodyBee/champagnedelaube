/* eslint-disable @next/next/no-html-link-for-pages -- page 404 autonome, hors du gabarit du site : liens HTML simples voulus. */
import type { Metadata } from "next";
import { inter, vollkorn } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page introuvable · Champagne de l'Aube",
  description: "Cette page n'existe pas ou a changé d'adresse.",
  robots: { index: false, follow: true },
};

const lien =
  "inline-flex min-h-12 items-center justify-center rounded-etiquette px-space-3 text-center text-sur-titre transition-colors border border-anthracite text-anthracite hover:bg-anthracite hover:text-blanc";

/**
 * Page 404 pour les adresses qui ne correspondent à aucune page du site (ex. /le-mag/a/b/).
 * Les contenus introuvables (article, vigneron…) utilisent src/app/[locale]/not-found.tsx, traduit.
 * Bilingue français / anglais, car la langue ne peut pas être déduite ici.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${vollkorn.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-creme-clair">
        <main className="mx-auto flex max-w-3xl flex-col items-center px-space-2 py-space-5 text-center sm:px-space-4 lg:py-[96px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- page autonome, sans optimiseur d'images */}
          <img src="/brand/logos/logo-empile-rond-bandeau.png" alt="Champagne de l'Aube" width={160} height={160} className="h-40 w-40" />
          <p className="mt-space-3 text-sur-titre text-bronze">Erreur 404 · Error 404</p>
          <h1 className="mt-space-1 text-titre-post">Cette page s&apos;est évaporée comme une bulle</h1>
          <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">
            L&apos;adresse a peut-être changé avec la nouvelle version du site, ou la page n&apos;existe plus.
          </p>
          <nav aria-label="Liens utiles" className="mt-space-4 flex w-full flex-col items-stretch gap-space-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a href="/" className={lien.replace("border border-anthracite text-anthracite hover:bg-anthracite hover:text-blanc", "bg-anthracite text-blanc hover:bg-anthracite/85")}>
              Retour à l&apos;accueil
            </a>
            <a href="/le-terroir-de-laube/" className={lien}>Les terroirs de l&apos;Aube</a>
            <a href="/tasting-troyes/" className={lien}>Dégustations privées</a>
            <a href="/le-mag/" className={lien}>Le Mag du Champagne</a>
          </nav>
          <p lang="en" className="mt-space-4 text-gris-chaud">
            This page could not be found. <a href="/en/" className="underline underline-offset-4 hover:text-anthracite">Go to the English home page</a>.
          </p>
        </main>
      </body>
    </html>
  );
}
