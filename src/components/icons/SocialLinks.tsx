import type { SocialLinks as Links } from "@/sanity/queries";

type Labels = { label: string; instagram: string; facebook: string; linkedin: string };

/**
 * Icônes des réseaux sociaux, au trait fin (même style que les pictos du site).
 * La couleur suit le texte autour (anthracite dans l'en-tête, blanc dans le pied de page).
 * Un réseau sans lien (ex. LinkedIn vide dans les Réglages) n'est pas affiché.
 */
export function SocialLinks({
  links,
  labels,
  className = "",
  linkClassName = "",
  iconSize = 20,
  compact = false,
}: {
  links: Links;
  labels: Labels;
  className?: string;
  linkClassName?: string;
  /** Taille des icônes (px). */
  iconSize?: number;
  /** Zones cliquables plus étroites (barre de navigation). */
  compact?: boolean;
}) {
  const items = (["instagram", "facebook", "linkedin"] as const).filter((k) => links[k]);
  if (items.length === 0) return null;
  return (
    <ul aria-label={labels.label} className={`flex items-center ${className}`}>
      {items.map((k) => (
        <li key={k}>
          <a
            href={links[k]}
            target="_blank"
            rel="noopener"
            aria-label={labels[k]}
            title={labels[k]}
            className={`inline-flex ${compact ? "h-10 w-7" : "h-11 w-11"} items-center justify-center transition-colors ${linkClassName}`}
          >
            <SocialIcon name={k} size={iconSize} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SocialIcon({ name, size = 20 }: { name: "instagram" | "facebook" | "linkedin"; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "instagram")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  if (name === "facebook")
    return (
      <svg {...common}>
        <path d="M17 3h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="4.5" r="1.5" />
      <path d="M11 21v-7a4 4 0 0 1 8 0v7M11 9v12M15 21h4M15 10a4 4 0 0 1 4 4" />
    </svg>
  );
}
