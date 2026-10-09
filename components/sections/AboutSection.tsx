import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";

export function AboutSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection
      id="about"
      vh={220}
      innerClassName="justify-end rtl:justify-start"
    >
      <Reveal className="panel w-full max-w-xl rounded-3xl p-7 sm:p-9">
        <p className="kicker">{dict.about.label}</p>
        <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {dict.about.heading}
        </h2>
        <p className="mt-3 text-base font-medium text-amber/90">
          {dict.about.lead}
        </p>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-mist">
          {dict.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
          {dict.about.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-dim">
                {f.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </SceneSection>
  );
}
