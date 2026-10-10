"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/features/experience/journey-store";

/**
 * Gravitational typography — letters are pulled toward a focal point
 * (the black hole's screen position) with force ∝ 1/distance, so
 * nearest glyphs bend most. Offsets modulate with slow incommensurate
 * sines, so the warp evolves continuously without a visible loop.
 * Accessible: the accessible name stays intact; deformation is visual.
 */
export function GravityText({
  text,
  className,
  /** focal point as a viewport fraction — where the hole sits */
  focal = { x: 0.6, y: 0.4 },
}: {
  text: string;
  className?: string;
  focal?: { x: number; y: number };
}) {
  const root = useRef<HTMLSpanElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el || journey.reducedMotion) return;

    const letters = Array.from(
      el.querySelectorAll<HTMLElement>("[data-g]"),
    );
    if (letters.length === 0) return;

    // rest positions from layout offsets — unaffected by transforms
    const bases = letters.map((l) => ({
      x: l.offsetLeft + l.offsetWidth / 2,
      y: l.offsetTop + l.offsetHeight / 2,
    }));

    const io = new IntersectionObserver(
      ([e]) => { visible.current = e.isIntersecting; },
      { threshold: 0.05 },
    );
    io.observe(el);

    let raf = 0;
    let t = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible.current || journey.reducedMotion) return;
      t += dt;

      // gravity strength ramps in as the camera closes on the horizon
      const p = journey.progress;
      const s = Math.min(1, Math.max(0, (p - 0.86) / 0.12));
      if (s <= 0.001) {
        for (const l of letters) l.style.transform = "";
        return;
      }

      const rect = el.getBoundingClientRect();
      const fx = focal.x * window.innerWidth - rect.left;
      const fy = focal.y * window.innerHeight - rect.top;

      for (let i = 0; i < letters.length; i++) {
        const l = letters[i];
        const b = bases[i];
        const dx = fx - b.x;
        const dy = fy - b.y;
        const dist = Math.max(60, Math.hypot(dx, dy));
        const pull = s * Math.min(34, 2600 / dist);
        // incommensurate modulations — no repeating loop
        const w1 = 0.72 + 0.28 * Math.sin(t * 0.53 + i * 0.71);
        const w2 = 0.72 + 0.28 * Math.cos(t * 0.41 + i * 0.93);
        const ox = (dx / dist) * pull * w1;
        const oy = (dy / dist) * pull * w2;
        const rot = (pull / 34) * 14 * Math.sin(t * 0.37 + i * 1.3);
        const stretch = 1 + (pull / 34) * 0.25 * Math.sin(t * 0.61 + i);
        l.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scaleY(${stretch.toFixed(3)})`;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [focal.x, focal.y]);

  return (
    <span ref={root} className={className} aria-label={text} role="text">
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden>
            {" "}
          </span>
        ) : (
          <span key={i} data-g aria-hidden className="inline-block will-change-transform">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
