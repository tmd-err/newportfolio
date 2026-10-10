"use client";

import { Planet, Moon, VolcanicBody } from "../props/Cosmos";

/**
 * The scattered planetary bodies — widely separated, each lit toward
 * the system star at (-95, 60, -720):
 *   terra     (-40,  14,-180) — rust rocky world, far left
 *   icy moon  ( 55, -26,-360) — pale mineral moon, low right
 *   volcanic  (-52, -34,-480) — ember world, deep low left
 *   teal      ( 16, -12,-660) — quiet ocean world, deep right
 */
export function PlanetWorld() {
  return (
    <group>
      <Planet
        position={[-40, 14, -180]}
        radius={15}
        sunDir={[-0.1, 0.08, -0.99]}
        spin={0.02}
        palette={{
          ocean: "#1a0d08",
          shallow: "#3d2014",
          low: "#7a3f24",
          high: "#a86a3f",
          ice: "#c9bfa8",
          atmos: "#c98050",
          landLevel: 0.4,
          clouds: 0.3,
        }}
      />
      <Moon
        position={[55, -26, -360]}
        radius={7.5}
        sunDir={[-0.38, 0.22, -0.9]}
        tint={[0.66, 0.64, 0.58]}
        seed={17}
        spin={0.006}
      />
      <VolcanicBody
        position={[-52, -34, -480]}
        radius={10}
        sunDir={[-0.16, 0.36, -0.92]}
        spin={0.012}
      />
      <Planet
        position={[16, -12, -660]}
        radius={7}
        sunDir={[-0.8, 0.52, -0.3]}
        seed={23}
        spin={0.015}
        palette={{
          ocean: "#061a1c",
          shallow: "#0e3436",
          low: "#1d4a44",
          high: "#2f5b52",
          ice: "#cfe0dd",
          atmos: "#3f7a7a",
          landLevel: 0.55,
          clouds: 0.5,
        }}
      />

      {/* starlight — the sun is far off upper-left */}
      <directionalLight
        position={[-95, 60, -720]}
        intensity={1.6}
        color="#e8ecdf"
      />
      <hemisphereLight args={["#161a22", "#050507", 0.5]} />
    </group>
  );
}
