import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cepages, type CepageKey } from "@/lib/brand";
import { CEPAGES_MASQUES } from "@/lib/cepages-contenu";

/**
 * Cépage en version légère (règle du brand book pour les cépages) : la grappe blanche
 * dans une petite pastille ronde de sa couleur, et le nom écrit à côté.
 * La pastille est un simple cadrage, à l'affichage, de la vignette officielle :
 * le fichier n'est ni modifié ni recoloré.
 */
/** `lien` : toute la pastille mène à la page du cépage (/les-cepages-de-laube/<cépage>/). */
export function CepagePastille({
  cepage,
  size = 32,
  note,
  lien = true,
  nomVisible = true,
}: {
  cepage: CepageKey;
  size?: number;
  note?: string;
  lien?: boolean;
  /** false : la pastille seule (le nom est déjà écrit à côté, ex. dans un titre). */
  nomVisible?: boolean;
}) {
  const c = cepages[cepage];
  // Cépage masqué (page en brouillon) : pas de lien.
  const avecLien = lien && !CEPAGES_MASQUES.includes(cepage);
  const contenu = (
    <>
      <span
        aria-hidden="true"
        className="relative shrink-0 overflow-hidden rounded-rond"
        style={{ width: size, height: size }}
      >
        {/* Cadrage serré sur la grappe seule (le nom écrit sous la grappe dans la vignette ne doit pas apparaître). */}
        <Image
          src={c.src}
          alt=""
          width={size * 3}
          height={size * 3}
          sizes={`${size * 3}px`}
          className="absolute max-w-none"
          style={{
            width: size * 3,
            height: size * 3,
            left: -size,
            top: -size * (cepage === "chardonnay-rose" ? 0.61 : 0.76),
          }}
        />
      </span>
      {nomVisible && (
        <span className="leading-tight">
          <span
            className={`block text-[0.9375rem] font-bold ${avecLien ? "underline decoration-or/60 underline-offset-4 transition-colors group-hover:text-bronze group-hover:decoration-bronze" : ""}`}
          >
            {c.label}
          </span>
          {note && (
            <span className="block text-legende text-gris-chaud">{note}</span>
          )}
        </span>
      )}
    </>
  );
  // Toute la pastille est un lien vers la page du cépage.
  return avecLien ? (
    <Link
      href={{ pathname: "/les-cepages-de-laube/[cepage]", params: { cepage } }}
      className="group inline-flex items-center gap-space-1 rounded-etiquette transition-transform hover:-translate-y-px"
    >
      {contenu}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-space-1">{contenu}</span>
  );
}
