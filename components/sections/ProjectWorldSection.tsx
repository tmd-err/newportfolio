import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";
import { cn } from "@/lib/utils";

/**
 * One project world. The text panel sits on the opposite side of the
 * screen from the 3D pod so the two never fight for attention.
 */
export function ProjectWorldSection({
  project,
  dict,
  locale,
  side,
  index,
}: {
  project: Project;
  dict: Dictionary;
  locale: Locale;
  side: "left" | "right";
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
      )}
    >
      <Reveal className="panel w-full max-w-md rounded-3xl p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span
            className="size-2.5 rounded-full"
            style={{ background: project.accent, boxShadow: `0 0 14px ${project.accent}` }}
            aria-hidden
          />
          <p className="kicker">
            {String(index + 1).padStart(2, "0")} — {copy.kicker}
          </p>
        </div>

        <h3 className="font-display mt-3 text-3xl font-bold text-ink">
          {copy.name}
        </h3>

        <p className="mt-3 text-[15px] leading-relaxed text-mist">
          {copy.summary}
        </p>

        <ul className="mt-4 space-y-1.5">
          {copy.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-mist">
              <span
                className="size-1 rounded-full"
                style={{ background: project.accent }}
                aria-hidden
              />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            {dict.projects.viewProject}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </Link>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-4 !py-2.5 text-sm"
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
              className="btn-ghost !px-4 !py-2.5 text-sm"
            >
              <ArrowUpRight className="size-4" aria-hidden />
              {dict.projects.demo}
            </a>
          )}
        </div>
      </Reveal>
    </SceneSection>
  );
}
