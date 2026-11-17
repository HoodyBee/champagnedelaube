"use client";

// Configuration du Studio Sanity, accessible sur /studio (ex. http://localhost:3000/studio).
import { frFRLocale } from "@sanity/locale-fr-fr";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: "Champagne de l'Aube",
  projectId: projectId || "a-configurer",
  dataset,
  schema: {
    types: schemaTypes,
    // Les documents uniques n'apparaissent pas dans le bouton « Créer ».
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Les documents uniques ne peuvent être ni supprimés ni dupliqués.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure, title: "Contenus" }),
    frFRLocale(),
    // Outil avancé pour tester des requêtes : utile au développeur uniquement.
    visionTool({ defaultApiVersion: apiVersion, title: "Requêtes (développeur)" }),
  ],
});
