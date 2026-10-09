import { isLocale, type Locale } from "./locales";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

export const resolveLocale = (value: string | undefined): Locale =>
  value && isLocale(value) ? value : "en";

export { isLocale, locales, defaultLocale, localeDir, localeNames } from "./locales";
export type { Locale } from "./locales";
export type { Dictionary } from "./types";
