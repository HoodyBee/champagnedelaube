import type { MetadataRoute } from "next";

/** Icône d'écran d'accueil (Android) : l'avatar de la marque, sur l'or de la charte. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Champagne de l'Aube",
    short_name: "Champagne de l'Aube",
    description: "Terroirs et champagnes de caractère",
    start_url: "/",
    display: "browser",
    background_color: "#FEFCF7",
    theme_color: "#BF9140",
    icons: [
      { src: "/icons/avatar-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/avatar-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/avatar-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
