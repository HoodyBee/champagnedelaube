import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { logos } from "@/lib/brand";

/**
 * Page 404 du site (adresse inconnue ou contenu retiré), dans la langue de la visite.
 * Next.js ajoute automatiquement « noindex » : elle n'apparaît jamais dans Google.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const liens = [
    { href: "/le-terroir-de-laube", label: t("terroirs") },
    { href: "/tasting-troyes", label: t("degustations") },
    { href: "/le-mag", label: t("mag") },
  ] as const;
  return (
    <section className="bg-creme-clair">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-space-2 py-space-5 text-center sm:px-space-4 lg:py-[96px]">
        <Image src={logos.avatar.src} alt="" width={96} height={96} sizes="96px" className="h-24 w-24" />
        <p className="mt-space-3 text-sur-titre text-bronze">{t("surTitre")}</p>
        <h1 className="mt-space-1 text-titre-post">{t("titre")}</h1>
        <p className="mt-space-2 max-w-xl text-[1.125rem] text-gris-chaud">{t("texte")}</p>
        <div className="mt-space-4 flex w-full flex-col items-stretch gap-space-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <ButtonLink href="/">{t("accueil")}</ButtonLink>
          {liens.map((l) => (
            <ButtonLink key={l.href} href={l.href} variant="secondaire">
              {l.label}
            </ButtonLink>
          ))}
        </div>
        <p className="mt-space-4 text-gris-chaud">
          <Link href="/contact" className="underline underline-offset-4 hover:text-anthracite">
            {t("contact")}
          </Link>
        </p>
      </div>
    </section>
  );
}
