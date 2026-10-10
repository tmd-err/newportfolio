"use client";

import { StarGlow, RingSystem, AccretionDisc, GasGiant } from "../props/Cosmos";

/**
 * The deep system — the ringed giant high right, the lighting star far
 * upper-left, and the final destination: a luminous star wrapped in a
 * slow accretion disc at the end of the journey.
 */
export function SystemWorld() {
  return (
    <group>
      {/* the ringed gas giant — high right, terminator-lit */}
      <GasGiant position={[42, 34, -620]} radius={16} sunDir={[-0.79, 0.15, -0.58]} spin={0.03} />
      <RingSystem
        position={[42, 34, -620]}
        inner={22}
        outer={46}
        tilt={[1.25, 0.15, 0.35]}
        tint="#a89a7c"
      />

      {/* the system star — the scene's sun, far upper-left */}
      <StarGlow
        position={[-95, 60, -720]}
        coreRadius={3.5}
        glowScale={55}
        color="#e8ecdf"
        intensity={2.5}
      />

      {/* ── the destination: a luminous star and its disc ───────── */}
      <StarGlow
        position={[0, 12, -830]}
        coreRadius={5}
        glowScale={90}
        color="#efe9da"
        intensity={4}
      />
      <AccretionDisc
        position={[0, 12, -830]}
        inner={9}
        outer={46}
        tilt={[1.12, 0, 0.15]}
      />

      {/* sparse ambient fill — space stays dark */}
      <hemisphereLight args={["#14171f", "#040405", 0.4]} />
    </group>
  );
}
