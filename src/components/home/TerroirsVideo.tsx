"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { APPARITION, ETIQUETTES, FORMES, PHASES, type Cadrage } from "./carte-terroirs-formes";
import "./carte-terroirs.css";

export type TerroirLien = { key: string; label: string; url: string; color: string };

/**
 * Carte vidéo des terroirs (accueil). Chaque terroir est cliquable par sa forme EXACTE (tracé SVG
 * détouré sur l'image) et par son étiquette ; au survol ou au clavier, la forme s'illumine (lueur dorée
 * qui suit le contour, surbrillance de sa couleur). Troyes est cliquable par son point et son étiquette.
 * Les zones sont actives dès que la carte est immobile : cadrage « milieu » (4,4 à 10,6 s, chaque terroir
 * dès son apparition) puis cadrage « final » (à partir de 13,4 s, à la fin et sur le poster).
 */
/**
 * Zones de toucher (mobile), en unités de la carte (1440 × 1080) : marge [gauche, haut, droite, bas]
 * autour de chaque étiquette. Environ 44 px de haut sur un téléphone, sans que deux zones se chevauchent
 * (Montgueux s'agrandit vers le haut, Troyes vers le bas, car leurs étiquettes sont proches).
 */
const DOIGT: Record<string, [number, number, number, number]> = {
  villenauxe: [40, 60, 40, 60],
  montgueux: [40, 90, 40, 20],
  "cote-des-bar": [40, 70, 40, 55],
  "les-riceys": [40, 55, 40, 70],
  troyes: [30, 20, 30, 100],
};

export function TerroirsVideo({
  video,
  poster,
  alt,
  terroirs,
  troyes,
  textes,
}: {
  video: string;
  poster: string;
  alt: string;
  terroirs: TerroirLien[];
  troyes: { label: string; url: string };
  /** voir : modèle avec « {nom} », ex. « {nom} : découvrir ce terroir ». */
  textes: { revoir: string; consigne: string; voir: string };
}) {
  const router = useRouter();
  const boite = useRef<HTMLDivElement>(null);
  const lecteur = useRef<HTMLVideoElement>(null);
  const [etat, setEtat] = useState<"attente" | "lecture" | "fin">("attente");
  const [charger, setCharger] = useState(false);
  const [temps, setTemps] = useState(0);

  // Chargement de la vidéo : après celui de la page, quand un tiers de la carte est visible ;
  // jamais si le visiteur demande de réduire les animations (il voit le poster, cliquable).
  useEffect(() => {
    const el = boite.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io: IntersectionObserver | undefined;
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

  // Pendant la lecture : on suit le temps pour activer les zones aux bons moments.
  useEffect(() => {
    if (etat !== "lecture") return;
    let id = 0;
    const tick = () => {
      setTemps(lecteur.current?.currentTime ?? 0);
      id = window.setTimeout(tick, 120);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [etat]);

  const cadrage: Cadrage | null =
    etat !== "lecture" ? "final" : temps >= PHASES.final.debut ? "final" : temps >= PHASES.milieu.debut && temps < PHASES.milieu.fin ? "milieu" : null;
  const visible = (cle: string) => cadrage === "final" || (cadrage === "milieu" && temps >= (APPARITION[cle] ?? 99));

  const relancer = () => {
    const v = lecteur.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(
      () => setEtat("lecture"),
      () => setEtat("attente"),
    );
  };

  const aller = (url: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(url);
  };

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

        {cadrage && (
          <svg viewBox="0 0 1440 1080" className="carte-terroirs absolute inset-0 h-full w-full" role="group" aria-label={textes.consigne}>
            {terroirs.map((t) => {
              if (!visible(t.key)) return null;
              const [x0, y0, x1, y1] = ETIQUETTES[cadrage][t.key];
              const etiquetteGrande = [x0 - 14, y0 - 18, x1 - x0 + 28, y1 - y0 + 36] as const;
              return (
                <a key={`${cadrage}-${t.key}`} href={t.url} onClick={aller(t.url)} aria-label={textes.voir.replace("{nom}", t.label)} className="terroir" style={{ ["--teinte" as string]: t.color }}>
                  <path d={FORMES[cadrage][t.key]} className="forme" fill="transparent" stroke="transparent" />
                  {/* Sur mobile, une zone de toucher plus large autour de l'étiquette (invisible) */}
                  <rect x={x0 - DOIGT[t.key][0]} y={y0 - DOIGT[t.key][1]} width={x1 - x0 + DOIGT[t.key][0] + DOIGT[t.key][2]} height={y1 - y0 + DOIGT[t.key][1] + DOIGT[t.key][3]} className="zone-doigt" fill="transparent" />
                  <rect x={etiquetteGrande[0]} y={etiquetteGrande[1]} width={etiquetteGrande[2]} height={etiquetteGrande[3]} rx={18} className="etiquette" fill="transparent" stroke="transparent" />
                </a>
              );
            })}
            {visible("troyes") &&
              (() => {
                const [x0, y0, x1, y1] = ETIQUETTES[cadrage].troyes;
                return (
                  <a href={troyes.url} onClick={aller(troyes.url)} aria-label={troyes.label} className="ville">
                    <rect x={x0 - DOIGT.troyes[0]} y={y0 - DOIGT.troyes[1]} width={x1 - x0 + DOIGT.troyes[0] + DOIGT.troyes[2]} height={y1 - y0 + DOIGT.troyes[1] + DOIGT.troyes[3]} className="zone-doigt" fill="transparent" />
                    <rect x={x0 - 12} y={y0 - 12} width={x1 - x0 + 24} height={y1 - y0 + 24} rx={14} className="etiquette" fill="transparent" stroke="transparent" />
                    {/* Petit cœur azur (couleur du blason de Troyes) qui apparaît au survol */}
                    <path
                      className="coeur"
                      opacity={0}
                      transform={`translate(${x1 + 10} ${y0 + (y1 - y0) / 2 - 13}) scale(1.7)`}
                      d="M8 13.6 6.9 12.6C2.9 9 .3 6.6.3 3.9.3 1.7 2 0 4.2 0c1.2 0 2.4.6 3.1 1.5h1.4C9.4.6 10.6 0 11.8 0 14 0 15.7 1.7 15.7 3.9c0 2.7-2.6 5.1-6.6 8.7L8 13.6Z"
                    />
                  </a>
                );
              })()}
          </svg>
        )}

        {etat === "fin" && (
          <button
            type="button"
            onClick={relancer}
            className="absolute bottom-[3%] left-[2.5%] inline-flex min-h-9 items-center gap-1 rounded-etiquette border border-or/60 bg-[#0D1929]/70 px-space-1 text-sur-titre-petit text-creme transition-colors hover:border-or hover:text-or"
          >
            <span aria-hidden="true">↻</span> {textes.revoir}
          </button>
        )}
      </div>
      {/* Consigne bien lisible : crème sur fond sombre, taille de texte courant, petite main dorée. */}
      <p className="mt-space-2 flex items-center justify-center gap-space-1 text-center text-[1rem] font-bold leading-snug text-creme sm:text-[1.0625rem]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-or" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.5L4 15.4a1.5 1.5 0 0 1 2.3-1.9L9 16" />
        </svg>
        {textes.consigne}
      </p>
    </div>
  );
}
