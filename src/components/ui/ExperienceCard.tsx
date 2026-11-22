import { SanityImage as Image } from "@/components/ui/SanityImage";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LineIcon } from "./LineIcon";
import { Photo } from "./Photo";
import type { Img } from "./types";

export type ExperienceCardData = {
  slug: string;
  titre: string;
  accroche?: string;
  image?: Img | null;
  etiquette?: "nouveau" | "places-limitees" | "sur-mesure";
  duree?: string;
  participantsMin?: number;
  participantsMax?: number;
  lieu?: string;
  /** Prix « à partir de » en euros par personne ; vide = « Sur demande ». */
  prixAPartirDe?: number | null;
  animateur?: { nom?: string; photo?: Img | null };
};

/**
 * Carte d'expérience pour les particuliers (inspirée des catalogues d'ateliers) :
 * photo verticale, étiquette, titre court, infos en pictos, prix, animateur, bouton unique.
 */
export function ExperienceCard({ experience: e }: { experience: ExperienceCardData }) {
  const t = useTranslations("ui");
  const personnes =
    e.participantsMin && e.participantsMax
      ? t("peopleRange", { min: e.participantsMin, max: e.participantsMax })
      : e.participantsMax
        ? t("peopleMax", { max: e.participantsMax })
        : undefined;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-carte">
        <Photo
          image={e.image}
          ratio="4/5"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholderLabel={t("photoSoon")}
          
        />
        {e.etiquette && (
          <span className="absolute left-space-2 top-space-2 rounded-etiquette bg-blanc/95 px-space-1 py-1 text-sur-titre-petit text-anthracite">
            {t(`tag.${e.etiquette}`)}
          </span>
        )}
        {e.animateur?.photo && (
          <Image
            src={e.animateur.photo.src}
            alt=""
            width={56}
            height={56}
            className="absolute bottom-space-2 left-space-2 h-14 w-14 rounded-rond border-2 border-blanc object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-space-2">
        <h3 className="text-[1.375rem] font-bold leading-tight">{e.titre}</h3>
        {e.accroche && <p className="mt-1 text-gris-chaud">{e.accroche}</p>}

        <ul className="mt-space-2 flex flex-wrap gap-x-space-2 gap-y-1 text-[0.9375rem] text-gris-chaud">
          {e.duree && (
            <li className="inline-flex items-center gap-1.5">
              <LineIcon name="duree" size={18} className="text-bronze" />
              {e.duree}
            </li>
          )}
          {personnes && (
            <li className="inline-flex items-center gap-1.5">
              <LineIcon name="groupe" size={18} className="text-bronze" />
              {personnes}
            </li>
          )}
          {e.lieu && (
            <li className="inline-flex items-center gap-1.5">
              <LineIcon name="lieu" size={18} className="text-bronze" />
              {e.lieu}
            </li>
          )}
        </ul>
        {e.animateur?.nom && <p className="mt-1 text-legende text-gris-chaud">{t("hostedBy", { name: e.animateur.nom })}</p>}

        <div className="mt-auto pt-space-3">
          <p className="text-[1.0625rem]">
            {e.prixAPartirDe != null ? (
              t.rich("priceFrom", { price: e.prixAPartirDe, strong: (c) => <strong className="font-bold">{c}</strong> })
            ) : (
              <span className="text-gris-chaud">{t("priceOnRequest")}</span>
            )}
          </p>
          <Link
            href={{ pathname: "/tasting-troyes/[slug]", params: { slug: e.slug } }}
            className="mt-space-2 flex min-h-11 w-full items-center justify-center rounded-etiquette bg-anthracite px-space-2 text-center text-sur-titre-petit text-blanc transition-colors after:absolute after:inset-0 hover:bg-anthracite/85"
          >
            {t("bookExperience")}
          </Link>
        </div>
      </div>
    </article>
  );
}
