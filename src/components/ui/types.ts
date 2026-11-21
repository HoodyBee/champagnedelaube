/** Image prête à afficher (fichier du site ou image Sanity déjà convertie). */
export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Petite version floue affichée pendant le chargement (fournie par Sanity). */
  blurDataURL?: string;
  /** Légende affichée sous la photo (ex. « Vignes de la Côte des Bar (illustration) »). */
  legende?: string;
  /** Point d'intérêt (hotspot du Studio) : position CSS « x% y% » pour les recadrages. */
  position?: string;
  /** Crédit photo (« © Champagne de l'Aube / Detectezmoi.com » par défaut). */
  credit?: string;
  /** Image de partage pour les réseaux sociaux (1200 × 630, recadrée sur le point d'intérêt). */
  og?: string;
};
