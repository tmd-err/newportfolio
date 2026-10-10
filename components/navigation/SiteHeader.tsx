"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileDown, Menu, X } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { profile } from "@/data/profile";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_IDS = ["about", "projects", "skills", "journey", "contact"] as const;

export function SiteHeader({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const labels: Record<(typeof NAV_IDS)[number], string> = {
    about: dict.nav.about,
    projects: dict.nav.projects,
    skills: dict.nav.skills,
    journey: dict.nav.journey,
    contact: dict.nav.contact,
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{
        background: scrolled
          ? "color-mix(in srgb, #04060f 62%, transparent)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid color-mix(in srgb, #eef2ff 8%, transparent)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href={`/${locale}`}
          className="font-display text-lg font-bold tracking-tight text-ink"
        >
          YT<span className="text-mineral">.</span>
          <span className="sr-only">{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-[13px] font-medium text-mist transition-colors hover:text-ink"
            >
              {labels[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher locale={locale} label={dict.nav.languageSwitcher} />
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !px-4 !py-2 text-[13px] sm:inline-flex"
          >
            <FileDown className="size-3.5" aria-hidden />
            {dict.nav.downloadCv}
          </a>
          <button
            type="button"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="chip flex size-9 items-center justify-center !p-0 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="panel mx-4 mb-4 flex flex-col gap-1 p-3 lg:hidden"
            aria-label="Mobile"
          >
            {NAV_IDS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="rounded px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-white/5"
              >
                {labels[id]}
              </a>
            ))}
            <a
              href={profile.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded bg-teal/15 px-4 py-3 text-base font-medium text-mineral"
            >
              <FileDown className="size-4" aria-hidden />
              {dict.nav.downloadCv}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
