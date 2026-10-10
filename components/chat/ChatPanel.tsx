"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/**
 * The reusable conversation surface — used by the floating widget
 * and by the dedicated journey section. Talks to /api/chat, which
 * proxies Gemini with the portfolio knowledge as system prompt.
 */
export function ChatPanel({ dict }: { dict: Dictionary["chat"] }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: dict.greeting },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(false);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setError(true);
      setMessages(next);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto pe-1"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-teal/15 text-ink border border-teal/25"
                  : "bg-deep/80 text-ink/90 border border-ink/10"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-sm border border-ink/10 bg-deep/80 px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-pulse rounded-full bg-mist"
                  style={{ animationDelay: `${i * 180}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 font-mono text-[11px] text-dim">{dict.errorMsg}</p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={dict.placeholder}
          aria-label={dict.placeholder}
          maxLength={2000}
          className="min-w-0 flex-1 rounded-sm border border-ink/15 bg-deep/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-teal/50"
        />
        <button
          type="button"
          onClick={send}
          disabled={pending || !input.trim()}
          aria-label={dict.send}
          className="shrink-0 rounded-sm border border-teal/30 bg-teal/10 p-2.5 text-teal transition-colors hover:bg-teal/20 disabled:opacity-30 rtl:-scale-x-100"
        >
          <SendHorizonal className="size-4" />
        </button>
      </div>
    </div>
  );
}
