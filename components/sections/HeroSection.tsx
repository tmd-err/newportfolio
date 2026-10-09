import { ArrowDown, FileDown, FolderOpen, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/data/profile";
import { SceneSection } from "./SectionShell";

export function HeroSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="hero" vh={220} innerClassName="justify-center">
      <div className="flex w-full flex-col items-start gap-6 pb-10 pt-24 sm:items-center sm:text-center">
        <span className="chip flex items-center gap-2 border-cyan/30 bg-cyan/10 text-cyan">
          <Sparkles className="size-3.5" aria-hidden />
          {dict.hero.availability}
        </span>

        <h1 className="font-display text-halo text-[15vw] font-bold leading-[0.95] tracking-tight text-ink sm:text-8xl lg:text-9xl">
          Yahya{" "}
          <span className="bg-gradient-to-r from-cyan via-cobalt to-violet bg-clip-text text-transparent text-glow">
            Tamda
          </span>
        </h1>

        <p className="kicker text-halo !text-[0.8rem] text-cyan">{dict.hero.role}</p>

        <p className="text-halo max-w-xl text-base leading-relaxed text-ink/90 sm:text-lg">
          {dict.hero.intro}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 sm:justify-center">
          <a href="#about" className="btn-primary">
            {dict.hero.ctaExplore}
          </a>
          <a href="#projects" className="btn-ghost">
            <FolderOpen className="size-4" aria-hidden />
            {dict.hero.ctaProjects}
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

        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-dim">
          <span className="text-[11px] uppercase tracking-[0.3em]">
            {dict.hero.scrollHint}
          </span>
          <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden />
        </div>
      </div>
    </SceneSection>
  );
}
