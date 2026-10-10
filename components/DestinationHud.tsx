"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/features/experience/journey-store";

const DESTINATIONS: Array<[number, string]> = [
  [0.0, "SOL"],
  [0.05, "MERCURY · I"],
  [0.155, "VENUS · II"],
  [0.235, "EARTH · III"],
  [0.315, "MARS · IV"],
  [0.385, "THE BELT"],
  [0.42, "JUPITER · V"],
  [0.5, "SATURN · VI"],
  [0.545, "URANUS · VII"],
  [0.615, "NEPTUNE · VIII"],
  [0.71, "DEEP SPACE"],
  [0.9, "EVENT HORIZON"],
];

/**
 * A quiet mono label naming the celestial region the camera is in.
 * Driven by journey.progress — updates without React renders.
 */
export function DestinationHud() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = setInterval(() => {
      const p = journey.progress;
      let label = DESTINATIONS[0][1];
      for (const [min, name] of DESTINATIONS) {
        if (p >= min) label = name;
      }
      if (el.textContent !== label) {
        el.textContent = label;
        el.classList.remove("dest-flash");
        void el.offsetWidth; // restart the fade
        el.classList.add("dest-flash");
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed bottom-6 right-6 z-20 font-mono text-[10px] tracking-[0.28em] text-dim rtl:right-auto rtl:left-6"
    />
  );
}
