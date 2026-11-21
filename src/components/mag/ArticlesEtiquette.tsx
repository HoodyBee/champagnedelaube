import { getTranslations } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticles, getEtiquettes } from "@/sanity/content";

/**
 * Articles qui portent une étiquette (ex. « marketing ») : nom de l'étiquette, phrase d'intro,
 * cartes (photo, titre, résumé, lien). Rien n'est affiché tant qu'aucun article publié ne la porte.
 * Les liens mènent à l'adresse unique de chaque article (pas de doublon pour Google).
 */
export async function ArticlesEtiquette({
  cle,
  locale,
  titre,
  max = 3,
  fond = "blanc",
  lienMag = false,
}: {
  cle: string;
  locale: Locale;
  /** Titre à la place du nom de l'étiquette (ex. « Nos articles marketing »). */
  titre?: string;
  max?: number;
  fond?: "blanc" | "chaude";
  /** Lien « Tous les articles … » vers la section du Mag (quand il y a plus d'articles que de cartes). */
  lienMag?: boolean;
}) {
  const [etiquettes, articles, labels] = await Promise.all([getEtiquettes(locale), getArticles(locale), getRubriqueLabels(locale)]);
  const etiquette = etiquettes.find((e) => e.cle === cle);
  const liste = withDates(articles.filter((a) => a.etiquettes.includes(cle)), locale);
  if (!etiquette || !liste.length) return null;
  const t = await getTranslations({ locale, namespace: "mag" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });
  return (
    <Section id={`etiquette-${cle}`} fond={fond} align="gauche" surTitre={titre ? etiquette.nom : t("etiquette")} titre={titre ?? etiquette.nom} intro={etiquette.intro} className="scroll-mt-28">
      <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
        {liste.slice(0, max).map((a) => (
          <li key={a.slug}>
            <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
          </li>
        ))}
      </ul>
      {lienMag && liste.length > max && (
        <Link href={{ pathname: "/le-mag", hash: `etiquette-${cle}` }} className="mt-space-3 inline-flex min-h-11 items-center gap-1 text-sur-titre-petit underline decoration-or underline-offset-4 hover:text-bronze">
          {t("tousArticlesEtiquette", { etiquette: etiquette.nom })} <span aria-hidden="true">→</span>
        </Link>
      )}
    </Section>
  );
}

/** Étiquettes d'un article, cliquables vers leur section dans Le Mag. */
export async function EtiquettesArticle({ codes, locale, className = "" }: { codes: string[]; locale: Locale; className?: string }) {
  if (!codes.length) return null;
  const [etiquettes, t] = await Promise.all([getEtiquettes(locale), getTranslations({ locale, namespace: "mag" })]);
  const liste = etiquettes.filter((e) => codes.includes(e.cle));
  if (!liste.length) return null;
  return (
    <ul aria-label={t("etiquettesArticle")} className={`flex flex-wrap gap-space-1 ${className}`}>
      {liste.map((e) => (
        <li key={e.cle}>
          <Link
            href={{ pathname: "/le-mag", hash: `etiquette-${e.cle}` }}
            className="inline-flex min-h-9 items-center rounded-etiquette border border-or px-space-2 text-sur-titre-petit text-anthracite transition-colors hover:bg-champagne"
          >
            {e.nom}
          </Link>
        </li>
      ))}
    </ul>
  );
}
