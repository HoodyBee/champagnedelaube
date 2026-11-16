import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Le "proxy" s'exécute avant chaque page : il lit la langue dans l'URL
// (/en/, /nl/, /it/ ou rien pour le français) et traduit les URL.
export default createMiddleware(routing);

export const config = {
  // On ignore : l'API, le Studio Sanity, les fichiers internes de Next.js et
  // tous les fichiers (images, favicon, robots.txt…).
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
