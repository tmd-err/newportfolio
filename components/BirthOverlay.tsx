"use client";

import { useEffect, useRef, useState } from "react";
import { journey } from "@/features/experience/journey-store";
import { clamp01, smoothstep } from "@/lib/utils";

/**
 * DOM layer of the birth intro: an opaque veil (SSR'd so the first
 * paint is already dark) and a discreet skip control. No text —
 * the cosmic birth speaks for itself.
 *
 * All animation is driven by a rAF loop writing styles directly —
 * no React re-renders. The site UI stays hidden via
 * `html[data-intro="1"]` until the handoff is nearly done.
 */
export function BirthOverlay({ skipLabel }: { skipLabel: string }) {
  const veil = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const t0 = performance.now();
    let raf = 0;

    const tick = () => {
      const T = journey.introT;
      const done = journey.introDone;

      // hide site UI + lock scroll while the intro runs — managed per
      // frame because the arming flag may flip after this effect mounts
      if (!done && T <= 0.94) {
        root.dataset.intro = "1";
        root.style.overflow = "hidden";
      } else {
        delete root.dataset.intro;
        root.style.overflow = "";
      }

      // veil: lifts early in the intro; quick fade for returning visitors
      const v = done
        ? Math.max(0, 1 - (performance.now() - t0) / 450)
        : 1 - smoothstep(clamp01(T / 0.16));
      if (veil.current) veil.current.style.opacity = v.toFixed(3);

      if (skip.current) {
        skip.current.style.opacity =
          !done && T < 0.8 && T > 0.05 ? "1" : "0";
      }

      if (done && v <= 0) {
        setGone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      delete root.dataset.intro;
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {/* darkness veil */}
      <div ref={veil} aria-hidden className="absolute inset-0 bg-abyss" />

      {/* discreet skip */}
      <button
        ref={skip}
        type="button"
        onClick={() => {
          journey.introSkip = true;
        }}
        className="pointer-events-auto absolute bottom-8 right-8 font-mono text-[11px] tracking-[0.3em] text-dim uppercase transition-opacity duration-300 hover:text-ink rtl:right-auto rtl:left-8"
      >
        {skipLabel} →
      </button>
    </div>
  );
}
