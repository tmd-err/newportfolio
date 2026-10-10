"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { InteractionRig } from "./InteractionRig";
import { BirthSequence } from "./BirthSequence";
import { DeepSpaceWorld } from "./worlds/DeepSpaceWorld";
import { PlanetWorld } from "./worlds/PlanetWorld";
import { StationsWorld } from "./worlds/StationsWorld";
import { SystemWorld } from "./worlds/SystemWorld";
import { journey } from "./journey-store";

/**
 * One continuous journey through a scattered universe:
 *   open void 0 → rust planet -180 → icy moon -360 → volcanic -480
 *   → teal world -640 / ringed giant -620 → luminous star + disc -830.
 * Destinations sit far apart in every axis; the camera travels between
 * them rather than zooming a centered object.
 */
export default function ExperienceCanvas() {
  return (
    <Canvas
      dpr={journey.lowQuality ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 1700, position: [0, 0, 4] }}
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
      <fog attach="fog" args={["#08090c", 200, 1400]} />

      {/* procedural env map (local, no network) for metallic surfaces */}
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.5} position={[0, 8, 0]} scale={[10, 1, 10]} color="#7fa4d8" />
        <Lightformer intensity={1} position={[-6, 3, 4]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#5a7ab0" />
      </Environment>

      <CameraRig />
      <InteractionRig />
      <BirthSequence />

      <DeepSpaceWorld />
      <PlanetWorld />
      <StationsWorld />
      <SystemWorld />
    </Canvas>
  );
}
