import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, type Locale } from "./i18n/routing";
import { adresseIntrouvable } from "./lib/adresses-connues";

// Le "proxy" s'exécute avant chaque page : il lit la langue dans l'URL
// (/en/, /nl/, /it/ ou rien pour le français) et traduit les URL.
const intl = createMiddleware(routing);

/**
 * Adresse sûrement introuvable (article, vigneron, cépage… qui n'existe pas) : on affiche
 * directement la page « introuvable » du site, avec un vrai code 404. Voir src/lib/adresses-connues.ts.
 */
function introuvable(request: NextRequest, locale: Locale) {
  const url = request.nextUrl.clone();
  // Adresse interne qui ne correspond à aucune page : Next.js y répond par la page 404 du site.
  url.pathname = `/${locale}/page-introuvable/404/`;
  const headers = new Headers(request.headers);
  headers.set("X-NEXT-INTL-LOCALE", locale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export default async function proxy(request: NextRequest) {
  const locale = await adresseIntrouvable(request.nextUrl.pathname);
  const response = locale ? introuvable(request, locale) : intl(request);
  // Adresses techniques de Netlify (admirable-choux-….netlify.app, aperçus de PR, branches) :
  // jamais dans Google. Seul https://champagnedelaube.fr est indexé.
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  if (host.endsWith(".netlify.app")) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // On ignore : l'API, le Studio Sanity, les fichiers internes de Next.js et
  // tous les fichiers (images, favicon, robots.txt…).
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
