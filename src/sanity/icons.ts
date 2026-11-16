import { Icon, type IconSymbol } from "@sanity/icons";
import { createElement } from "react";

/** Icône du menu du Studio, à partir du nom d'un symbole @sanity/icons. */
export const icon = (symbol: IconSymbol) => {
  const StudioIcon = () => createElement(Icon, { symbol });
  StudioIcon.displayName = `Icon(${symbol})`;
  return StudioIcon;
};
