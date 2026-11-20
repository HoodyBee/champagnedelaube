import { getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/forms/LeadForm";
import { SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { getCalendrierVue } from "@/lib/calendrier-serveur";
import { CATEGORIES_CALENDRIER } from "@/sanity/content";
import { MarronnierTable } from "./MarronnierTable";

/**
 * Bloc « Calendrier du marronnier » placé dans un article : le tableau filtrable,
 * le formulaire du PDF, la mention sanitaire et les données structurées Event de mes événements.
 */
export async function MarronnierBloc({ locale, annee }: { locale: Locale; annee?: number }) {
  const [t, tLegal, dates] = await Promise.all([
    getTranslations({ locale, namespace: "calendrier" }),
    getTranslations({ locale, namespace: "legal" }),
    getCalendrierVue(locale),
  ]);
  const anneePdf = annee ?? Number(dates.find((d) => d.categorie !== "evenements")?.debut.slice(0, 4) ?? new Date().getFullYear() + 1);

  // Données structurées : uniquement mes événements (de vrais rendez-vous avec un lieu).
  const evenements = dates
    .filter((d) => d.categorie === "evenements" && d.debutIso)
    .map((d) => ({
      "@type": "Event",
      name: d.titre,
      startDate: d.debutIso,
      ...(d.finIso ? { endDate: d.finIso } : {}),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      ...(d.anecdote ? { description: d.anecdote } : {}),
      ...(d.lien ? { url: d.lien.startsWith("http") ? d.lien : SITE_URL + d.lien } : {}),
      location: {
        "@type": "Place",
        name: d.lieu?.nom ?? d.lieu?.ville ?? "Troyes",
        address: {
          "@type": "PostalAddress",
          ...(d.lieu?.adresse ? { streetAddress: d.lieu.adresse } : {}),
          ...(d.lieu?.codePostal ? { postalCode: d.lieu.codePostal } : {}),
          addressLocality: d.lieu?.ville ?? "Troyes",
          addressCountry: "FR",
        },
      },
      organizer: { "@type": "Organization", name: "Champagne de l'Aube", url: SITE_URL },
    }));

  return (
    // Plus large que le texte de l'article sur ordinateur, pour un tableau confortable.
    <div className="not-prose lg:-mx-24">
      <MarronnierTable
        dates={dates}
        locale={locale}
        annee={annee}
        textes={{
          categories: Object.fromEntries(CATEGORIES_CALENDRIER.map((c) => [c, t(`categories.${c}`)])) as Record<(typeof CATEGORIES_CALENDRIER)[number], string>,
          filtreCategorie: t("filtreCategorie"),
          filtreMois: t("filtreMois"),
          toutes: t("toutes"),
          tousLesMois: t("tousLesMois"),
          colDate: t("colDate"),
          colJournee: t("colJournee"),
          colCategorie: t("colCategorie"),
          colAnecdote: t("colAnecdote"),
          aConfirmer: t("aConfirmer"),
          aucune: t("aucune"),
          resultats: [t("resultats", { count: 0 }), t("resultats", { count: 1 }), t("resultats", { count: 2 }).replace("2", "#")],
          lienExterne: t("lienExterne"),
          lienInterne: t("lienInterne"),
        }}
      />
      <p className="text-legende text-gris-chaud">{tLegal("health")}</p>

      <section id="pdf" aria-labelledby="marronnier-pdf" className="surface-chaude mt-space-4 rounded-carte p-space-3 sm:p-space-4">
        <h2 id="marronnier-pdf" className="text-titre-section">
          {t("pdfTitre")}
        </h2>
        <p className="mt-space-1 text-gris-chaud">{t("pdfTexte")}</p>
        <LeadForm formId="marronnier" context={`Marronnier ${anneePdf}`} className="mt-space-3" />
      </section>

      {evenements.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": evenements }) }} />
      )}
    </div>
  );
}
