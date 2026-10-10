import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";
import { cn } from "@/lib/utils";

/**
 * One project destination. Editorial layout: index, serif title, quiet
 * metadata — staged reveals timed inside the section's scroll act.
 */
export function ProjectWorldSection({
  project,
  dict,
  locale,
  side,
  valign = "center",
  index,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  side: "left" | "right";
  valign?: "top" | "center" | "bottom";
  index: number;
}) {
  const copy = dict.projects.items[project.slug];

  return (
    <SceneSection
      id={`project-${project.slug}`}
      vh={170}
      innerClassName={cn(
        side === "right"
          ? "justify-end rtl:justify-start"
          : "justify-start rtl:justify-end",
        valign === "top" && "items-start pt-20 sm:pt-24",
        valign === "bottom" && "items-end pb-20 sm:pb-24",
      )}
    >
      <div className="panel panel-cut w-full max-w-md p-7 sm:p-8">
        <Reveal>
          <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-4">
            <span className="font-display text-4xl font-light text-teal">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="kicker">{copy.kicker}</p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h3 className="font-display mt-4 text-3xl font-medium text-ink">
            {copy.name}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-mist">
            {copy.summary}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-4 space-y-1.5">
            {copy.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-baseline gap-2.5 text-sm text-mist">
                <span className="text-teal" aria-hidden>
                  —
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={260}>
          <p className="mt-5 font-mono text-xs leading-relaxed text-dim">
            {project.stack.join("  ·  ")}
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink/10 pt-5">
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-teal transition-colors hover:text-ink"
            >
              {dict.projects.viewProject}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-ink"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-ink"
              >
                {dict.projects.demo}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </SceneSection>
  );
}
