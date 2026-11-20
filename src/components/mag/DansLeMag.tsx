import { getTranslations } from "next-intl/server";
import { MagCard } from "@/components/mag/MagCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { getRubriqueLabels, withDates } from "@/lib/mag";
import { getArticles, getSlugsArticlesLiantVers } from "@/sanity/content";

/**
 * « Dans Le Mag » : les articles qui parlent de cette page (ils contiennent un lien vers elle).
 * Maillage interne automatique : chaque article qui cite une page lui renvoie un lien en retour.
 * Complété, si besoin, par les articles d'une rubrique proche. Rien ne s'affiche sans article.
 */
export async function DansLeMag({
  locale,
  chemins,
  rubrique,
  fond = "blanc",
  max = 3,
}: {
  locale: Locale;
  chemins: string[];
  rubrique?: string;
  fond?: "blanc" | "chaude";
  max?: number;
}) {
  const [slugs, articles, labels, t, tLegal] = await Promise.all([
    getSlugsArticlesLiantVers(chemins),
    getArticles(locale),
    getRubriqueLabels(locale),
    getTranslations({ locale, namespace: "mag" }),
    getTranslations({ locale, namespace: "legal" }),
  ]);
  const choisis = [
    ...slugs.map((s) => articles.find((a) => a.slug === s)).filter((a) => !!a),
    ...(rubrique ? articles.filter((a) => a.rubriques.includes(rubrique) && !slugs.includes(a.slug)) : []),
  ].slice(0, max);
  if (!choisis.length) return null;
  return (
    <Section fond={fond} surTitre={t("h1")} titre={t("dansLeMag")} align="gauche">
      <ul className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-3">
        {withDates(choisis, locale).map((a) => (
          <li key={a.slug}>
            <MagCard article={a} labels={labels} lire={t("lire")} sponsored={tLegal("sponsored")} />
          </li>
        ))}
      </ul>
      <div className="mt-space-4">
        <ButtonLink href="/le-mag" variant="secondaire">
          {t("retour")}
        </ButtonLink>
      </div>
    </Section>
  );
}
