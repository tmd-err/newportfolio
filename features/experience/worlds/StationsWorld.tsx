"use client";

import { ProjectStation } from "../props/Cosmos";
import { featuredProjects } from "@/data/projects";

/**
 * The project destinations — five stations strung along the flight
 * corridor, one per featured project. Hover brightens the beacon and
 * shows the DOM chip; clicking navigates to the project page.
 * Positions match the CAMERA_KEYS look targets.
 */
const STATIONS: Record<string, [number, number, number]> = {
  edtech: [10, -2, -250],
  crafthub: [-14, 4, -300],
  velora: [14, 6, -350],
  autotrack: [-12, -2, -400],
  facedetector: [4, 0, -450],
};

export function StationsWorld() {
  return (
    <group>
      {featuredProjects.map((p) => {
        const pos = STATIONS[p.slug] ?? [0, 0, -300];
        return (
          <ProjectStation
            key={p.slug}
            project={p}
            position={pos}
            rotationY={pos[0] > 0 ? -0.4 : 0.4}
          />
        );
      })}
    </group>
  );
}
