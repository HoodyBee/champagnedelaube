import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

// Le Studio Sanity, intégré au site : https://champagnedelaube.fr/studio
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "64px auto", padding: 16, lineHeight: 1.5 }}>
        <h1>Studio pas encore relié</h1>
        <p>
          La variable <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> n&apos;est pas renseignée. Ajoutez l&apos;identifiant de
          votre projet Sanity dans <code>.env.local</code> (sur votre ordinateur) ou dans les variables d&apos;environnement
          de Netlify, puis relancez le site.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
