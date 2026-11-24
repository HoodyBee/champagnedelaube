import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirections } from "./src/redirections";

const nextConfig: NextConfig = {
  // Indexation décidée à la construction : Netlify fournit CONTEXT=production pendant la
  // construction du site en ligne, mais pas aux pages calculées à la visite. La valeur est
  // donc figée ici (voir SITE_INDEXABLE dans src/i18n/metadata.ts).
  env: { SITE_INDEXABLE_BUILD: process.env.CONTEXT === "production" || process.env.SITE_INDEXABLE === "1" ? "1" : "0" },
  cacheComponents: true,
  partialPrefetching: true,
  // Page 404 pour les adresses qui ne correspondent à aucune page (src/app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  // Les URL de l'ancien site WordPress se terminent par « / » : on garde ce format
  // pour préserver le référencement (/vignerons/ et non /vignerons).
  trailingSlash: true,
  // Anciennes adresses WordPress qui disparaissent : redirections 301 (voir src/redirections.ts).
  async redirects() {
    return redirections;
  },
  images: {
    // Images hébergées par Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Le plugin next-intl relie src/i18n/request.ts (chargement des traductions).
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
