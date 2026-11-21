"use client";

import Image, { type ImageProps } from "next/image";
import { estImageSanity, sanityLoader } from "@/sanity/lib/image-loader";

/** next/image avec le chargeur Sanity pour les photos Sanity (CDN Sanity, nom lisible), l'optimiseur de Next sinon. */
export function SanityImage(props: ImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text -- le texte alternatif est transmis par props
  return <Image {...props} loader={estImageSanity(props.src) ? sanityLoader : undefined} />;
}
