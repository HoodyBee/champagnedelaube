/**
 * Mesure d'audience sans cookie (Plausible), PRÊTE MAIS DÉSACTIVÉE.
 * Elle ne s'active que si la variable NEXT_PUBLIC_PLAUSIBLE_SCRIPT est renseignée dans Netlify
 * (adresse du script donnée par Plausible, ex. https://plausible.io/js/script.js), puis le site reconstruit.
 * Mode d'emploi : docs/mise-en-ligne.md.
 */
export const AUDIENCE_SCRIPT = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT ?? "";
export const AUDIENCE_DOMAINE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "champagnedelaube.fr";
export const AUDIENCE_ACTIVE = /^https:\/\//.test(AUDIENCE_SCRIPT);
