import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { SanityImage as Image } from "@/components/ui/SanityImage";
import type { ReactNode } from "react";
import { lienLocalise } from "@/i18n/liens";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/sanity/lib/i18n";
import { urlFor } from "@/sanity/lib/image";

/** Affiche un texte enrichi saisi dans Sanity (paragraphes, H2/H3, listes, liens, images). */
export function RichText({
  value,
  locale,
  className = "",
  extras,
}: {
  value?: PortableTextBlock[] | null;
  locale: Locale;
  className?: string;
  /** Blocs spéciaux rendus côté serveur (ex. le calendrier du marronnier), par type de bloc. */
  extras?: Record<string, ReactNode>;
}) {
  if (!value?.length) return null;
  return (
    <div className={`space-y-space-2 text-[1.0625rem] ${className}`}>
      <PortableText value={value} components={components(locale, extras)} />
    </div>
  );
}

const components = (locale: Locale, extras?: Record<string, ReactNode>): PortableTextComponents => ({
  block: {
    h2: ({ children }) => <h2 className="pt-space-2 text-titre-section">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-space-1 text-[1.25rem] font-bold">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-or pl-space-2 text-accroche">{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-space-3 marker:text-or">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-space-3 marker:text-bronze">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    link: ({ value, children }) => {
      // Liens internes : adresse exacte dans la langue de la page (/en/winemakers/…).
      const href: string = lienLocalise(value?.href, locale) ?? "#";
      const external = /^https?:/.test(href);
      return (
        <a href={href} className="text-bronze underline" {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    calendrierMarronnier: () => <>{extras?.calendrierMarronnier ?? null}</>,
    imageAvecAlt: ({ value }) =>
      value?.asset ? (
        <figure>
          <Image
            src={urlFor(value).width(1600).url()}
            alt={localize(value.alt, locale) ?? ""}
            width={1600}
            height={1067}
            sizes="(min-width: 768px) 720px, 100vw"
            className="h-auto w-full"
          />
          {value.credit && <figcaption className="mt-1 text-legende text-gris-chaud">{value.credit}</figcaption>}
        </figure>
      ) : null,
  },
});
