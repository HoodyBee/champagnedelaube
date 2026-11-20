/**
 * Typographie française : espace insécable avant « : ; ! ? » et à l'intérieur des guillemets « ».
 * Évite qu'un signe de ponctuation se retrouve seul en début de ligne (surtout sur mobile).
 * Ne touche ni aux adresses (https://…) ni aux heures (12:30), qui n'ont pas d'espace avant « : ».
 */
const NBSP = " ";

export function typoFr(s: string): string {
  return s.replace(/ ([:;!?»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
}

/** Applique typoFr à une chaîne, ou aux textes d'un contenu enrichi (blocs Portable Text). */
export function typoFrValeur<T>(v: T): T {
  if (typeof v === "string") return typoFr(v) as T;
  if (Array.isArray(v)) {
    return v.map((b) =>
      b && typeof b === "object" && "_type" in b && b._type === "block" && Array.isArray((b as { children?: unknown[] }).children)
        ? {
            ...b,
            children: (b as { children: { _type?: string; text?: string }[] }).children.map((c) =>
              c._type === "span" && typeof c.text === "string" ? { ...c, text: typoFr(c.text) } : c,
            ),
          }
        : b,
    ) as T;
  }
  return v;
}
