import type { Dictionary } from "@/lib/i18n";
import { skillGroups } from "@/data/skills";
import { Reveal } from "@/components/Reveal";
import { SkillCard } from "@/components/SkillCard";
import { SceneSection } from "./SectionShell";

export function SkillsSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="skills" vh={240} innerClassName="justify-center">
      <div className="w-full pb-8">
        <Reveal className="max-w-xl">
          <p className="kicker text-halo">{dict.skills.label}</p>
          <h2 className="font-display text-halo mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {dict.skills.heading}
          </h2>
          <p className="text-halo mt-4 text-[15px] leading-relaxed text-ink/85">
            {dict.skills.intro}
          </p>
        </Reveal>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id} delay={i * 70}>
              <SkillCard
                group={g}
                title={dict.skills.groups[g.id].title}
                blurb={dict.skills.groups[g.id].blurb}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </SceneSection>
  );
}
