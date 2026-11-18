/** Image prête à afficher (fichier du site ou image Sanity déjà convertie). */
export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Petite version floue affichée pendant le chargement (fournie par Sanity). */
  blurDataURL?: string;
};
