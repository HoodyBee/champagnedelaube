import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cepages, type CepageKey } from "@/lib/brand";

/**
 * Cépage en version légère (règle du brand book pour les cépages) : la grappe blanche
 * dans une petite pastille ronde de sa couleur, et le nom écrit à côté.
 * La pastille est un simple cadrage, à l'affichage, de la vignette officielle :
 * le fichier n'est ni modifié ni recoloré.
 */
export function CepagePastille({ cepage, size = 32, note, article }: { cepage: CepageKey; size?: number; note?: string; article?: string }) {
  const c = cepages[cepage];
  const contenu = (
    <>
      <span aria-hidden="true" className="relative shrink-0 overflow-hidden rounded-rond" style={{ width: size, height: size }}>
        <Image
          src={c.src}
          alt=""
          width={size * 2}
          height={size * 2}
          sizes={`${size * 2}px`}
          className="absolute max-w-none"
          style={{ width: size * 2, height: size * 2, left: -size / 2, top: -size * (cepage === "chardonnay-rose" ? 0.2 : 0.34) }}
        />
      </span>
      <span className="leading-tight">
        <span className={`block text-[0.9375rem] font-bold ${article ? "underline decoration-or/60 underline-offset-4 transition-colors group-hover:text-bronze group-hover:decoration-bronze" : ""}`}>
          {c.label}
        </span>
        {note && <span className="block text-legende text-gris-chaud">{note}</span>}
      </span>
    </>
  );
  // Avec un article publié : toute la pastille est un lien vers l'article du cépage.
  return article ? (
    <Link href={{ pathname: "/[article]", params: { article } }} className="group inline-flex items-center gap-space-1 rounded-etiquette transition-transform hover:-translate-y-px">
      {contenu}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-space-1">{contenu}</span>
  );
}
