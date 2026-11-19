import { cacheLife, cacheTag } from "next/cache";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

/**
 * Lit des contenus dans Sanity, avec mise en cache.
 *
 * Le résultat est gardé en cache (site rapide) et étiqueté avec `tags`, en
 * général le type de document (« vigneron », « evenement »…). Quand vous publiez
 * un contenu dans le Studio, Sanity prévient le site (webhook), qui vide le cache
 * correspondant : la page est à jour en quelques secondes.
 *
 * Renvoie null si Sanity n'est pas encore configuré ou ne répond pas.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  life = "max",
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
  /** Durée de cache : "max" (vidé par le webhook à chaque publication) ou "hours" (contenus datés). */
  life?: "max" | "hours";
}): Promise<T | null> {
  "use cache";
  cacheTag("sanity", ...tags);

  const setLife = () => (life === "hours" ? cacheLife("hours") : cacheLife("max"));
  if (!client) {
    setLife();
    return null;
  }

  try {
    const result = await client.fetch<T>(query, params);
    setLife();
    return result;
  } catch (error) {
    // Sanity injoignable : on affiche les contenus par défaut plutôt que de casser
    // le site, et on réessaie quelques minutes plus tard.
    console.error("[sanity] Lecture impossible :", error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return null;
  }
}
