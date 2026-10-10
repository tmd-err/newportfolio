import { ExternalLink, FileDown } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SceneSection } from "./SectionShell";

export function CvSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="cv" vh={180} innerClassName="justify-center">
      <Reveal className="panel relative w-full max-w-xl overflow-hidden p-8 text-center sm:p-10">
        {/* portal glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgba(183,121,85,.12), transparent 70%)",
          }}
        />
        <p className="kicker relative">{dict.cv.label}</p>
        <h2 className="font-display relative mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {dict.cv.heading}
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-mist">
          {dict.cv.text}
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={profile.cvPath}
            download="tamda_yahya.pdf"
            className="btn-primary"
          >
            <FileDown className="size-4" aria-hidden />
            {dict.cv.download}
          </a>
          <a
            href={profile.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <ExternalLink className="size-4" aria-hidden />
            {dict.cv.open}
          </a>
        </div>
      </Reveal>
    </SceneSection>
  );
}
