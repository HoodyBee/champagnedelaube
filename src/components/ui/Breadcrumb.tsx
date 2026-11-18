import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { getPathname, Link } from "@/i18n/navigation";
import { SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

type Href = ComponentProps<typeof Link>["href"];

/** Fil d'Ariane visible + données structurées BreadcrumbList pour Google. */
export function Breadcrumb({ items, locale }: { items: { label: string; href?: Href }[]; locale: Locale }) {
  const t = useTranslations("ui");
  const all = [{ label: t("home"), href: "/" as Href }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: SITE_URL + getPathname({ href: item.href as never, locale }) } : {}),
    })),
  };
  return (
    <nav aria-label={t("breadcrumb")} className="mx-auto max-w-7xl px-space-2 pt-space-2 sm:px-space-4">
      <ol className="flex flex-wrap items-center gap-1 text-sur-titre-petit text-gris-chaud">
        {all.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href && i < all.length - 1 ? (
              <Link href={item.href} className="hover:text-bronze">{item.label}</Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
