import type { Img } from "@/components/ui/types";
import { SITE_URL } from "@/i18n/metadata";

/**
 * Données structurées ImageObject d'une photo, avec son crédit (Google Images affiche le crédit et la licence).
 * Créateur : seulement pour nos propres photos ; pour une photo de banque d'images ou d'un tiers,
 * le crédit saisi (auteur, site) suffit. Licence CC0 indiquée quand le crédit la mentionne.
 */
export function imageObject(img: Img) {
  const credit = img.credit ?? "";
  const nous = /detectezmoi|champagne de l['’]aube/i.test(credit) && !/reprise|droits réservés/i.test(credit);
  return {
    "@type": "ImageObject",
    contentUrl: img.src,
    url: img.src,
    width: img.width,
    height: img.height,
    caption: img.legende || img.alt || undefined,
    creditText: credit || undefined,
    copyrightNotice: credit || undefined,
    ...(nous ? { creator: { "@type": "Organization", name: "Champagne de l'Aube / Detectezmoi.com" } } : {}),
    ...(/CC0/i.test(credit) ? { license: "https://creativecommons.org/publicdomain/zero/1.0/" } : {}),
    acquireLicensePage: `${SITE_URL}/mentions-legales/`,
  };
}
