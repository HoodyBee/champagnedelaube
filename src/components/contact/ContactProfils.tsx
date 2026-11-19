"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { LineIcon } from "@/components/ui/LineIcon";
import type { LineIconName } from "@/lib/line-icons";

const PROFILS = [
  { key: "particulier", form: "contactParticulier", icone: "degustation" },
  { key: "pro", form: "contactPro", icone: "tarif" },
  { key: "entreprise", form: "contactEntreprise", icone: "coffret" },
] as const satisfies readonly { key: string; form: string; icone: LineIconName }[];

/**
 * « Vous êtes… ? » : le visiteur choisit son profil, le formulaire s'adapte et le
 * contact est classé dans la bonne liste Brevo (Particuliers, Professionnels, Entreprises & CSE).
 */
export function ContactProfils() {
  const t = useTranslations("contactPage");
  const [profil, setProfil] = useState<(typeof PROFILS)[number]["key"] | null>(null);
  const choisi = PROFILS.find((p) => p.key === profil);

  return (
    <div>
      <fieldset>
        <legend className="text-titre-section">{t("vousEtes")}</legend>
        <p className="mt-space-1 text-gris-chaud">{t("vousEtesAide")}</p>
        <div className="mt-space-3 grid gap-space-1 sm:grid-cols-3">
          {PROFILS.map((p) => (
            <label
              key={p.key}
              className={`flex min-h-11 cursor-pointer flex-col gap-1 rounded-carte border bg-blanc p-space-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze ${
                profil === p.key ? "border-anthracite" : "border-filet hover:border-bronze"
              }`}
            >
              <input type="radio" name="profil-contact" value={p.key} checked={profil === p.key} onChange={() => setProfil(p.key)} className="sr-only" />
              <LineIcon name={p.icone} size={28} className="text-or" />
              <span className="text-[1.125rem] font-bold leading-tight">{t(`profils.${p.key}.titre`)}</span>
              <span className="text-legende text-gris-chaud">{t(`profils.${p.key}.texte`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {choisi && (
        <div className="mt-space-4 border-t border-filet pt-space-3">
          <LeadForm key={choisi.form} formId={choisi.form} />
        </div>
      )}
    </div>
  );
}
