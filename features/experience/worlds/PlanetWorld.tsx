"use client";

import { Planet, Moon, GasGiant, AsteroidBelt, StarGlow } from "../props/Cosmos";

/**
 * The inner Solar System — Mercury, Venus, Earth, Mars, plus the Sun
 * and the asteroid belt the route crosses before Jupiter.
 * The Sun sits at (-180,100,-250); every sunDir points toward it.
 */
export function PlanetWorld() {
  return (
    <group>
      {/* the Sun — warm light source, upper-left of the open */}
      <StarGlow
        position={[-180, 100, -250]}
        coreRadius={9}
        glowScale={150}
        color="#ffd9a0"
        intensity={4}
      />

      {/* Mercury — small cratered grey world */}
      <Moon
        position={[-30, 6, -120]}
        radius={3}
        sunDir={[-0.68, 0.43, -0.59]}
        tint={[0.45, 0.43, 0.4]}
        seed={5}
        spin={0.01}
      />

      {/* Venus — creamy opaque cloud-top */}
      <GasGiant
        position={[28, -10, -240]}
        radius={5}
        sunDir={[-0.88, 0.47, -0.04]}
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

      {/* Earth — blue oceans, green-tan continents, white caps */}
      <Planet
        position={[-32, 10, -380]}
        radius={6.5}
        sunDir={[-0.68, 0.41, 0.6]}
        seed={3}
        spin={0.02}
        palette={{
          ocean: "#0b2d4f",
          shallow: "#1b5a7a",
          low: "#2d5a33",
          high: "#8a7a5c",
          ice: "#dfe8f0",
          atmos: "#4f8fd0",
          landLevel: 0.51,
          clouds: 0.7,
        }}
      />

      {/* Mars — rust terrain, dark regions, pale polar caps */}
      <Planet
        position={[30, -14, -500]}
        radius={4}
        sunDir={[-0.61, 0.33, 0.72]}
        seed={9}
        spin={0.02}
        palette={{
          ocean: "#2a140e",
          shallow: "#4a2418",
          low: "#8a4526",
          high: "#b06a3e",
          ice: "#d8cfc0",
          atmos: "#c98050",
          landLevel: 0.38,
          clouds: 0.25,
        }}
      />

      {/* the belt — sparse rubble slab between Mars and Jupiter */}
      <AsteroidBelt center={[0, -5, -575]} count={160} spread={[110, 14, 55]} />

      {/* sunlight */}
      <directionalLight position={[-180, 100, -250]} intensity={1.7} color="#f2ecd9" />
      <hemisphereLight args={["#161a22", "#050507", 0.45]} />
    </group>
  );
}
