"use client";

import { StarGlow, RingSystem, AccretionDisc } from "../props/Cosmos";

/**
 * Acts IV–VI — the stellar system and the final destination.
 * A small ringed planet hangs beneath the distant system star; the
 * journey ends facing a luminous star wrapped in a slow accretion disc.
 */
export function SystemWorld() {
  return (
    <group>
      {/* the ringed planet — a cool gas giant */}
      <mesh position={[-26, 14, -480]}>
        <sphereGeometry args={[14, 48, 48]} />
        <meshStandardMaterial color="#2e3f5e" roughness={0.65} metalness={0.25} />
      </mesh>
      {/* banding hint — a darker equatorial ring shadow on the body */}
      <mesh position={[-26, 14, -480]} scale={[1.02, 0.72, 1.02]}>
        <sphereGeometry args={[14, 48, 48]} />
        <meshStandardMaterial color="#1d2a44" roughness={0.7} transparent opacity={0.35} />
      </mesh>
      <RingSystem
        position={[-26, 14, -480]}
        inner={20}
        outer={40}
        tilt={[1.2, 0.1, 0.2]}
        tint="#8fa5c8"
      />

      {/* the distant system star — the scene's sun */}
      <StarGlow
        position={[-50, 30, -530]}
        coreRadius={3.5}
        glowScale={55}
        color="#d8ecff"
        intensity={2.5}
      />

      {/* ── the destination: a luminous star and its disc ───────── */}
      <StarGlow
        position={[0, -2, -645]}
        coreRadius={5}
        glowScale={90}
        color="#e8f2ff"
        intensity={4}
      />
      <AccretionDisc
        position={[0, -2, -645]}
        inner={9}
        outer={46}
        tilt={[1.12, 0, 0.1]}
      />

      {/* sparse ambient fill — space stays dark */}
      <hemisphereLight args={["#141d33", "#020309", 0.4]} />
    </group>
  );
}
