import type { LineIconName } from "@/lib/line-icons";
import { LineIcon } from "./LineIcon";

/** Arguments en colonnes, chacun avec son picto au trait (ex. Tarifs directs domaine). */
export function Arguments({ items }: { items: { icone?: LineIconName; titre: string; texte?: string }[] }) {
  return (
    <ul className={`grid gap-space-4 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((a) => (
        <li key={a.titre} className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-rond border border-filet bg-creme-clair text-bronze">
            <LineIcon name={a.icone ?? "vigneron"} />
          </span>
          <h3 className="mt-space-2 text-[1.25rem] font-bold">{a.titre}</h3>
          {a.texte && <p className="mt-space-1 max-w-xs text-gris-chaud">{a.texte}</p>}
        </li>
      ))}
    </ul>
  );
}
