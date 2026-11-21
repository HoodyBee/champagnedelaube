/** Petit cœur azur (couleur du blason de Troyes) : remplace le rond de couleur devant « Troyes, capitale de l'Aube ». */
export function CoeurTroyes({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 14" className={`shrink-0 text-azur-troyes ${className}`} fill="currentColor">
      <path d="M8 13.6 6.9 12.6C2.9 9 .3 6.6.3 3.9.3 1.7 2 0 4.2 0c1.2 0 2.4.6 3.1 1.5h1.4C9.4.6 10.6 0 11.8 0 14 0 15.7 1.7 15.7 3.9c0 2.7-2.6 5.1-6.6 8.7L8 13.6Z" />
    </svg>
  );
}
