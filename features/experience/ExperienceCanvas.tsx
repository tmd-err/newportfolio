"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { InteractionRig } from "./InteractionRig";
import { ExteriorWorld } from "./worlds/ExteriorWorld";
import { OpsFloorWorld } from "./worlds/OpsFloorWorld";
import { DescentWorld } from "./worlds/DescentWorld";
import { NucleusWorld } from "./worlds/NucleusWorld";
import { journey } from "./journey-store";

/**
 * One continuous journey through an AI research facility:
 *   plaza approach 0 → glass facade -24 → ops floor -30…-118
 *   → stairwell descent -120…-162 → nucleus chamber -170…-235 (y≈-14)
 */
export default function ExperienceCanvas() {
  return (
    <Canvas
      dpr={journey.lowQuality ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 500, position: [16, 7.5, 26] }}
      shadows={!journey.lowQuality}
      gl={{
        antialias: !journey.lowQuality,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.0;
      }}
    >
      <fog attach="fog" args={["#eec39c", 16, 130]} />

      {/* procedural env map (local, no network) for metal/glass reflections */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2} position={[0, 8, 0]} scale={[10, 1, 10]} color="#dceaff" />
        <Lightformer intensity={1.2} position={[-6, 3, 4]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#7dd3fc" />
        <Lightformer intensity={0.8} position={[6, 2, 4]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#9cc8ff" />
      </Environment>

      {/* base fill — worlds add their own key/accent lights */}
      <hemisphereLight args={["#2a3c5c", "#0a0f1a", 0.35]} />

      <CameraRig />
      <InteractionRig />

      <ExteriorWorld />
      <OpsFloorWorld />
      <DescentWorld />
      <NucleusWorld />
    </Canvas>
  );
}
