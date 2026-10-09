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
} from "../props/Facility";

/**
 * Scene 04 — the underground nucleus. A monumental glowing core towers
 * through stacked catwalk rings; the camera stays low, looking up.
 * Chamber floor at y=-14, core apex near y=+16.
 */
export function NucleusWorld() {
  const rings = useRef<THREE.Group>(null);
  const coreGlow = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (rings.current) rings.current.rotation.y = t * 0.04;
    if (coreGlow.current) {
      coreGlow.current.opacity = 0.75 + Math.sin(t * 1.3) * 0.15;
    }
  });

  const segments = useMemo(
    () =>
      [
        { y: -10, r: 2.6, h: 4 },
        { y: -6.6, r: 2.2, h: 2.4 },
        { y: -3.8, r: 2.5, h: 2.8 },
        { y: -0.6, r: 2.0, h: 3.2 },
        { y: 2.8, r: 2.3, h: 3.2 },
        { y: 6.4, r: 1.8, h: 3.6 },
        { y: 10.4, r: 2.1, h: 4 },
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
      <mesh position={[0, -14.25, -200]} receiveShadow>
        <cylinderGeometry args={[26, 26, 0.5, 40]} />
        <meshStandardMaterial color="#101a2c" roughness={0.5} metalness={0.55} />
      </mesh>
      {/* perimeter wall panels */}
      {[...Array(12)].map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        const x = Math.cos(a) * 24.5;
        const z = -200 + Math.sin(a) * 24.5;
        return (
          <group key={i} position={[x, -2, z]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[12, 24, 0.8]} />
              <meshStandardMaterial
                color={i % 2 ? "#16202f" : "#1a2739"}
                roughness={0.7}
                metalness={0.4}
              />
            </mesh>
            {/* vertical accent strips */}
            {[-5, 5].map((x2) => (
              <mesh key={x2} position={[x2, 0, 0.45]}>
                <boxGeometry args={[0.12, 20, 0.06]} />
                <meshBasicMaterial color="#2a4a78" toneMapped={false} transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* ceiling */}
      <mesh position={[0, 17.5, -200]}>
        <cylinderGeometry args={[26, 26, 0.6, 40]} />
        <meshStandardMaterial color="#0d1626" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* ── the nucleus core ───────────────────────────────────── */}
      <group position={[0, 0, -202]}>
        {segments.map((s, i) => (
          <group key={i}>
            <mesh position={[0, s.y, 0]} castShadow>
              <cylinderGeometry args={[s.r, s.r * 1.04, s.h, 24]} />
              <meshStandardMaterial
                color="#1c2a42"
                roughness={0.35}
                metalness={0.8}
              />
            </mesh>
            {/* glowing band between segments */}
            <mesh position={[0, s.y + s.h / 2, 0]}>
              <cylinderGeometry args={[s.r + 0.06, s.r + 0.06, 0.18, 24, 1, true]} />
              <meshBasicMaterial
                ref={i === 3 ? coreGlow : undefined}
                color="#7dd3fc"
                toneMapped={false}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
        {/* apex crystal */}
        <mesh position={[0, 13.2, 0]}>
          <octahedronGeometry args={[1.1]} />
          <meshStandardMaterial
            color="#aee6ff"
            emissive="#7dd3fc"
            emissiveIntensity={1.6}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>
        {/* base machinery collar */}
        <mesh position={[0, -13.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[4.4, 5.2, 1.6, 24]} />
          <meshStandardMaterial color="#1c2a42" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* radial struts to the floor */}
        {struts.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * 3.6, -13.4, Math.sin(a) * 3.6]}
            rotation={[0, 0, Math.cos(a) * 0.5]}
          >
            <boxGeometry args={[0.3, 1.4, 0.6]} />
            <meshStandardMaterial color="#22304a" roughness={0.5} metalness={0.7} />
          </mesh>
        ))}
        {/* vertical light shaft through the core */}
        <LightShaft position={[0, 0, 0]} radius={3.4} height={30} opacity={0.07} />
        <LightShaft position={[0, 6, 0]} radius={5.5} height={18} color="#9ed4ff" opacity={0.05} />
      </group>

      {/* ── catwalk rings at stacked heights ───────────────────── */}
      <group ref={rings} position={[0, 0, -202]}>
        <CatwalkRing position={[0, -8, 0]} radius={8.5} tube={0.9} />
        <CatwalkRing position={[0, -2.5, 0]} radius={10.5} tube={0.9} />
        <CatwalkRing position={[0, 4, 0]} radius={9} tube={0.9} />
        <CatwalkRing position={[0, 9.5, 0]} radius={11.5} tube={0.9} />
      </group>
      {/* ring support struts to the wall (non-rotating) */}
      {struts.slice(0, 6).map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 16, -6 + (i % 3) * 6, -202 + Math.sin(a) * 16]}
          rotation={[0, -a, 0.55]}
        >
          <boxGeometry args={[0.4, 0.4, 12]} />
          <meshStandardMaterial color="#22304a" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}

      {/* silhouettes on the rings — scale cue */}
      <Silhouette position={[8.4, -7.55, -202]} rotationY={-Math.PI / 2} />
      <Silhouette position={[-9.8, -2.05, -198]} rotationY={1.2} />
      <Silhouette position={[3, 4.45, -210.5]} rotationY={0.4} />
      <Silhouette position={[0, -13.7, -196]} rotationY={Math.PI} />

      {/* monitor arrays on the perimeter */}
      <MonitorWall position={[-18, -6, -196]} rotationY={Math.PI / 2.6} cols={3} rows={2} />
      <MonitorWall position={[18.5, -4, -204]} rotationY={-Math.PI / 2.4} cols={3} rows={2} accent="#34d399" />
      <MonitorWall position={[-16, 2, -208]} rotationY={Math.PI / 2.2} cols={3} rows={2} accent="#a78bfa" />

      {/* a drone circling the core */}
      <MaintenanceDrone center={[0, -2, -202]} radius={12} speed={0.22} />

      {/* lighting — the core is the light */}
      <pointLight color="#7dd3fc" intensity={60} distance={60} position={[0, 2, -202]} />
      <pointLight color="#4a90e0" intensity={24} distance={40} position={[0, -8, -190]} />
      <pointLight color="#9ed4ff" intensity={18} distance={50} position={[0, 12, -202]} />
      <directionalLight
        position={[-10, -2, -175]}
        intensity={0.5}
        color="#bcd8ff"
      />
      <hemisphereLight args={["#1c3050", "#050a14", 0.45]} />
    </group>
  );
}
