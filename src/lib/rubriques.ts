// Codes des rubriques du Mag prêtes à l'emploi. Fichier sans dépendance : il est aussi lu par le
// proxy (src/proxy.ts), qui vérifie qu'une adresse /le-mag/<rubrique>/ existe avant d'afficher la page.

/** Rubriques prêtes à l'emploi (renommables en créant une rubrique du même code dans Sanity). */
export const RUBRIQUES_PAR_DEFAUT = ["actualites", "accords", "tout-savoir", "portraits", "autres-horizons"] as const;
