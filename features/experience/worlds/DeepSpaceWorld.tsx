"use client";

import { Starfield, NebulaVeil, SpiralGalaxy, DustField } from "../props/Cosmos";

/**
 * Act I — deep space. Layered starfields at different scales and depths,
 * enormous fbm nebula veils in restrained midnight/indigo tones, a slow
 * distant galaxy, and faint dust drifting through the travel corridor.
 */
export function DeepSpaceWorld() {
  return (
    <group>
      {/* star depth layers — different scales, densities, distances */}
      <Starfield count={2600} radius={420} zMin={-720} zMax={-100} size={1.9} seed={1} />
      <Starfield count={1800} radius={300} zMin={-500} zMax={-20} size={1.3} seed={7} />
      <Starfield count={900} radius={200} zMin={-350} zMax={20} size={0.9} seed={13} />

      {/* nebula veils — few, vast, restrained */}
      <NebulaVeil
        position={[-90, 26, -340]}
        rotation={[0, 0.3, 0.15]}
        width={380}
        height={230}
        colorA="#0b1c3c"
        colorB="#241b48"
        seed={2}
        opacity={0.5}
      />
      <NebulaVeil
        position={[70, -30, -420]}
        rotation={[0, -0.4, -0.1]}
        width={320}
        height={200}
        colorA="#0a1633"
        colorB="#1d2850"
        seed={5}
        opacity={0.4}
      />
      <NebulaVeil
        position={[-50, 40, -600]}
        rotation={[0.1, 0.5, 0.2]}
        width={400}
        height={260}
        colorA="#0c1f42"
        colorB="#2e2050"
        seed={9}
        opacity={0.55}
      />
      <NebulaVeil
        position={[10, 14, -760]}
        rotation={[0, 0, 0]}
        width={500}
        height={320}
        colorA="#0d2148"
        colorB="#33255c"
        seed={14}
        opacity={0.5}
      />

      {/* a distant spiral galaxy — visible from the opening moments */}
      <SpiralGalaxy
        position={[-95, 62, -560]}
        rotation={[0.95, 0.15, 0.4]}
        radius={52}
      />

      {/* dust motes in the corridor the camera flies through */}
      <DustField count={1000} zMin={-40} zMax={-680} spread={70} size={0.4} />
      <DustField count={400} zMin={-100} zMax={-400} spread={35} size={0.6} seed={11} />
    </group>
  );
}
