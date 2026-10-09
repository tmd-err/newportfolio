"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../journey-store";
import {
  CurtainWall,
  SlidingDoors,
  CityTower,
  MaintenanceDrone,
} from "../props/Facility";

/**
 * Scene 01 — exterior approach at golden hour. The camera drifts across
 * the plaza toward a glass research tower; city silhouettes rise behind.
 */
export function ExteriorWorld() {
  const sun = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!sun.current || journey.reducedMotion) return;
    sun.current.position.x =
      34 + Math.sin(state.clock.elapsedTime * 0.05) * 2;
  });

  const towers = useMemo(
    () =>
      [
        [-38, -52, 8, 26], [-28, -60, 10, 34], [-16, -70, 7, 22],
        [-6, -66, 12, 40], [7, -72, 9, 30], [18, -62, 11, 36],
        [30, -55, 8, 24], [42, -62, 10, 32], [52, -48, 9, 20],
        [-48, -64, 9, 30], [-58, -52, 8, 24],
      ] as [number, number, number, number][],
    [],
  );

  return (
    <group>
      {/* plaza — brushed concrete with light inlays */}
      <mesh position={[0, -0.25, -4]} receiveShadow>
        <boxGeometry args={[70, 0.5, 70]} />
        <meshStandardMaterial color="#565d6e" roughness={0.7} metalness={0.25} />
      </mesh>
      {/* path inlay strips guiding the eye to the door */}
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 26]} />
          <meshBasicMaterial color="#7dd3fc" toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* plaza edge lights */}
      {[-14, -9, -4, 4, 9, 14].map((x) => (
        <mesh key={x} position={[x, 0.35, 6]}>
          <cylinderGeometry args={[0.05, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#2a3850" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}

      {/* the research building */}
      <CurtainWall position={[0, 0, -24]} width={30} height={13} doorWidth={4.4} />
      <SlidingDoors position={[0, 0, -23.8]} openRange={[0.105, 0.15]} />

      {/* building wings */}
      {[-19, 19].map((x) => (
        <mesh key={x} position={[x, 4, -28]} castShadow receiveShadow>
          <boxGeometry args={[8, 8, 10]} />
          <meshStandardMaterial color="#22304a" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {/* rooftop detail */}
      <mesh position={[0, 13.6, -26]} castShadow>
        <boxGeometry args={[10, 1.2, 4]} />
        <meshStandardMaterial color="#1a2433" roughness={0.55} metalness={0.6} />
      </mesh>
      <mesh position={[0, 14.5, -26]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.8} />
      </mesh>

      {/* city skyline behind the facility */}
      {towers.map(([x, z, w, h], i) => (
        <CityTower
          key={i}
          position={[x, h / 2, z]}
          w={w}
          h={h}
          d={w * 0.8}
          windows={20 + (i % 3) * 8}
        />
      ))}

      {/* low sun on the horizon */}
      <mesh ref={sun} position={[34, 7, -85]}>
        <circleGeometry args={[5, 48]} />
        <meshBasicMaterial color="#ffb257" toneMapped={false} fog={false} />
      </mesh>
      {/* sun halo */}
      <mesh position={[34, 7, -86]}>
        <circleGeometry args={[9, 48]} />
        <meshBasicMaterial
          color="#ff9850"
          transparent
          opacity={0.35}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      {/* patrol drone crossing the plaza */}
      <MaintenanceDrone center={[2, 5, -10]} radius={7} speed={0.35} />

      {/* warm key light — the setting sun */}
      <directionalLight
        position={[26, 12, 14]}
        intensity={2.2}
        color="#ffcf9e"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-near={2}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-10, 6, -40]} intensity={0.5} color="#7ea4d8" />
      <pointLight color="#7dd3fc" intensity={10} distance={18} position={[0, 3, -22]} />
    </group>
  );
}
