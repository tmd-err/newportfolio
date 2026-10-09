"use client";

import { useEffect, useRef } from "react";

export interface RailAct {
  id: string;
  label: string;
}

/**
 * A discreet vertical rail showing where the visitor is in the journey.
 * Each dot maps to a section's share of the total scroll range.
 */
export function ProgressRail({
  acts,
  label,
}: {
  acts: RailAct[];
  label: string;
}) {
  const dotsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const sections = acts
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    let raf = 0;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      sections.forEach((sec, i) => {
        const start = sec.offsetTop / scrollable;
        const next = sections[i + 1];
        const end = next ? next.offsetTop / scrollable : 1;
        const dot = dotsRef.current[i];
        if (dot) {
          const active = p >= start - 0.002 && p < end;
          dot.dataset.active = active ? "true" : "false";
          const inner = dot.querySelector<HTMLElement>("[data-fill]");
          if (inner) {
            const local = Math.min(1, Math.max(0, (p - start) / Math.max(end - start, 1e-5)));
            inner.style.transform = `scaleY(${active || p >= end ? local : 0})`;
          }
        }
      });
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [acts]);

  return (
    <nav
      aria-label={label}
      className="fixed end-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
    >
      {acts.map((act, i) => (
        <a
          key={act.id}
          href={`#${act.id}`}
          ref={(el) => {
            dotsRef.current[i] = el;
          }}
          className="group flex items-center gap-2.5"
          data-active="false"
        >
          <span className="pointer-events-none hidden rounded-md bg-abyss/80 px-2 py-0.5 text-[11px] text-mist opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 lg:block">
            {act.label}
          </span>
          <span className="relative block h-6 w-[3px] overflow-hidden rounded-full bg-white/15">
            <span
              data-fill
              className="absolute inset-0 origin-top rounded-full bg-cyan transition-transform duration-150 group-data-[active=true]:bg-cyan"
              style={{ transform: "scaleY(0)" }}
            />
          </span>
        </a>
      ))}
    </nav>
  );
}
