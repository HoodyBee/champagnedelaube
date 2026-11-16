import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Les URL de l'ancien site WordPress se terminent par « / » : on garde ce format
  // pour préserver le référencement (/vignerons/ et non /vignerons).
  trailingSlash: true,
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
