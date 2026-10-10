import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { supportingProjects } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";

export function SupportingProjectsSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <SceneSection id="projects-more" vh={140} innerClassName="justify-center">
      <div className="w-full">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-halo text-3xl font-bold text-ink sm:text-4xl">
            {dict.projects.supportingHeading}
          </h2>
          <p className="text-halo mt-3 text-[15px] text-ink/85">
            {dict.projects.supportingIntro}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {supportingProjects.map((p, i) => {
            const copy = dict.projects.items[p.slug];
            return (
              <Reveal key={p.slug} delay={i * 100}>
                <Link
                  href={`/${locale}/projects/${p.slug}`}
                  className="panel group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        background: p.accent,
                        boxShadow: `0 0 10px ${p.accent}`,
                      }}
                      aria-hidden
                    />
                    <span className="flex items-center gap-1 text-[11px] text-dim">
                      <Lock className="size-3" aria-hidden />
                      {dict.projects.privateLabel}
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-xl font-bold text-ink">
                    {copy.name}
                  </h3>
                  <p className="kicker mt-1 !text-[0.62rem]">{copy.kicker}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                    {copy.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="chip !text-[0.68rem]">
                          {s}
                        </span>
                      ))}
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-dim transition-transform group-hover:translate-x-1 group-hover:text-mineral rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SceneSection>
  );
}
