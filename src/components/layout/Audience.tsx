import Script from "next/script";
import { AUDIENCE_ACTIVE, AUDIENCE_DOMAINE, AUDIENCE_SCRIPT } from "@/lib/audience";

/** Script de mesure d'audience sans cookie (rien n'est chargé tant qu'il n'est pas activé). */
export function Audience() {
  if (!AUDIENCE_ACTIVE) return null;
  return <Script src={AUDIENCE_SCRIPT} data-domain={AUDIENCE_DOMAINE} strategy="afterInteractive" />;
}
