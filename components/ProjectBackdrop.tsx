"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Planet,
  Moon,
  VolcanicBody,
  GasGiant,
  RingSystem,
  Starfield,
} from "@/features/experience/props/Cosmos";
import { journey } from "@/features/experience/journey-store";
import type { ProjectSlug } from "@/data/projects";

/**
 * Each project's own sky — one recognizable celestial body drifting
 * slowly in a sparse star field, positioned per page so no two project
 * worlds share the same composition.
 */

const RUST = {
  ocean: "#1a0d08",
  shallow: "#3d2014",
  low: "#7a3f24",
  high: "#a86a3f",
  ice: "#c9bfa8",
  atmos: "#c98050",
  landLevel: 0.4,
  clouds: 0.3,
};

const TEAL = {
  ocean: "#061a1c",
  shallow: "#0e3436",
  low: "#1d4a44",
  high: "#2f5b52",
  ice: "#cfe0dd",
  atmos: "#3f7a7a",
  landLevel: 0.55,
  clouds: 0.5,
};

const SUN = [-0.7, 0.45, -0.55] as [number, number, number];

function ProjectWorld({ slug }: { slug: ProjectSlug }) {
  switch (slug) {
    case "edtech": // the rust planet — right edge, high
      return (
        <Planet
          position={[6.5, 1.5, -15]}
          radius={5}
          sunDir={SUN}
          spin={0.025}
          palette={RUST}
        />
      );
    case "crafthub": // the pale mineral moon — left, low
      return (
        <Moon
          position={[-6, -1, -12]}
          radius={3.4}
          sunDir={SUN}
          tint={[0.66, 0.64, 0.58]}
          spin={0.008}
        />
      );
    case "velora": // the ember world — right, low
      return (
        <VolcanicBody
          position={[6.5, -2.5, -13]}
          radius={4.2}
          sunDir={SUN}
          spin={0.015}
        />
      );
    case "autotrack": // the ringed giant — upper right
      return (
        <group>
          <GasGiant
            position={[6, 2, -16]}
            radius={4.5}
            sunDir={SUN}
            spin={0.035}
          />
          <RingSystem
            position={[6, 2, -16]}
            inner={6}
            outer={11.5}
            tilt={[1.35, 0.1, 0.3]}
            tint="#a89a7c"
          />
        </group>
      );
    case "facedetector": // the teal ocean world — left, high
      return (
        <Planet
          position={[-6, 1.5, -13]}
          radius={4}
          sunDir={SUN}
          seed={23}
          spin={0.018}
          palette={TEAL}
        />
      );
    case "scholvia":
      return (
        <Planet
          position={[6, -1, -14]}
          radius={4.5}
          sunDir={SUN}
          seed={31}
          spin={0.02}
          palette={RUST}
        />
      );
    case "autonova":
    default:
      return (
        <Moon
          position={[-5.5, 0.5, -12]}
          radius={3.6}
          sunDir={SUN}
          tint={[0.6, 0.52, 0.46]}
          seed={41}
          spin={0.008}
        />
      );
  }
}

export function ProjectBackdrop({
  slug,
  accent,
  accentSoft,
}: {
  slug: ProjectSlug;
  accent: string;
  accentSoft: string;
}) {
  const webgl = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    },
    () => false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    journey.reducedMotion = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      journey.reducedMotion = e.matches;
    };
    mq.addEventListener("change", onChange);
    journey.lowQuality = window.innerWidth < 768;
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* tinted fallback — visible while loading and when WebGL is absent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(55% 45% at 75% 15%, ${accent}18, transparent 65%), radial-gradient(40% 35% at 15% 80%, ${accentSoft}10, transparent 60%), #090a0c`,
        }}
      />
      {webgl && (
        <Canvas
          dpr={journey.lowQuality ? [1, 1.2] : [1, 1.6]}
          camera={{ fov: 50, near: 0.1, far: 300, position: [0, 0, 4] }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        >
          {/* sparse star depth behind the planet */}
          <Starfield count={900} radius={80} zMin={-80} zMax={-8} size={1.4} seed={slug.length} />
          <directionalLight position={SUN} intensity={2} color="#e8ecdf" />
          <hemisphereLight args={["#161a22", "#050507", 0.5]} />
          <ProjectWorld slug={slug} />
        </Canvas>
      )}
    </div>
  );
}
