"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/features/experience/journey-store";

/**
 * Custom reticle cursor: a precise cyan dot + a smoothly interpolated
 * outer ring. Context states: `is-link` over interactive DOM, `is-inspect`
 * over a 3D interactable. Disabled on touch devices and reduced motion.
 */
export function CustomCursor() {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    if (!fine || reduced || !el) return;

    document.documentElement.classList.add("has-custom-cursor");
    el.style.opacity = "1";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        "a,button,input,textarea,select,[role='button'],[data-cursor]",
      );
      el.classList.toggle("is-link", interactive);
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      }
      if (ring.current) {
        const s = journey.hoveredSlug ? 1.6 : 1;
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(${s})`;
      }
      el.classList.toggle("is-inspect", !!journey.hoveredSlug);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div ref={wrap} className="custom-cursor" aria-hidden style={{ opacity: 0 }}>
      <div ref={ring} className="custom-cursor-ring" />
      <div ref={dot} className="custom-cursor-dot" />
    </div>
  );
}
