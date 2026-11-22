"use client";

import { useEffect } from "react";
import { CSS_UNE_DEFAUT, cssUne, ID_STYLE_UNE } from "@/lib/une-hasard";

/**
 * « À la une » au hasard, quand on arrive sur Le Mag par un lien interne (navigation sans
 * rechargement : le petit script de la page ne s'exécute pas dans ce cas). Au chargement
 * normal, le script a déjà fait le tirage avant l'affichage : ce composant ne fait alors rien.
 */
export function UneAuHasard({ total, montres }: { total: number; montres: number }) {
  useEffect(() => {
    const style = document.getElementById(ID_STYLE_UNE);
    if (!style || style.textContent !== CSS_UNE_DEFAUT(montres)) return;
    const ordre = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
    }
    style.textContent = cssUne(ordre.slice(0, montres));
  }, [total, montres]);
  return null;
}
