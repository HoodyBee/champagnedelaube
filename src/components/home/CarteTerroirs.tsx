import { Link } from "@/i18n/navigation";
import { terroirs } from "@/lib/brand";
import { terroirPages } from "@/lib/site";

// Carte stylisée (non cartographique) : positions calculées à partir des coordonnées
// réelles des villes (x = longitude, y = latitude), simplifiées pour la lisibilité.
const P = (lon: number, lat: number) => ({ x: Math.round((lon - 3.4) * 220), y: Math.round((48.7 - lat) * 320) });
const TROYES = P(4.074, 48.297);
const POINTS = {
  montgueux: P(3.974, 48.307),
  villenauxe: P(3.551, 48.585),
  "les-riceys": P(4.367, 47.994),
} as const;
const BAR_SEINE = P(4.373, 48.112);
const BAR_AUBE = P(4.707, 48.233);

/** Carte stylisée des 4 terroirs de l'Aube : touches de couleur discrètes, liens vers chaque page. */
export function CarteTerroirs({ legende, troyes }: { legende: string; troyes: string }) {
  const href = (k: string) => terroirPages.find((p) => p.key === k)!.href;
  const color = (k: keyof typeof terroirs) => `var(--color-${terroirs[k].color})`;
  return (
    <figure className="relative">
      <svg viewBox="0 0 340 260" role="img" aria-label={legende} className="h-auto w-full">
        {/* Fond : un simple halo crème, sans contour administratif */}
        <ellipse cx="170" cy="130" rx="165" ry="122" fill="var(--color-creme-clair)" stroke="var(--color-filet)" />
        {/* La Seine, en filet doré très fin */}
        <path
          d={`M ${BAR_SEINE.x + 20} ${BAR_SEINE.y + 60} C ${BAR_SEINE.x} ${BAR_SEINE.y}, ${TROYES.x + 30} ${TROYES.y + 30}, ${TROYES.x} ${TROYES.y} S ${POINTS.villenauxe.x + 60} ${POINTS.villenauxe.y + 40}, ${POINTS.villenauxe.x - 10} ${POINTS.villenauxe.y + 30}`}
          fill="none"
          stroke="var(--color-or)"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        {/* Côte des Bar : une zone, de Bar-sur-Seine à Bar-sur-Aube */}
        <ellipse
          cx={(BAR_SEINE.x + BAR_AUBE.x) / 2 + 4}
          cy={(BAR_SEINE.y + BAR_AUBE.y) / 2 + 8}
          rx="62"
          ry="34"
          transform={`rotate(-24 ${(BAR_SEINE.x + BAR_AUBE.x) / 2} ${(BAR_SEINE.y + BAR_AUBE.y) / 2})`}
          fill={color("cote-des-bar")}
          fillOpacity="0.12"
          stroke={color("cote-des-bar")}
          strokeOpacity="0.5"
          strokeDasharray="3 3"
        />
        {/* Troyes */}
        <rect x={TROYES.x - 3.5} y={TROYES.y - 3.5} width="7" height="7" transform={`rotate(45 ${TROYES.x} ${TROYES.y})`} fill="var(--color-anthracite)" />
        <text x={TROYES.x + 8} y={TROYES.y + 16} className="fill-gris-chaud" style={{ font: "500 9px var(--font-sans)", letterSpacing: "0.12em" }}>
          {troyes.toUpperCase()}
        </text>
        {(Object.keys(POINTS) as (keyof typeof POINTS)[]).map((k) => (
          <circle key={k} cx={POINTS[k].x} cy={POINTS[k].y} r="5" fill={color(k)} />
        ))}
      </svg>
      {/* Libellés cliquables, posés sur la carte */}
      {(
        [
          ["villenauxe", POINTS.villenauxe, "left"],
          ["montgueux", POINTS.montgueux, "before"],
          ["les-riceys", POINTS["les-riceys"], "left"],
          ["cote-des-bar", { x: (BAR_SEINE.x + BAR_AUBE.x) / 2 + 4, y: (BAR_SEINE.y + BAR_AUBE.y) / 2 - 22 }, "center"],
        ] as const
      ).map(([k, pt, align]) => (
        <Link
          key={k}
          href={href(k)}
          className="absolute -translate-y-1/2 whitespace-nowrap text-sur-titre-petit text-anthracite hover:text-bronze"
          style={{
            left: `${((pt.x + (align === "left" ? 9 : align === "before" ? -9 : 0)) / 340) * 100}%`,
            top: `${(pt.y / 260) * 100}%`,
            transform: align === "center" ? "translate(-50%, -50%)" : align === "before" ? "translate(-100%, -50%)" : "translateY(-50%)",
          }}
        >
          {terroirPages.find((p) => p.key === k)!.short ?? terroirPages.find((p) => p.key === k)!.label}
        </Link>
      ))}
    </figure>
  );
}
