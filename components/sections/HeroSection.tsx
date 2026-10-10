import { ArrowDown, FileDown } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/data/profile";
import { SceneSection } from "./SectionShell";

export function HeroSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="hero" vh={220} innerClassName="items-end sm:items-center">
      {/* asymmetric opening — type anchored left, the void stays open right */}
      <div className="flex w-full flex-col items-start gap-6 pb-16 sm:pb-0">
        <p className="kicker text-halo flex items-center gap-3 text-mineral">
          <span className="inline-block h-px w-8 bg-current" aria-hidden />
          {dict.hero.availability}
        </p>

        <h1 className="font-display text-halo max-w-2xl text-[13vw] font-light leading-[0.98] tracking-tight text-ink sm:text-8xl lg:text-[7.5rem]">
          Yahya Tamda
        </h1>

        <p className="kicker text-halo !text-[0.8rem] text-teal">
          {dict.hero.role}
        </p>

        <p className="text-halo max-w-md text-base leading-relaxed text-mist sm:text-lg">
          {dict.hero.intro}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a href="#about" className="btn-primary">
            {dict.hero.ctaExplore}
          </a>
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <FileDown className="size-4" aria-hidden />
            {dict.hero.ctaCv}
          </a>
        </div>
      </div>

      {/* scroll hint — low left, out of the composition */}
      <div className="pointer-events-none absolute bottom-8 left-5 flex items-center gap-3 text-dim sm:left-10">
        <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden />
        <span className="font-mono text-[11px] tracking-[0.22em]">
          {dict.hero.scrollHint}
        </span>
      </div>
    </SceneSection>
  );
}
