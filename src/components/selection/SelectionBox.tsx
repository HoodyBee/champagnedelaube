import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { LineIcon } from "@/components/ui/LineIcon";
import { nav } from "@/lib/site";
import { CatalogueDialog } from "./CatalogueDialog";

/** Encadré « Notre sélection évolue au fil des rencontres » + bouton « Recevoir notre sélection ». */
export async function SelectionBox({ titre, texte, lienSelection = true }: { titre?: string; texte?: string; lienSelection?: boolean }) {
  const t = await getTranslations("selection");
  const tNav = await getTranslations("nav");
  return (
    <div className="mx-auto max-w-3xl rounded-carte border border-filet bg-creme-clair px-space-3 py-space-4 text-center sm:px-space-5 sm:py-space-5">
      <LineIcon name="vigneron" size={32} className="mx-auto block text-or" />
      <p className="mt-space-2 text-sur-titre text-bronze">{t("surTitre")}</p>
      <h2 className="mt-space-1 text-titre-section sm:text-[2rem]">{titre ?? t("titre")}</h2>
      <p className="mx-auto mt-space-2 max-w-xl text-[1.0625rem] text-gris-chaud">{texte ?? t("texte")}</p>
      <div className="mt-space-4 flex flex-col items-center justify-center gap-space-1 sm:flex-row">
        <CatalogueDialog />
        {lienSelection && (
          <ButtonLink href={nav.vignerons.href} variant="secondaire">
            {tNav("vignerons")}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
