"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const pathWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, "") || "/";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="chip flex items-center gap-1.5 px-3 py-1.5 hover:border-cyan/60 hover:text-ink transition-colors"
      >
        <Globe className="size-3.5" aria-hidden />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <div className="panel absolute end-0 top-full mt-2 flex min-w-36 flex-col gap-0.5 rounded-xl p-1.5">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
              onClick={() => setOpen(false)}
              lang={l}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                l === locale
                  ? "bg-cyan/15 text-ink"
                  : "text-mist hover:bg-white/5 hover:text-ink"
              }`}
            >
              {localeNames[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
