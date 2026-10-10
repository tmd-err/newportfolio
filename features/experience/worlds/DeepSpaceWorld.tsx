"use client";

import { Starfield, NebulaVeil, DustField, MeteorField } from "../props/Cosmos";

/**
 * The persistent void — layered starfields, vast restrained nebula
 * veils at scattered depths, a distant galaxy, drifting dust along the
 * winding route, and occasional fire meteors crossing the view.
 */
export function DeepSpaceWorld() {
  return (
    <group>
      {/* star depth layers — different scales, densities, distances */}
      <Starfield count={2600} radius={480} zMin={-1400} zMax={-100} size={1.9} seed={1} />
      <Starfield count={1800} radius={340} zMin={-800} zMax={-20} size={1.3} seed={7} />
      <Starfield count={900} radius={220} zMin={-450} zMax={20} size={0.9} seed={13} />

      {/* nebula veils — few, vast, scattered off the flight axis */}
      <NebulaVeil
        position={[-120, 30, -260]}
        rotation={[0, 0.4, 0.15]}
        width={380}
        height={230}
        colorA="#0b1c3c"
        colorB="#241b48"
        seed={2}
        opacity={0.45}
      />
      <NebulaVeil
        position={[110, -40, -450]}
        rotation={[0, -0.5, -0.1]}
        width={320}
        height={200}
        colorA="#0a1633"
        colorB="#1d2850"
        seed={5}
        opacity={0.4}
      />
      <NebulaVeil
        position={[-90, -50, -750]}
        rotation={[0.1, 0.5, 0.2]}
        width={400}
        height={260}
        colorA="#0c1f42"
        colorB="#2e2050"
        seed={9}
        opacity={0.5}
      />
      <NebulaVeil
        position={[30, 40, -1150]}
        rotation={[0, 0, 0]}
        width={520}
        height={320}
        colorA="#0d2148"
        colorB="#33255c"
        seed={14}
        opacity={0.5}
      />

      {/* dust motes along the winding route */}
      <DustField count={1000} zMin={-40} zMax={-1200} spread={90} size={0.4} />
      <DustField count={400} zMin={-100} zMax={-600} spread={45} size={0.6} seed={11} />

      {/* occasional amber meteors crossing from the screen edges */}
      <MeteorField max={3} />
    </group>
  );
}
