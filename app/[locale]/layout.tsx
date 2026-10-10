import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { locale as getLocaleParam } from "next/root-params";
import "../globals.css";
import {
  getDictionary,
  isLocale,
  localeDir,
  locales,
} from "@/lib/i18n";
import { profile } from "@/data/profile";
import { SiteHeader } from "@/components/navigation/SiteHeader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getLocaleParam();
  const locale = isLocale(raw) ? raw : "en";
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(profile.siteUrl),
    title: {
      default: dict.meta.title,
      template: `%s — ${profile.name}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: profile.name,
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    verification: {
      google: "sPgwtgbyOomu7EbMkZe8NZSLhY-nmPMEaLtaqIgnwVI",
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const raw = await getLocaleParam();
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${plexArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="grain min-h-full bg-abyss font-sans text-ink">
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-teal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-abyss"
        >
          {dict.a11y.skipToContent}
        </a>
        <SiteHeader dict={dict} locale={locale} />
        {children}
      </body>
    </html>
  );
}
