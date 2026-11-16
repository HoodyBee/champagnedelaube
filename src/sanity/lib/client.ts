import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Le CDN de Sanity sert les contenus publiés très vite. Le cache de Next.js
      // est vidé à chaque publication grâce au webhook (src/app/api/revalidate).
      useCdn: true,
      perspective: "published",
    })
  : null;
