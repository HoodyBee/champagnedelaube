import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Appelé par Sanity (webhook) à chaque publication : vide le cache des pages
// concernées pour que le site soit à jour en quelques secondes.
// Le secret partagé (SANITY_REVALIDATE_SECRET) empêche quiconque d'autre de l'appeler.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET manquant" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Signature invalide" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Type de document manquant" }, { status: 400 });
    }
    // Vide le cache de ce type de document, et celui des données partagées
    // (réglages, menus…) pour garder le site cohérent.
    revalidateTag(body._type, "max");
    revalidateTag("sanity", "max");
    return NextResponse.json({ revalidated: [body._type, "sanity"] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erreur" }, { status: 500 });
  }
}
