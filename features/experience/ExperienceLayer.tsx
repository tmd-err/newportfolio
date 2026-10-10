"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "./journey-store";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { DestinationHud } from "@/components/DestinationHud";
import { BirthOverlay } from "@/components/BirthOverlay";
import type { Dictionary } from "@/lib/i18n/types";

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
});

let envProbed: boolean | null = null;

/** One-time environment probe: WebGL support + motion & power hints. */
function probeEnvironment(): boolean {
  if (envProbed !== null) return envProbed;
  journey.reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  journey.lowQuality = window.innerWidth < 820;
  try {
    const c = document.createElement("canvas");
    envProbed = !!(
      c.getContext("webgl2") ??
      c.getContext("webgl") ??
      c.getContext("experimental-webgl")
    );
  } catch {
    envProbed = false;
  }
  return envProbed;
}

const subscribeNoop = () => () => {};
const getServerSnapshot = () => false;

/**
 * Client boundary for the whole 3D journey:
 *  - mounts the canvas (with a static fallback when WebGL is missing)
 *  - drives `journey.progress` from a scrubbed GSAP ScrollTrigger
 *  - tracks the pointer for camera parallax + 3D raycasting
 *  - injects locale + SPA navigation into the journey store
 *  - renders the hover chip for interactive installations
 */
export function ExperienceLayer({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const router = useRouter();
  const [hovered, setHoveredState] = useState<string | null>(null);
  const webgl = useSyncExternalStore(
    subscribeNoop,
    probeEnvironment,
    getServerSnapshot,
  );

  // inject navigation + locale + hover callback into the store
  useEffect(() => {
    journey.locale = locale;
    journey.navigate = (path) => router.push(path);
    journey.onHoverChange = setHoveredState;
    return () => {
      journey.navigate = null;
      journey.onHoverChange = null;
    };
  }, [locale, router]);

  // arm the birth intro once per session (before scroll init)
  useEffect(() => {
    if (!webgl) return;
    try {
      if (!sessionStorage.getItem("yt-born")) {
        journey.introT = 0;
        journey.introDone = false;
      }
    } catch {
      journey.introT = 0;
      journey.introDone = false;
    }
  }, [webgl]);

  useEffect(() => {
    if (!webgl) return;
    gsap.registerPlugin(ScrollTrigger);

    const target = { p: 0 };
    const tween = gsap.to(target, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#journey-scroll",
        start: "top top",
        end: "bottom bottom",
        scrub: journey.reducedMotion ? true : 1.4,
      },
      onUpdate: () => {
        journey.progress = target.p;
      },
    });

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      journey.pointerX = nx;
      journey.pointerY = ny;
      journey.ndcX = nx;
      journey.ndcY = ny;
      journey.pointerDirty = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      tween.scrollTrigger?.kill();
      tween.kill();
      journey.progress = 0;
    };
  }, [webgl]);

  const hoveredName = hovered
    ? dict.projects.items[hovered as keyof typeof dict.projects.items]?.name
    : null;

  const overlay = <BirthOverlay skipLabel={dict.nav.skipIntro} />;

  if (!webgl) {
    // graceful fallback: layered aurora gradients behind the content
    return (
      <>
        {overlay}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
          background:
            "radial-gradient(60% 50% at 20% 15%, rgba(113,138,154,.14), transparent 60%)," +
            "radial-gradient(50% 40% at 80% 30%, rgba(70,80,95,.12), transparent 60%)," +
            "radial-gradient(55% 45% at 60% 85%, rgba(183,121,85,.10), transparent 60%)," +
            "#090a0c",
          }}
        />
      </>
    );
  }

  return (
    <>
      {overlay}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <ExperienceCanvas />
        {/* gentle vignette — keeps light UI text readable over bright scenes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 50% 42%, transparent 52%, rgba(9,10,12,.5) 100%)," +
              "linear-gradient(to bottom, rgba(9,10,12,.28), transparent 18%, transparent 82%, rgba(9,10,12,.35))",
          }}
        />
      </div>
      {/* hover chip — appears when a 3D installation is under the cursor */}
      {hoveredName && (
        <div
          className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2"
          aria-hidden
        >
          <div className="flex items-center gap-2.5 rounded-sm border border-ink/20 bg-abyss/75 px-4 py-2 font-mono text-xs tracking-wide text-ink backdrop-blur-md">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" />
            {hoveredName}
            <span className="text-mist">· {dict.projects.viewProject}</span>
          </div>
        </div>
      )}
      <CustomCursor />
      <DestinationHud />
    </>
  );
}
