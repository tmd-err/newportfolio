import type { Dictionary } from "@/lib/i18n";
import { skillGroups } from "@/data/skills";
import { Reveal } from "@/components/Reveal";
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
              <div className="panel h-full rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: g.accent,
                      boxShadow: `0 0 12px ${g.accent}`,
                    }}
                    aria-hidden
                  />
                  <h3 className="text-sm font-semibold text-ink">
                    {dict.skills.groups[g.id].title}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-dim">
                  {dict.skills.groups[g.id].blurb}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="chip transition-colors hover:text-ink"
                      style={{ borderColor: `${g.accent}33` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SceneSection>
  );
}
