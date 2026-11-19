import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/sanity/lib/i18n";
import { urlFor } from "@/sanity/lib/image";

/** Affiche un texte enrichi saisi dans Sanity (paragraphes, H2/H3, listes, liens, images). */
export function RichText({ value, locale, className = "" }: { value?: PortableTextBlock[] | null; locale: Locale; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={`space-y-space-2 text-[1.0625rem] ${className}`}>
      <PortableText value={value} components={components(locale)} />
    </div>
  );
}

const components = (locale: Locale): PortableTextComponents => ({
  block: {
    h2: ({ children }) => <h2 className="pt-space-2 text-titre-section">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-space-1 text-[1.25rem] font-bold">{children}</h3>,
    blockquote: ({ children, value }) =>
      // Emplacement réservé à une anecdote personnelle, à remplir dans Sanity : bien visible, sans faire « chantier ».
      (value?.children?.[0] as { text?: string } | undefined)?.text?.startsWith("[VOTRE ANECDOTE]") ? (
        <p className="rounded-carte border border-dashed border-or bg-creme-clair p-space-2 text-gris-chaud">{children}</p>
      ) : (
        <blockquote className="border-l-2 border-or pl-space-2 text-accroche">{children}</blockquote>
      ),
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-space-3 marker:text-or">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-space-3 marker:text-bronze">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:/.test(href);
      return (
        <a href={href} className="text-bronze underline" {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
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
