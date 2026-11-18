import type { Locale } from "@/i18n/routing";

/** Petit drapeau d'une langue (anglais : drapeau britannique). Décoratif : le nom de la langue est écrit à côté. */
export function Flag({ locale, className = "" }: { locale: Locale; className?: string }) {
  const props = {
    viewBox: "0 0 30 20",
    width: 21,
    height: 14,
    "aria-hidden": true,
    className: `shrink-0 rounded-[2px] ring-1 ring-black/10 ${className}`,
  };
  switch (locale) {
    case "fr":
      return (
        <svg {...props}>
          <rect width="10" height="20" fill="#002654" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#CE1126" />
        </svg>
      );
    case "it":
      return (
        <svg {...props}>
          <rect width="10" height="20" fill="#009246" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#CE2B37" />
        </svg>
      );
    case "nl":
      return (
        <svg {...props}>
          <rect width="30" height="7" fill="#AE1C28" />
          <rect y="6.66" width="30" height="6.67" fill="#FFFFFF" />
          <rect y="13.33" width="30" height="6.67" fill="#21468B" />
        </svg>
      );
    case "de":
      return (
        <svg {...props}>
          <rect width="30" height="7" fill="#000000" />
          <rect y="6.66" width="30" height="6.67" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </svg>
      );
    case "en":
      return (
        <svg {...props} viewBox="0 0 60 40" preserveAspectRatio="none">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
          <path d="M30 0v40M0 20h60" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
        </svg>
      );
  }
}
