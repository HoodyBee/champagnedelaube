import { icon } from "../../icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { cepages, pictos } from "../../../lib/brand";
import { requireFr } from "../objects/localized";

/** Fiche d'un domaine viticole partenaire ou présenté. */
export const vigneron = defineType({
  name: "vigneron",
  title: "Vigneron",
  type: "document",
  icon: icon("users"),
  groups: [
    { name: "identite", title: "Identité", default: true },
    { name: "histoire", title: "Histoire" },
    { name: "vignoble", title: "Vignoble et pictos" },
    { name: "photos", title: "Photos" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    defineField({
      name: "nom",
      title: "Nom du domaine",
      description: "Ex. : Champagne Moutard*Dangin.",
      type: "string",
      group: "identite",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description:
        "Fin de l'URL (ex. moutard-dangin donne /vignerons/moutard-dangin/). Cliquez sur « Generate ». À ne plus modifier une fois la page en ligne.",
      type: "slug",
      group: "identite",
      options: {
        source: "nom",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/^champagne\s+/, "")
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "village",
      title: "Village",
      type: "string",
      group: "identite",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "terroir",
      title: "Terroir",
      type: "reference",
      to: [{ type: "terroir" }],
      group: "identite",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accroche",
      title: "Accroche",
      description: "Une phrase qui présente le domaine à travers ses vignerons.",
      type: "localeString",
      group: "identite",
      validation: requireFr,
    }),
    defineField({
      name: "partenaire",
      title: "Partenaire de Champagne de l'Aube",
      description: "Cochez si le domaine fait partie de la sélection partenaire.",
      type: "boolean",
      group: "identite",
      initialValue: true,
    }),
    defineField({
      name: "collaborationCommerciale",
      title: "Collaboration commerciale",
      description:
        "Obligatoire (loi influence 2023) si la fiche est rémunérée ou réalisée contre des produits offerts : la mention « Collaboration commerciale » s'affichera sur la page.",
      type: "boolean",
      group: "identite",
      initialValue: false,
    }),
    defineField({
      name: "espacePro",
      title: "Afficher dans l'Espace Pro",
      description: "Le domaine apparaît dans le portfolio présenté aux restaurants et cavistes (sans aucun prix).",
      type: "boolean",
      group: "identite",
      initialValue: true,
    }),
    defineField({ name: "logo", title: "Logo du domaine", type: "imageAvecAlt", group: "identite" }),
    defineField({ name: "siteWeb", title: "Site internet", type: "url", group: "identite" }),
    defineField({ name: "instagram", title: "Instagram (sans le @)", type: "string", group: "identite" }),
    defineField({
      name: "ordre",
      title: "Ordre d'affichage",
      description: "Les plus petits nombres s'affichent en premier.",
      type: "number",
      group: "identite",
      initialValue: 10,
    }),

    defineField({
      name: "philosophie",
      title: "Philosophie (2 ou 3 phrases)",
      description: "Affichée sur la carte du domaine dans l'Espace Pro et la page Notre Sélection. Les gens avant les étiquettes.",
      type: "localeText",
      group: "histoire",
    }),
    defineField({ name: "intro", title: "Introduction", type: "localeText", group: "histoire" }),
    defineField({
      name: "personnes",
      title: "Les vignerons",
      description: "Les personnes qui font le domaine.",
      type: "array",
      group: "histoire",
      of: [
        defineArrayMember({
          type: "object",
          name: "personne",
          fields: [
            defineField({ name: "nom", title: "Prénom et nom", type: "string" }),
            defineField({ name: "role", title: "Rôle", description: "Ex. : dirige le domaine depuis 1985.", type: "localeString" }),
            defineField({ name: "photo", title: "Portrait", type: "imageAvecAlt" }),
          ],
          preview: { select: { title: "nom", subtitle: "role.fr", media: "photo" } },
        }),
      ],
    }),
    defineField({ name: "histoire", title: "Histoire du domaine", type: "localeRichText", group: "histoire" }),

    defineField({
      name: "cepages",
      title: "Cépages",
      type: "array",
      group: "vignoble",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: Object.entries(cepages).map(([value, c]) => ({ title: c.label, value })),
      },
    }),
    defineField({
      name: "thematiques",
      title: "Pictos thématiques",
      description: "Badges affichés sur la fiche et filtres de la page Vignerons. Cochez uniquement ce qui est avéré.",
      type: "array",
      group: "vignoble",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: Object.entries(pictos).map(([value, p]) => ({ title: p.label, value })),
      },
    }),
    defineField({
      name: "pratiques",
      title: "Pratiques et méthodes",
      description: "Ex. : vendanges manuelles, pressurage doux, culture sans herbicides.",
      type: "array",
      group: "vignoble",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "labels",
      title: "Labels et certifications",
      description: "Ex. : HVE, Viticulture durable en Champagne.",
      type: "array",
      group: "vignoble",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),

    defineField({
      name: "portrait",
      title: "Portrait du vigneron (photo de la carte)",
      description: "Le vigneron dans ses vignes ou son chai, format vertical de préférence.",
      type: "imageAvecAlt",
      group: "photos",
    }),
    defineField({ name: "image", title: "Photo principale (paysage, domaine)", type: "imageAvecAlt", group: "photos" }),
    defineField({
      name: "galerie",
      title: "Galerie",
      type: "array",
      group: "photos",
      of: [defineArrayMember({ type: "imageAvecAlt" })],
      options: { layout: "grid" },
    }),

    defineField({ name: "seo", title: "Référencement", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "Ordre d'affichage", name: "ordre", by: [{ field: "ordre", direction: "asc" }] },
    { title: "Nom", name: "nom", by: [{ field: "nom", direction: "asc" }] },
  ],
  preview: { select: { title: "nom", subtitle: "village", media: "portrait" } },
});
