import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Le "proxy" s'exécute avant chaque page : il lit la langue dans l'URL
// (/en/, /nl/, /it/ ou rien pour le français) et traduit les URL.
const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intl(request);
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
