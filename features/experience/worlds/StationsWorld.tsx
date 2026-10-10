"use client";

import { ProjectOrb } from "../props/Cosmos";
import { featuredProjects } from "@/data/projects";

/**
 * The project destinations — five artificial orbs scattered through the
 * universe, one per featured project, each anchored near its celestial
 * landmark. Hover opens the orbit ring's light; clicking navigates to
 * the project page. Positions match the CAMERA_KEYS look targets.
 */
const ORBS: Record<string, { pos: [number, number, number]; tilt: number }> = {
  edtech: { pos: [-30, 8, -165], tilt: 0.55 },       // beside the rust planet
  crafthub: { pos: [34, -16, -330], tilt: -0.4 },    // low right, icy moon
  velora: { pos: [-34, -22, -455], tilt: 0.9 },      // low left, volcanic field
  autotrack: { pos: [26, 20, -585], tilt: -0.65 },   // high right, ringed giant
  facedetector: { pos: [4, -2, -640], tilt: 0.3 },   // deep dark, teal world
};

export function StationsWorld() {
  return (
    <group>
      {featuredProjects.map((p) => {
        const orb = ORBS[p.slug] ?? { pos: [0, 0, -300] as [number, number, number], tilt: 0.5 };
        return (
          <ProjectOrb
            key={p.slug}
            project={p}
            position={orb.pos}
            tilt={orb.tilt}
          />
        );
      })}
    </group>
  );
}
