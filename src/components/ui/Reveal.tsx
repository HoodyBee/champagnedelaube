"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Fondu lent à l'apparition des sections ([data-reveal]). Les blocs déjà visibles
 * à l'écran s'affichent tout de suite (pas de clignotement) ; sans JavaScript, ou si
 * le visiteur a demandé de réduire les animations, tout est simplement affiché.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")];
    if (!("IntersectionObserver" in window)) return;
    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-visible");
    }
    document.documentElement.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => !el.classList.contains("is-visible") && io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
