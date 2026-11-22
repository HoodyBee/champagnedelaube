/**
 * « À la une » du Mag : quelques articles tirés au hasard à chaque visite, parmi les articles
 * publiés qui ont une image.
 *
 * Comment : toutes les cartes candidates sont dans le HTML (Google les voit toutes, avec leur
 * lien) ; seules quelques-unes sont affichées. Une feuille de style montre d'abord les premières
 * (sans JavaScript, ou pour Google) ; un tout petit script, placé juste après la liste, tire au
 * sort les cartes à montrer AVANT le premier affichage : pas de saut visible, rien à télécharger
 * en plus, et les images des cartes masquées ne sont pas chargées (chargement différé).
 */
export const ID_STYLE_UNE = "une-choix";
export const ID_LISTE_UNE = "une-liste";

/** Affichage par défaut : les `montres` premières cartes. */
export const CSS_UNE_DEFAUT = (montres: number) => `#${ID_LISTE_UNE}>li:nth-child(n+${montres + 1}){display:none}`;

/** Affichage des cartes tirées au sort, dans l'ordre du tirage. */
export const cssUne = (choix: number[]) =>
  `#${ID_LISTE_UNE}>li{display:none}` + choix.map((k, j) => `#${ID_LISTE_UNE}>li[data-i="${k}"]{display:block;order:${j}}`).join("");

/** Script exécuté pendant le chargement de la page (même logique que cssUne, sans dépendance). */
export const scriptUne = (total: number, montres: number) =>
  `(function(){try{var s=document.getElementById("${ID_STYLE_UNE}");if(!s)return;var o=[];for(var i=0;i<${total};i++)o.push(i);` +
  `for(var i=o.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=o[i];o[i]=o[j];o[j]=x;}` +
  `var c="#${ID_LISTE_UNE}>li{display:none}";for(var k=0;k<${montres};k++)c+='#${ID_LISTE_UNE}>li[data-i="'+o[k]+'"]{display:block;order:'+k+"}";` +
  `s.textContent=c;}catch(e){}})();`;
