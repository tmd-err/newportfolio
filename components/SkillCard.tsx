"use client";

import { useEffect, useRef } from "react";
import type { SkillGroup } from "@/data/skills";

/**
 * An interactive constellation card: a faint starfield lives inside the
 * panel, stars twinkle and drift slightly toward the pointer, and the
 * card tilts in 3D toward the cursor. All drawing runs on one small
 * canvas per card, only while the card is on screen.
 */
export function SkillCard({
  group,
  title,
  blurb,
}: {
  group: SkillGroup;
  title: string;
  blurb: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const card = wrap.current;
    const ctx = canvas.current?.getContext("2d");
    if (!card || !canvas.current || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // deterministic star positions per group id
    let seed = group.id.length * 7919;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const stars = Array.from({ length: 34 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.5 + rand() * 1.1,
      phase: rand() * Math.PI * 2,
      speed: 0.4 + rand() * 0.9,
      depth: 0.3 + rand() * 0.7, // parallax weight toward the cursor
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.current!.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.current!.width = Math.max(1, w * dpr);
      canvas.current!.height = Math.max(1, h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.current);

    // pointer state
    let px = 0.5;
    let py = 0.5;
    let hover = 0;
    let hoverTarget = 0;
    let tiltX = 0;
    let tiltY = 0;

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
    };
    const onEnter = () => { hoverTarget = 1; };
    const onLeave = () => { hoverTarget = 0; px = 0.5; py = 0.5; };
    if (fine && !reduced) {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    }

    let inView = false;
    const io = new IntersectionObserver(
      ([e]) => { inView = e.isIntersecting; },
      { threshold: 0.05 },
    );
    io.observe(card);

    const accent = group.accent;
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!inView) return;
      t += dt;

      hover += (hoverTarget - hover) * Math.min(1, dt * 7);
      tiltX += ((0.5 - py) * 6 * hoverTarget - tiltX) * Math.min(1, dt * 9);
      tiltY += ((px - 0.5) * 7 * hoverTarget - tiltY) * Math.min(1, dt * 9);

      if (inner.current) {
        inner.current.style.transform =
          `perspective(700px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
      if (glow.current) {
        glow.current.style.opacity = (hover * 0.55).toFixed(3);
        glow.current.style.background =
          `radial-gradient(160px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, ${accent}26, transparent 70%)`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        // stars drift subtly toward the pointer, weighted by depth
        const ox = (px - 0.5) * 14 * s.depth * hover;
        const oy = (py - 0.5) * 14 * s.depth * hover;
        const tw = 0.45 + 0.55 * Math.sin(t * s.speed + s.phase);
        const a = (0.25 + hover * 0.55) * Math.max(0.05, tw);
        ctx.globalAlpha = a;
        ctx.fillStyle = s.depth > 0.8 ? accent : "#e8e3d9";
        ctx.beginPath();
        ctx.arc(s.x * w + ox, s.y * h + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      // one static faint frame — no animation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const s of stars) {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = s.depth > 0.8 ? accent : "#e8e3d9";
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (fine && !reduced) {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [group.id, group.accent]);

  return (
    <div ref={wrap} className="h-full">
      <div
        ref={inner}
        className="panel relative h-full overflow-hidden p-5 will-change-transform"
      >
        {/* interactive starfield behind the content */}
        <canvas
          ref={canvas}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        {/* cursor-tracked glow */}
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span
              className="size-2 rounded-full"
              style={{
                background: group.accent,
                boxShadow: `0 0 12px ${group.accent}`,
              }}
              aria-hidden
            />
            <h3 className="text-sm font-semibold text-ink">{title}</h3>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-dim">{blurb}</p>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="chip transition-all duration-200 hover:-translate-y-0.5 hover:text-ink"
                style={{ borderColor: `${group.accent}33` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
