"use client";

import { useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";

/**
 * Zones cliquables de la carte, en pourcentage de l'image (1440 × 1080, dernière image de la vidéo = poster) :
 * elles restent justes à toutes les tailles d'écran. Chaque zone couvre l'étiquette ET la zone colorée.
 * « Troyes » n'est pas un terroir : pas de zone.
 */
type Zone = { x: number; y: number; w: number; h: number };
const ZONES: Record<string, Zone[]> = {
  villenauxe: [{ x: 10.8, y: 16.2, w: 17.8, h: 9.6 }],
  montgueux: [{ x: 31.1, y: 42.6, w: 17.9, h: 9.4 }],
  "cote-des-bar": [
    { x: 67.0, y: 61.0, w: 19.4, h: 13.0 },
    { x: 75.3, y: 47.7, w: 19.9, h: 13.5 },
  ],
  "les-riceys": [{ x: 57.2, y: 76.5, w: 16.7, h: 11.5 }],
};

export type TerroirLien = { key: string; label: string; href: StaticPathname; color: string };

export function TerroirsVideo({
  video,
  poster,
  alt,
  terroirs,
  textes,
}: {
  video: string;
  poster: string;
  alt: string;
  terroirs: TerroirLien[];
  /** voir : modèle avec « {nom} », ex. « {nom} : découvrir ce terroir ». */
  textes: { revoir: string; consigne: string; voir: string };
}) {
  const boite = useRef<HTMLDivElement>(null);
  const lecteur = useRef<HTMLVideoElement>(null);
  // « attente » : poster seul ; « lecture » : vidéo en cours ; « fin » : dernière image, zones actives.
  const [etat, setEtat] = useState<"attente" | "lecture" | "fin">("attente");
  const [charger, setCharger] = useState(false);

  // La vidéo n'est chargée que lorsque la section approche de l'écran, et jamais si
  // le visiteur a demandé de réduire les animations : il voit alors directement le poster.
  useEffect(() => {
    const el = boite.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io: IntersectionObserver | undefined;
    // On attend la fin du chargement de la page (le haut de page passe d'abord), puis qu'un tiers de la carte soit visible.
    const observer = () => {
      io = new IntersectionObserver(
        (entrees) => {
          if (entrees.some((e) => e.isIntersecting)) {
            setCharger(true);
            io?.disconnect();
          }
        },
        { threshold: 0.33 },
      );
      io.observe(el);
    };
    if (document.readyState === "complete") observer();
    else window.addEventListener("load", observer, { once: true });
    return () => {
      window.removeEventListener("load", observer);
      io?.disconnect();
    };
  }, []);

  const lancer = () => {
    const v = lecteur.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(
      () => setEtat("lecture"),
      () => setEtat("attente"), // lecture impossible : on garde le poster, cliquable
    );
  };

  const zonesActives = etat !== "lecture";

  return (
    <div>
      <div
        ref={boite}
        className="relative aspect-[4/3] w-full [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_2.5%,#000_97.5%,transparent),linear-gradient(to_bottom,transparent,#000_3%,#000_97%,transparent)]"
      >
        <SanityImage src={poster} alt={alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-contain" />
        {charger && (
          <video
            ref={lecteur}
            src={video}
            poster={poster}
            muted
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setEtat("lecture")}
            onEnded={() => setEtat("fin")}
            onError={() => setEtat("attente")}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${etat === "attente" ? "opacity-0" : "opacity-100"}`}
          />
        )}
        {/* Zones cliquables : sur le poster et à la fin de la vidéo. */}
        {terroirs.map((t) =>
          (ZONES[t.key] ?? []).map((z, i) => (
            <Link
              key={`${t.key}-${i}`}
              href={t.href}
              aria-label={textes.voir.replace("{nom}", t.label)}
              aria-hidden={i > 0 || !zonesActives ? true : undefined}
              tabIndex={i > 0 || !zonesActives ? -1 : undefined}
              className={`zone-terroir absolute -translate-x-1/2 -translate-y-1/2 rounded-etiquette transition-[box-shadow,background-color] duration-200 ${
                zonesActives ? "" : "pointer-events-none"
              }`}
              style={{
                left: `${z.x + z.w / 2}%`,
                top: `${z.y + z.h / 2}%`,
                width: `max(${z.w}%, 44px)`,
                height: `max(${z.h}%, 44px)`,
                ["--halo" as string]: t.color,
              }}
            />
          )),
        )}
        {etat === "fin" && (
          <button
            type="button"
            onClick={lancer}
            className="absolute bottom-[3%] left-[2.5%] inline-flex min-h-9 items-center gap-1 rounded-etiquette border border-or/60 bg-[#0D1929]/70 px-space-1 text-sur-titre-petit text-creme transition-colors hover:border-or hover:text-or"
          >
            <span aria-hidden="true">↻</span> {textes.revoir}
          </button>
        )}
      </div>
      <p className="mt-space-1 text-center text-legende text-creme/80">
        {textes.consigne}
      </p>
    </div>
  );
}
