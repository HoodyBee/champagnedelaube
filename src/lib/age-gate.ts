// Vérification de l'âge : réglages partagés.
// Le cookie est purement technique (aucun suivi) : il mémorise la réponse un an.
export const AGE_COOKIE = "cda_age";
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Petit script exécuté avant le premier affichage : s'il ne trouve pas le cookie,
 * il ouvre la fenêtre (attribut data-age-gate="open" sur <html>). La page entière
 * reste dans le HTML : Google, qui lit le HTML, indexe tout le contenu.
 */
export const ageGateScript = `(function(){try{if(!/(?:^|;\\s*)${AGE_COOKIE}=1(?:;|$)/.test(document.cookie)){document.documentElement.setAttribute("data-age-gate","open")}}catch(e){}})();`;
