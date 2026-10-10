"use client";

import { GasGiant, RingSystem, BlackHole } from "../props/Cosmos";

/**
 * The outer Solar System and the finale — Jupiter, Saturn, Uranus,
 * Neptune, then the black hole at the end of the journey.
 * Sun direction is toward (-180,100,-250) — the giants read as
 * crescents from the deep, lit from the inner system.
 */
export function SystemWorld() {
  return (
    <group>
      {/* Jupiter — the giant, Great Red Spot included */}
      <GasGiant
        position={[-42, 18, -680]}
        radius={14}
        sunDir={[-0.3, 0.18, 0.94]}
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

      {/* Saturn — pale gold with its rings */}
      <GasGiant
        position={[40, 22, -840]}
        radius={11}
        sunDir={[-0.35, 0.12, 0.93]}
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
        position={[40, 22, -840]}
        inner={14.5}
        outer={28}
        tilt={[1.35, 0.12, 0.28]}
        tint="#c2b490"
      />

      {/* Uranus — pale cyan ice giant, almost featureless */}
      <GasGiant
        position={[-30, -18, -980]}
        radius={7}
        sunDir={[-0.2, 0.16, 0.97]}
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

      {/* Neptune — deep blue with a dark storm */}
      <GasGiant
        position={[24, -8, -1100]}
        radius={7}
        sunDir={[-0.23, 0.12, 0.96]}
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

      {/* ── the destination: the black hole ─────────────────────── */}
      <BlackHole position={[0, 10, -1280]} radius={7} />

      {/* sparse ambient fill — deep space stays dark */}
      <hemisphereLight args={["#14171f", "#040405", 0.35]} />
    </group>
  );
}
