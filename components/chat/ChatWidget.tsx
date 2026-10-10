"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { ChatPanel } from "./ChatPanel";

/**
 * Floating launcher — a quiet corner control that opens the chat
 * panel over any section of the journey. Hidden during the birth
 * intro via [data-site-ui].
 */
export function ChatWidget({ dict }: { dict: Dictionary["chat"] }) {
  const [open, setOpen] = useState(false);

  return (
    <div data-site-ui className="fixed bottom-6 left-6 z-50 rtl:bottom-20">
      {open && (
        <div
          className="panel mb-3 flex h-[min(60vh,460px)] w-[min(92vw,380px)] flex-col p-4"
          role="dialog"
          aria-label={dict.title}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-teal shadow-[0_0_8px_currentColor]" />
              <span className="font-mono text-[11px] tracking-[0.22em] text-mist uppercase">
                {dict.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.close}
              className="p-1 text-dim transition-colors hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <ChatPanel dict={dict} />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? dict.close : dict.open}
        className="flex size-11 items-center justify-center rounded-full border border-ink/15 bg-deep/80 text-mist backdrop-blur-md transition-all hover:border-teal/40 hover:text-teal"
      >
        {open ? <X className="size-4" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
