"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Planet,
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

const EARTH = {
  ocean: "#0b2d4f",
  shallow: "#1b5a7a",
  low: "#2d5a33",
  high: "#8a7a5c",
  ice: "#dfe8f0",
  atmos: "#4f8fd0",
  landLevel: 0.51,
  clouds: 0.7,
};

const MARS = {
  ocean: "#2a140e",
  shallow: "#4a2418",
  low: "#8a4526",
  high: "#b06a3e",
  ice: "#d8cfc0",
  atmos: "#c98050",
  landLevel: 0.38,
  clouds: 0.25,
};

const SUN = [-0.7, 0.45, -0.55] as [number, number, number];

function ProjectWorld({ slug }: { slug: ProjectSlug }) {
  switch (slug) {
    case "edtech": // Earth — right edge, high
      return (
        <Planet
          position={[6.5, 1.5, -15]}
          radius={5}
          sunDir={SUN}
          spin={0.02}
          palette={EARTH}
        />
      );
    case "crafthub": // Mars — left, low
      return (
        <Planet
          position={[-6, -1, -13]}
          radius={4}
          sunDir={SUN}
          seed={9}
          spin={0.02}
          palette={MARS}
        />
      );
    case "velora": // Jupiter — right, dominant
      return (
        <GasGiant
          position={[6.5, 0.5, -16]}
          radius={5.5}
          sunDir={SUN}
          seed={4}
          spin={0.035}
          palette={{
            a: "#d8c4a0",
            b: "#b08d5f",
            c: "#6e5136",
            atmos: "#a89a7c",
            contrast: 1,
            spot: { lat: -0.28, lon: 0.6, size: 0.5, color: "#a05232" },
          }}
        />
      );
    case "autotrack": // Saturn — upper right, ringed
      return (
        <group>
          <GasGiant
            position={[6, 2, -16]}
            radius={4.5}
            sunDir={SUN}
            seed={8}
            spin={0.028}
            palette={{
              a: "#e0d4ae",
              b: "#c9b98f",
              c: "#9a8a68",
              atmos: "#cfc4a2",
              contrast: 0.7,
            }}
          />
          <RingSystem
            position={[6, 2, -16]}
            inner={6}
            outer={11.5}
            tilt={[1.35, 0.1, 0.3]}
            tint="#c2b490"
          />
        </group>
      );
    case "facedetector": // Uranus — left, pale cyan
      return (
        <GasGiant
          position={[-6, 1.5, -13]}
          radius={4}
          sunDir={SUN}
          seed={12}
          spin={0.02}
          palette={{
            a: "#a8ccd0",
            b: "#93bcc2",
            c: "#7fa8ae",
            atmos: "#b8d8dc",
            contrast: 0.2,
          }}
        />
      );
    case "scholvia": // Neptune — right, deep blue
      return (
        <GasGiant
          position={[6, -1, -14]}
          radius={4.5}
          sunDir={SUN}
          seed={16}
          spin={0.02}
          palette={{
            a: "#4a6fae",
            b: "#3a5a92",
            c: "#2a4270",
            atmos: "#6a8fc4",
            contrast: 0.65,
            spot: { lat: -0.2, lon: 2.2, size: 0.4, color: "#1c3054" },
          }}
        />
      );
    case "autonova": // Venus — left, creamy
    default:
      return (
        <GasGiant
          position={[-5.5, 0.5, -12]}
          radius={3.8}
          sunDir={SUN}
          seed={6}
          spin={0.008}
          palette={{
            a: "#d8c9a3",
            b: "#c9b48d",
            c: "#b39a76",
            atmos: "#e8dcc0",
            contrast: 0.35,
          }}
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
