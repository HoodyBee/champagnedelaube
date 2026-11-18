import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
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
    defineField({ name: "vigneronsTitre", title: "Titre de la section vignerons", type: "localeString", group: "sections" }),
    defineField({ name: "vigneronsIntro", title: "Introduction de la section vignerons", type: "localeText", group: "sections" }),
    defineField({
      name: "vigneronsSelection",
      title: "Vignerons mis en avant",
      description: "3 à 6 domaines. Laissez vide pour afficher automatiquement les premiers partenaires.",
      type: "array",
      group: "sections",
      validation: (r) => r.max(6),
      of: [defineArrayMember({ type: "reference", to: [{ type: "vigneron" }] })],
    }),

    defineField({
      name: "reassurance",
      title: "Points de réassurance",
      description: "Ex. : « Interlocuteur unique », « Tarifs directs domaine », « Vignerons indépendants ».",
      type: "array",
      group: "reassurance",
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "argument" })],
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
