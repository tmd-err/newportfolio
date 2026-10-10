"use client";

import { useRef, useState } from "react";

/**
 * A small rocket that sits at the edge of the page and, on activation,
 * ignites and lifts off while the page scrolls back to launch.
 * Re-armable — returns to its pad once the launch completes.
 */
export function RocketReturn({ label }: { label: string }) {
  const [launching, setLaunching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const launch = () => {
    if (launching) return;
    setLaunching(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    timer.current = setTimeout(() => setLaunching(false), reduced ? 600 : 1900);
  };

  return (
    <button
      type="button"
      onClick={launch}
      aria-label={label}
      title={label}
      className="rocket-btn group"
      data-site-ui
      data-launching={launching || undefined}
    >
      <span className="rocket-label">{label}</span>
      <span className="rocket-body" aria-hidden>
        <svg viewBox="0 0 34 48" width="30" height="42" fill="none">
          {/* body */}
          <path
            d="M17 2 C22 8 24 16 24 24 L24 32 L10 32 L10 24 C10 16 12 8 17 2 Z"
            fill="#d8d4ca"
            stroke="#3a3f45"
            strokeWidth="1"
          />
          {/* window */}
          <circle cx="17" cy="16" r="3.4" fill="#2a3540" stroke="#5f8a86" strokeWidth="1" />
          {/* fins */}
          <path d="M10 26 L4 36 L10 32 Z" fill="#8a8578" stroke="#3a3f45" strokeWidth="0.8" />
          <path d="M24 26 L30 36 L24 32 Z" fill="#8a8578" stroke="#3a3f45" strokeWidth="0.8" />
          {/* nozzle */}
          <path d="M12 32 L22 32 L20 37 L14 37 Z" fill="#4a4f55" stroke="#3a3f45" strokeWidth="0.8" />
        </svg>
        <span className="rocket-flame" />
        <span className="rocket-spark rocket-spark-a" />
        <span className="rocket-spark rocket-spark-b" />
      </span>
    </button>
  );
}
