import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { SceneSection } from "./SectionShell";

/**
 * Epilogue — a dedicated conversation spot at the end of the journey,
 * facing the black hole. Same ChatPanel as the floating widget.
 */
export function ChatSection({ dict }: { dict: Dictionary }) {
  return (
    <SceneSection id="chat" vh={160} innerClassName="justify-center">
      <div className="w-full max-w-2xl pb-8">
        <Reveal>
          <p className="kicker text-halo">{dict.chat.sectionLabel}</p>
          <h2 className="font-display text-halo mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {dict.chat.heading}
          </h2>
          <p className="text-halo mt-4 text-[15px] leading-relaxed text-ink/85">
            {dict.chat.intro}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="panel mt-8 h-[420px] p-4">
            <ChatPanel dict={dict.chat} />
          </div>
        </Reveal>
      </div>
    </SceneSection>
  );
}
