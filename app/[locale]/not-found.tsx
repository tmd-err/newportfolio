import Link from "next/link";
import { locale as getLocaleParam } from "next/root-params";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const raw = await getLocaleParam();
  const locale = isLocale(raw) ? raw : "en";
  const dict = await getDictionary(locale);

  return (
    <main
      id="content"
      className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 30%, rgba(113,138,154,.10), transparent 65%), #090a0c",
      }}
    >
      <p className="kicker">404</p>
      <h1 className="font-display mt-3 text-4xl font-bold text-ink sm:text-5xl">
        {dict.notFound.title}
      </h1>
      <p className="mt-4 max-w-sm text-mist">{dict.notFound.text}</p>
      <Link href={`/${locale}`} className="btn-primary mt-8">
        {dict.notFound.cta}
      </Link>
    </main>
  );
}
