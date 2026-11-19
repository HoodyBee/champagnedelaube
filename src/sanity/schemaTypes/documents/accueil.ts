import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { repriseField } from "../objects/blocs";
import { requireFr } from "../objects/localized";

/** Une des 3 entrées de l'accueil (Professionnels / Entreprises / Particuliers). */
const entree = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    description,
    type: "object",
    group: "entrees",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({ name: "surTitre", title: "Sur-titre", type: "localeString" }),
      defineField({ name: "titre", title: "Titre", type: "localeString", validation: requireFr }),
      defineField({ name: "texte", title: "Texte", type: "localeText" }),
      defineField({ name: "bouton", title: "Texte du bouton", type: "localeString" }),
      defineField({ name: "image", title: "Photo", type: "imageAvecAlt" }),
    ],
  });

/** Page d'accueil (document unique). */
export const accueil = defineType({
  name: "accueil",
  title: "Page d'accueil",
  type: "document",
  icon: icon("home"),
  groups: [
    { name: "hero", title: "Ouverture", default: true },
    { name: "entrees", title: "Les 3 entrées" },
    { name: "sections", title: "Terroir et vignerons" },
    { name: "reassurance", title: "Réassurance" },
    { name: "seo", title: "Référencement" },
    { name: "reprise", title: "Ancien site" },
  ],
  fields: [
    defineField({ name: "hero", title: "Ouverture", type: "hero", group: "hero" }),
    defineField({
      name: "heroVideo",
      title: "Vidéo d'ouverture (facultatif)",
      description: "Courte vidéo silencieuse en boucle (MP4, 10 Mo maximum). La photo sert d'image d'attente.",
      type: "file",
      options: { accept: "video/mp4" },
      group: "hero",
    }),
    defineField({
      name: "chiffres",
      title: "Bandeau de chiffres clés (sous l'ouverture)",
      type: "array",
      group: "hero",
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "chiffre" })],
    }),

    entree("entreePro", "Entrée 1 : Professionnels", "Bouton vers l'Espace Pro (restaurants, cavistes, hôtels)."),
    entree("entreeEntreprises", "Entrée 2 : Entreprises & CSE", "Bouton vers la page Entreprises & CSE."),
    entree("entreeParticuliers", "Entrée 3 : Particuliers", "Bouton vers l'espace Particuliers (/tasting-troyes/)."),

    defineField({ name: "terroir", title: "Section « Le terroir de l'Aube »", type: "blocTexte", group: "sections" }),
    defineField({ name: "heroCtaDegustation", title: "Ouverture : bouton principal", description: "Vers les dégustations privées. Par défaut : « Réserver une dégustation ».", type: "localeString", group: "hero" }),
    defineField({ name: "heroCtaTerroirs", title: "Ouverture : bouton secondaire", description: "Par défaut : « Découvrir les terroirs ».", type: "localeString", group: "hero" }),
    defineField({ name: "pepitesTitre", title: "« Les pépites du moment » : titre", type: "localeString", group: "sections" }),
    defineField({ name: "pepitesIntro", title: "« Les pépites du moment » : introduction", description: "Les cuvées affichées sont les documents « Cuvée » cochés « Afficher sur l'accueil ».", type: "localeText", group: "sections" }),
    defineField({ name: "degustationTitre", title: "« Dégustations privées » : titre", type: "localeString", group: "sections" }),
    defineField({ name: "degustationAccroche", title: "« Dégustations privées » : accroche", type: "localeString", group: "sections" }),
    defineField({ name: "degustationTexte", title: "« Dégustations privées » : texte court", type: "localeText", group: "sections" }),
    defineField({
      name: "degustationImage",
      title: "« Dégustations privées » : photo",
      description: "Une vraie dégustation : des personnes autour d'une table, une cuvée présentée. Pas de verres levés (loi Évin).",
      type: "imageAvecAlt",
      group: "sections",
    }),
    defineField({
      name: "photoPleineLargeur",
      title: "Grande photo pleine largeur",
      description: "Une respiration entre les sections : un paysage, un village, des mains au travail. Format paysage, au moins 2400 px de large.",
      type: "imageAvecAlt",
      group: "sections",
    }),
    defineField({ name: "selectionTitre", title: "Encadré « Notre sélection » : titre", description: "Par défaut : « Notre sélection évolue au fil des rencontres ».", type: "localeString", group: "sections" }),
    defineField({ name: "selectionTexte", title: "Encadré « Notre sélection » : texte", type: "localeText", group: "sections" }),

    defineField({
      name: "reassurance",
      title: "Points de réassurance",
      description: "Ex. : « Interlocuteur unique », « Tarifs directs domaine », « Vignerons indépendants ».",
      type: "array",
      group: "reassurance",
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "argument" })],
    }),
    repriseField("reprise"),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
