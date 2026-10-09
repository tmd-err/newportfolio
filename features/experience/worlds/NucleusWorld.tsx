"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../journey-store";
import {
  CatwalkRing,
  LightShaft,
  MonitorWall,
  Silhouette,
  MaintenanceDrone,
  DisplayRing,
  RockWall,
} from "../props/Facility";

/**
 * Scene 04 — the underground AI nucleus (reference: 3d_image_the_last_vision).
 * The camera stays near the chamber floor looking UP a towering glass core:
 * a bright central column, stacked metal collars, a band of displays
 * ringing the core, catwalk levels, rock cavern walls.
 * Chamber floor at y=-14, core apex near y=+16, center z=-198.
 */
const CENTER: [number, number] = [0, -198];

export function NucleusWorld() {
  const rings = useRef<THREE.Group>(null);
  const coreGlow = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (rings.current) rings.current.rotation.y = t * 0.04;
    if (coreGlow.current) {
      coreGlow.current.opacity = 0.8 + Math.sin(t * 1.3) * 0.15;
    }
  });

  // metal collar segments stacked along the glass core
  const collars = useMemo(
    () =>
      [
        { y: -11.5, r: 5.2, h: 1.6 },
        { y: -7.5, r: 4.8, h: 1.1 },
        { y: -3, r: 5.0, h: 1.3 },
        { y: 1.5, r: 4.7, h: 1.0 },
        { y: 6, r: 5.0, h: 1.4 },
        { y: 10, r: 4.6, h: 1.1 },
        { y: 13, r: 4.9, h: 1.5 },
      ] as const,
    [],
  );

  const struts = useMemo(
    () => [...Array(8)].map((_, i) => (i * Math.PI * 2) / 8),
    [],
  );

  return (
    <group>
      {/* ── chamber shell ──────────────────────────────────────── */}
      <mesh position={[CENTER[0], -14.25, CENTER[1]]} receiveShadow>
        <cylinderGeometry args={[28, 28, 0.5, 40]} />
        <meshStandardMaterial color="#101a2c" roughness={0.5} metalness={0.55} />
      </mesh>
      {/* perimeter: wall panels alternating with rock faces */}
      {[...Array(14)].map((_, i) => {
        const a = (i * Math.PI * 2) / 14;
        const x = CENTER[0] + Math.cos(a) * 24.5;
        const z = CENTER[1] + Math.sin(a) * 24.5;
        return i % 2 === 0 ? (
          <RockWall key={i} position={[x, -2, z]} rotationY={-a - Math.PI / 2} w={11} h={26} />
        ) : (
          <group key={i} position={[x, -2, z]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[11, 26, 0.8]} />
              <meshStandardMaterial color="#1a2739" roughness={0.7} metalness={0.4} />
            </mesh>
            {[-4.5, 4.5].map((x2) => (
              <mesh key={x2} position={[x2, 0, 0.45]}>
                <boxGeometry args={[0.12, 22, 0.06]} />
                <meshBasicMaterial color="#2a4a78" toneMapped={false} transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* ceiling */}
      <mesh position={[CENTER[0], 17.5, CENTER[1]]}>
        <cylinderGeometry args={[28, 28, 0.6, 40]} />
        <meshStandardMaterial color="#0d1626" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* ── the nucleus core ───────────────────────────────────── */}
      <group position={[CENTER[0], 0, CENTER[1]]}>
        {/* glass shell */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[4.4, 4.6, 27, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#8fc8ee"
            transparent
            opacity={0.13}
            roughness={0.04}
            metalness={0.15}
            envMapIntensity={1.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* the glowing central column inside the glass */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.3, 1.5, 27, 20]} />
          <meshBasicMaterial
            ref={coreGlow}
            color="#9fdcff"
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* halo shaft */}
        <LightShaft position={[0, 0.5, 0]} radius={3.6} height={28} opacity={0.08} />
        <LightShaft position={[0, 4, 0]} radius={6} height={20} color="#9ed4ff" opacity={0.05} />
        {/* stacked collars */}
        {collars.map((s, i) => (
          <group key={i}>
            <mesh position={[0, s.y, 0]} castShadow>
              <cylinderGeometry args={[s.r, s.r, s.h, 28]} />
              <meshStandardMaterial color="#1c2a42" roughness={0.35} metalness={0.8} />
            </mesh>
            {/* glowing rim on each collar */}
            <mesh position={[0, s.y - s.h / 2 + 0.06, 0]}>
              <torusGeometry args={[s.r, 0.05, 8, 40]} />
              <meshBasicMaterial color="#7dd3fc" toneMapped={false} transparent opacity={0.85} />
            </mesh>
          </group>
        ))}
        {/* apex vanishing beam */}
        <mesh position={[0, 15.5, 0]}>
          <cylinderGeometry args={[0.5, 1.1, 5, 16]} />
          <meshBasicMaterial color="#bfe8ff" toneMapped={false} transparent opacity={0.7} />
        </mesh>
        {/* base machinery collar + radial struts */}
        <mesh position={[0, -13.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[5.6, 6.4, 1.6, 28]} />
          <meshStandardMaterial color="#1c2a42" roughness={0.4} metalness={0.7} />
        </mesh>
        {struts.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * 4.6, -13.4, Math.sin(a) * 4.6]}
            rotation={[0, 0, Math.cos(a) * 0.5]}
          >
            <boxGeometry args={[0.3, 1.4, 0.6]} />
            <meshStandardMaterial color="#22304a" roughness={0.5} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── the display band ringing the core (the last vision) ── */}
      <DisplayRing position={[CENTER[0], -3.2, CENTER[1]]} radius={8.6} count={22} />

      {/* ── catwalk rings at stacked heights ───────────────────── */}
      <group ref={rings} position={[CENTER[0], 0, CENTER[1]]}>
        <CatwalkRing position={[0, -8, 0]} radius={9.5} tube={0.9} />
        <CatwalkRing position={[0, -1.5, 0]} radius={11} tube={0.9} />
        <CatwalkRing position={[0, 4.5, 0]} radius={9.5} tube={0.9} />
        <CatwalkRing position={[0, 10, 0]} radius={12} tube={0.9} />
      </group>
      {/* ring support struts to the wall (non-rotating) */}
      {struts.slice(0, 6).map((a, i) => (
        <mesh
          key={i}
          position={[
            CENTER[0] + Math.cos(a) * 16,
            -6 + (i % 3) * 6,
            CENTER[1] + Math.sin(a) * 16,
          ]}
          rotation={[0, -a, 0.55]}
        >
          <boxGeometry args={[0.4, 0.4, 12]} />
          <meshStandardMaterial color="#22304a" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}

      {/* silhouettes — the scale cue */}
      <Silhouette position={[9.4, -7.55, CENTER[1]]} rotationY={-Math.PI / 2} />
      <Silhouette position={[-10.3, -1.05, CENTER[1] + 4]} rotationY={1.2} />
      <Silhouette position={[3, 4.95, CENTER[1] - 9]} rotationY={0.4} />
      <Silhouette position={[0, -13.7, CENTER[1] + 8]} rotationY={Math.PI} />

      {/* monitor arrays on the perimeter */}
      <MonitorWall position={[-18, -6, CENTER[1] + 6]} rotationY={Math.PI / 2.6} cols={3} rows={2} />
      <MonitorWall position={[18.5, -4, CENTER[1] - 4]} rotationY={-Math.PI / 2.4} cols={3} rows={2} accent="#34d399" />
      <MonitorWall position={[-16, 2, CENTER[1] - 8]} rotationY={Math.PI / 2.2} cols={3} rows={2} accent="#a78bfa" />

      {/* a drone circling the core */}
      <MaintenanceDrone center={[CENTER[0], -2, CENTER[1]]} radius={13} speed={0.22} />

      {/* lighting — the core is the light */}
      <pointLight color="#7dd3fc" intensity={70} distance={70} position={[CENTER[0], 2, CENTER[1]]} />
      <pointLight color="#4a90e0" intensity={26} distance={40} position={[CENTER[0], -8, CENTER[1] + 10]} />
      <pointLight color="#9ed4ff" intensity={20} distance={50} position={[CENTER[0], 12, CENTER[1]]} />
      <directionalLight
        position={[-10, -2, CENTER[1] + 25]}
        intensity={0.5}
        color="#bcd8ff"
      />
      <hemisphereLight args={["#1c3050", "#050a14", 0.45]} />
    </group>
  );
}
