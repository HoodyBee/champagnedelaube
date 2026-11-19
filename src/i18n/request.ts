import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "./routing";

type Messages = Record<string, unknown>;

async function load(locale: Locale): Promise<Messages> {
  return (await import(`../../messages/${locale}.json`)).default;
}

// Fusion profonde : un texte absent dans une langue est pris dans la langue de secours.
function merge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    out[key] =
      // Les listes (tableaux) sont remplacées d'un bloc, jamais fusionnées.
      value && typeof value === "object" && !Array.isArray(value) && prev && typeof prev === "object" && !Array.isArray(prev)
        ? merge(prev as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = requested && isLocale(requested) ? requested : defaultLocale;

  // Chaîne de secours : langue demandée -> anglais -> français.
  const fr = await load("fr");
  let messages = fr;
  if (locale !== "fr") messages = merge(messages, await load("en"));
  if (locale !== "fr" && locale !== "en") messages = merge(messages, await load(locale));

  return { locale, messages, timeZone: "Europe/Paris" };
});
