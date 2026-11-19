import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";

/**
 * robots.txt. Tant que le site est en construction, chaque page porte un « noindex »
 * (voir src/app/[locale]/layout.tsx) : Google doit pouvoir lire les pages pour le voir,
 * on ne bloque donc rien ici. Le Studio et les routes techniques sont exclus.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
