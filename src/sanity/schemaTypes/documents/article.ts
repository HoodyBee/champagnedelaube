import { defineArrayMember, defineField, defineType } from "sanity";
import { icon } from "../../icons";
import { requireFr } from "../objects/localized";

/** Les six rubriques prêtes à l'emploi (codes utilisés dans les adresses /le-mag/<code>/). */
export const RUBRIQUES_OPTIONS = [
  { title: "Portraits de vignerons", value: "portraits" },
  { title: "Terroirs & cépages", value: "terroirs-cepages" },
  { title: "Accords mets & champagne", value: "accords" },
  { title: "Tout savoir sur le champagne", value: "tout-savoir" },
  { title: "Œnotourisme", value: "oenotourisme" },
  { title: "Actualités", value: "actualites" },
];

/** Article du Mag (recette, accord, pédagogie, portrait). Publié à la racine du site : /mon-article/. */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: icon("book"),
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({ name: "titre", title: "Titre (H1)", type: "localeString", group: "contenu", validation: requireFr }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Donne champagnedelaube.fr/adresse/. Pour les anciens articles, garder exactement l'adresse actuelle.",
      type: "slug",
      group: "contenu",
      options: { source: "titre.fr" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rubriquePrincipale",
      title: "Rubrique principale",
      description:
        "Celle qui définit le fil d'Ariane et la rubrique affichée sur l'article. L'adresse de l'article reste unique (champagnedelaube.fr/adresse/), quelle que soit la rubrique : pas de contenu dupliqué.",
      type: "string",
      group: "contenu",
      options: { list: RUBRIQUES_OPTIONS, layout: "dropdown" },
      validation: (r) => r.required().warning("Choisissez la rubrique principale de l'article."),
    }),
    defineField({
      name: "rubriques",
      title: "Rubriques secondaires",
      description: "L'article apparaît aussi dans ces rubriques (facultatif). Inutile d'y recocher la rubrique principale.",
      type: "array",
      group: "contenu",
      of: [{ type: "string" }],
      options: { list: RUBRIQUES_OPTIONS, layout: "grid" },
    }),
    defineField({
      name: "autresRubriques",
      title: "Autres rubriques (créées dans le Studio)",
      description: "Rubriques secondaires que vous avez créées vous-même dans « Le Mag : rubriques ».",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "reference", to: [{ type: "rubrique" }] })],
    }),
    defineField({
      name: "rubrique",
      title: "Rubrique (ancien site)",
      description: "Repris de l'ancien site. Remplacé par « Rubriques du Mag » ci-dessus.",
      type: "string",
      group: "contenu",
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
    defineField({ name: "date", title: "Date de publication", type: "date", group: "contenu", initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: "extrait", title: "Résumé (cartes et Google)", type: "localeText", group: "contenu" }),
    defineField({ name: "image", title: "Photo principale", type: "imageAvecAlt", group: "contenu" }),
    defineField({ name: "contenu", title: "Texte de l'article", type: "localeRichText", group: "contenu" }),
    defineField({
      name: "vignerons",
      title: "Vignerons cités",
      description: "L'article s'affiche aussi sur leur fiche (« Ils en parlent dans Le Mag »).",
      type: "array",
      group: "contenu",
      of: [defineArrayMember({ type: "reference", to: [{ type: "vigneron" }] })],
    }),
    defineField({
      name: "collaborationCommerciale",
      title: "Collaboration commerciale",
      description: "À cocher seulement si l'article est rémunéré ou réalisé contre des produits offerts (loi influence 2023).",
      type: "boolean",
      group: "contenu",
      initialValue: false,
    }),
    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "titre.fr", principale: "rubriquePrincipale", rubriques: "rubriques", date: "date", media: "image" },
    prepare: ({ title, principale, rubriques, date, media }) => ({
      title,
      subtitle: [date, principale && `★ ${principale}`, ...(rubriques ?? [])].filter(Boolean).join(" · "),
      media,
    }),
  },
});
