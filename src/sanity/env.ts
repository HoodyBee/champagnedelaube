// Paramètres de connexion à Sanity, lus dans les variables d'environnement
// (fichier .env.local sur votre ordinateur, réglages « Environment variables » sur Netlify).
// Ces deux valeurs ne sont pas secrètes : elles identifient seulement votre projet.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Date de version de l'API Sanity (à ne changer qu'en connaissance de cause).
export const apiVersion = "2026-11-01";

/** Vrai quand le projet Sanity est configuré. Tant que ce n'est pas le cas,
 *  le site fonctionne avec ses contenus d'exemple. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
