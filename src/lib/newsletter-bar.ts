// Bandeau « actualités » au-dessus de l'en-tête : une fois fermé, il reste fermé
// (mémorisé dans le navigateur). Ce petit script, placé dans le <head>, le masque
// avant le premier affichage pour éviter tout clignotement.
export const NL_BAR_KEY = "cda_nl_bar";

export const newsletterBarScript = `(function(){try{if(localStorage.getItem("${NL_BAR_KEY}")==="0")document.documentElement.setAttribute("data-nl-bar","hidden")}catch(e){}})();`;
