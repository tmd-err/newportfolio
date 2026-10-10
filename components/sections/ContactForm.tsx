"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/data/profile";

/**
 * No backend on this static site — the form composes a mailto: with the
 * visitor's message pre-filled. Honest and functional.
 */
export function ContactForm({ dict }: { dict: Dictionary }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio contact — ${name || email || "hello"}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const inputCls =
    "w-full rounded border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ink placeholder:text-dim outline-none transition-colors focus:border-teal/60";

  return (
    <form onSubmit={submit} className="panel p-6 sm:p-7">
      <h3 className="font-display text-lg font-bold text-ink">
        {dict.contact.formTitle}
      </h3>
      <div className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.contact.formName}
            aria-label={dict.contact.formName}
            className={inputCls}
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.contact.formEmail}
            aria-label={dict.contact.formEmail}
            className={inputCls}
          />
        </div>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.contact.formMessage}
          aria-label={dict.contact.formMessage}
          rows={4}
          className={`${inputCls} resize-none`}
        />
        <button type="submit" className="btn-primary w-full justify-center">
          <Mail className="size-4" aria-hidden />
          {dict.contact.formSend}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-dim">
          {dict.contact.formHint}
        </p>
      </div>
    </form>
  );
}
