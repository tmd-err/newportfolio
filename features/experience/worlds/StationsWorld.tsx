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
  edtech: { pos: [-24, 7, -368], tilt: 0.55 },       // before Earth
  crafthub: { pos: [23, -11, -488], tilt: -0.4 },    // before Mars
  velora: { pos: [-28, 15, -662], tilt: 0.9 },       // before Jupiter
  autotrack: { pos: [29, 19, -822], tilt: -0.65 },   // before Saturn
  facedetector: { pos: [-20, -15, -965], tilt: 0.3 }, // before Uranus
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
