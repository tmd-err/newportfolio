import { Briefcase, GraduationCap } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { timeline } from "@/data/timeline";
import { Reveal } from "@/components/Reveal";

/**
 * The timeline is intentionally NOT pinned: milestones flow past while
 * the camera glides along the light ribbon in the scene.
 */
export function JourneySection({ dict }: { dict: Dictionary }) {
  return (
    <section id="journey" data-act="journey" className="relative px-5 sm:px-10" style={{ minHeight: "300svh" }} aria-label={dict.journey.label}>
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-0 flex min-h-svh items-center">
          <Reveal className="max-w-xl">
            <p className="kicker text-halo">{dict.journey.label}</p>
            <h2 className="font-display text-halo mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {dict.journey.heading}
            </h2>
            <p className="text-halo mt-4 text-[15px] leading-relaxed text-ink/85">
              {dict.journey.intro}
            </p>
          </Reveal>
        </div>

        {timeline.map((m, i) => {
          const copy = dict.journey.items[m.id];
          const Icon = m.kind === "experience" ? Briefcase : GraduationCap;
          const accent = m.kind === "experience" ? "#34d399" : "#38bdf8";
          return (
            <div
              key={m.id}
              className={`flex min-h-[55svh] items-center ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <Reveal className="panel w-full max-w-md rounded-3xl p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={{
                      background: `${accent}1f`,
                      color: accent,
                      border: `1px solid ${accent}44`,
                    }}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="kicker !text-[0.62rem]">
                      {m.kind === "experience"
                        ? dict.journey.experience
                        : dict.journey.education}
                    </p>
                    <p
                      className="text-xs font-semibold tracking-wide"
                      style={{ color: accent }}
                    >
                      {copy.period}
                    </p>
                  </div>
                </div>
                <h3 className="font-display mt-4 text-xl font-bold leading-snug text-ink">
                  {copy.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-mist">{copy.org}</p>
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  {copy.summary}
                </p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
