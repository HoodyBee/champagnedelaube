import type { Img } from "@/components/ui/types";
import { SITE_URL } from "@/i18n/metadata";

/** Données structurées ImageObject d'une photo, avec son crédit (Google Images affiche le crédit et la licence). */
export function imageObject(img: Img) {
  return {
    "@type": "ImageObject",
    contentUrl: img.src,
    url: img.src,
    caption: img.alt || undefined,
    creditText: img.credit,
    copyrightNotice: img.credit,
    creator: { "@type": "Organization", name: "Champagne de l'Aube / Detectezmoi.com" },
    acquireLicensePage: `${SITE_URL}/mentions-legales/`,
  };
}
