"use client";

import { Planet, Moon, DebrisField } from "../props/Cosmos";

/**
 * Act II — the planetary approach. A large procedural world looms off
 * the flight path: fbm continents, drifting cloud bands, polar ice, a
 * day/night terminator lit by the distant system star, a thin
 * atmosphere rim, a grey companion moon and a sparse debris scatter.
 */
export function PlanetWorld() {
  return (
    <group>
      {/* the main planet — lit from the system star at (-50,30,-530) */}
      <Planet position={[36, -20, -215]} radius={22} sunDir={[-0.55, 0.35, -0.72]} />
      <Moon position={[62, 6, -262]} radius={4} />

      {/* sparse rocky debris in the planet's vicinity */}
      <DebrisField center={[18, -10, -235]} count={150} spread={42} seed={9} />
      <DebrisField center={[-14, 4, -420]} count={110} spread={36} seed={21} />

      {/* key light from the system star — weak this far out */}
      <directionalLight
        position={[-40, 20, -100]}
        intensity={1.6}
        color="#cfe2ff"
      />
      <pointLight color="#4a70b8" intensity={6} distance={70} position={[20, -12, -200]} />
      <hemisphereLight args={["#1a2440", "#02030a", 0.5]} />
    </group>
  );
}
