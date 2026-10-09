export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const localeDir = (locale: Locale): "ltr" | "rtl" =>
  locale === "ar" ? "rtl" : "ltr";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  ar: "ar",
};
