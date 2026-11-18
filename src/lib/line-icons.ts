// Liste des pictos « au trait » dessinés pour le site (style du brand book :
// trait seul, épaisseur constante, bouts arrondis, sans remplissage).
// Les clés servent dans Sanity (liste déroulante) et dans le composant LineIcon.

export const lineIconOptions = [
  { value: "tarif", title: "Étiquette de prix (tarifs directs domaine)" },
  { value: "interlocuteur", title: "Personne (interlocuteur unique)" },
  { value: "degustation", title: "Verre (dégustation)" },
  { value: "vigneron", title: "Grappe (vigneron, sélection)" },
  { value: "coffret", title: "Coffret cadeau" },
  { value: "groupe", title: "Groupe de personnes (équipe, animation)" },
  { value: "calendrier", title: "Calendrier (date, événement)" },
  { value: "lieu", title: "Épingle (lieu)" },
  { value: "duree", title: "Horloge (durée)" },
  { value: "conseil", title: "Bulle de dialogue (conseil)" },
  { value: "carte", title: "Carte (terroir, géographie)" },
  { value: "sol", title: "Couches de sol (géologie)" },
  { value: "soleil", title: "Soleil (climat)" },
  { value: "livraison", title: "Caisse (livraison, commande)" },
  { value: "document", title: "Document (brochure, grille tarifaire)" },
] as const;

export type LineIconName = (typeof lineIconOptions)[number]["value"];
