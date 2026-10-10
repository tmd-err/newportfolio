"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { InteractionRig } from "./InteractionRig";
import { DeepSpaceWorld } from "./worlds/DeepSpaceWorld";
import { PlanetWorld } from "./worlds/PlanetWorld";
import { StationsWorld } from "./worlds/StationsWorld";
import { SystemWorld } from "./worlds/SystemWorld";
import { journey } from "./journey-store";

/**
 * One continuous journey through deep space:
 *   open void 0 → planetary approach -50…-215 → five project stations
 *   -250…-450 → ringed planet + system star -480…-530 → quiet drift
 *   → the luminous destination star and its accretion disc at -645.
 */
export default function ExperienceCanvas() {
  return (
    <Canvas
      dpr={journey.lowQuality ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 1200, position: [0, 0, 4] }}
      shadows={false}
      gl={{
        antialias: !journey.lowQuality,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.0;
      }}
    >
      <fog attach="fog" args={["#04060d", 80, 420]} />

      {/* procedural env map (local, no network) for metallic surfaces */}
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.5} position={[0, 8, 0]} scale={[10, 1, 10]} color="#7fa4d8" />
        <Lightformer intensity={1} position={[-6, 3, 4]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#5a7ab0" />
      </Environment>

      <CameraRig />
      <InteractionRig />

      <DeepSpaceWorld />
      <PlanetWorld />
      <StationsWorld />
      <SystemWorld />
    </Canvas>
  );
}
