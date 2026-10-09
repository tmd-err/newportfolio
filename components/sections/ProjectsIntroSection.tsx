import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";

export function ProjectsIntroSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="projects" vh={120} innerClassName="justify-center">
      <Reveal className="w-full max-w-2xl text-start sm:text-center">
        <p className="kicker text-halo">{dict.projects.label}</p>
        <h2 className="font-display text-halo mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {dict.projects.heading}
        </h2>
        <p className="text-halo mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/85">
          {dict.projects.intro}
        </p>
      </Reveal>
    </SceneSection>
  );
}
