import type { LineIconName } from "@/lib/line-icons";

/**
 * Pictos « au trait » du site, dans le style du brand book : trait seul,
 * épaisseur constante, bouts arrondis, sans remplissage. Couleur = couleur du texte.
 */
export function LineIcon({ name, size = 32, className = "" }: { name: LineIconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<LineIconName, React.ReactNode> = {
  tarif: (
    <>
      <path d="M4 15.5V6a2 2 0 0 1 2-2h9.5L28 16.5 16.5 28 4 15.5z" />
      <circle cx="10" cy="10" r="2" />
      <path d="M14 20l6-6" />
    </>
  ),
  interlocuteur: (
    <>
      <circle cx="16" cy="11" r="5" />
      <path d="M6 27c1.5-5 5.5-8 10-8s8.5 3 10 8" />
    </>
  ),
  degustation: (
    <>
      <path d="M10 4h12l-1 8a5 5 0 0 1-10 0L10 4z" />
      <path d="M16 17v9M11 28h10" />
      <path d="M11 9h10" />
    </>
  ),
  vigneron: (
    <>
      <path d="M16 6c0-2 1.5-3 3-3" />
      <circle cx="12" cy="10" r="2.5" />
      <circle cx="18" cy="10" r="2.5" />
      <circle cx="15" cy="15" r="2.5" />
      <circle cx="21" cy="15" r="2.5" />
      <circle cx="12" cy="20" r="2.5" />
      <circle cx="18" cy="20" r="2.5" />
      <circle cx="15" cy="25" r="2.5" />
    </>
  ),
  coffret: (
    <>
      <rect x="4" y="12" width="24" height="16" rx="1.5" />
      <path d="M2.5 8h27v4h-27zM16 8v20" />
      <path d="M16 8c-2-4-7-5-7-2s5 2 7 2zM16 8c2-4 7-5 7-2s-5 2-7 2z" />
    </>
  ),
  groupe: (
    <>
      <circle cx="11" cy="11" r="3.5" />
      <circle cx="22" cy="12" r="3" />
      <path d="M3 26c1-4.5 4-7 8-7s7 2.5 8 7" />
      <path d="M18 19.5c1.2-.7 2.5-1 4-1 3.5 0 6 2.3 7 6.5" />
    </>
  ),
  calendrier: (
    <>
      <rect x="4" y="6" width="24" height="22" rx="2" />
      <path d="M4 12h24M10 3v6M22 3v6" />
      <path d="M16 15.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" />
    </>
  ),
  lieu: (
    <>
      <path d="M16 29s9-8.5 9-15.5a9 9 0 0 0-18 0C7 20.5 16 29 16 29z" />
      <circle cx="16" cy="13.5" r="3.5" />
    </>
  ),
  duree: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 9v7l5 3" />
    </>
  ),
  conseil: (
    <>
      <path d="M5 7h22v15H14l-6 5v-5H5z" />
      <path d="M10 12.5h12M10 17h8" />
    </>
  ),
  carte: (
    <>
      <path d="M4 8l8-3 8 3 8-3v19l-8 3-8-3-8 3z" />
      <path d="M12 5v19M20 8v19" />
    </>
  ),
  sol: (
    <>
      <path d="M3 9c4-2 8 2 13 0s9-2 13 0" />
      <path d="M3 15h26M3 21h26M3 27h26" />
      <path d="M8 18l2 0M20 24h2M14 12h1" />
    </>
  ),
  soleil: (
    <>
      <circle cx="16" cy="16" r="5" />
      <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2.1 2.1M23.1 23.1l2.1 2.1M6.8 25.2l2.1-2.1M23.1 8.9l2.1-2.1" />
    </>
  ),
  livraison: (
    <>
      <path d="M4 10l12-5 12 5v14l-12 5-12-5z" />
      <path d="M4 10l12 5 12-5M16 15v14" />
    </>
  ),
  document: (
    <>
      <path d="M8 3h11l6 6v20H8z" />
      <path d="M19 3v6h6M12 15h9M12 19h9M12 23h6" />
    </>
  ),
};
