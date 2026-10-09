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
  SignPanel,
  FoliageCluster,
} from "../props/Facility";

/**
 * Scene 01 — exterior approach at golden hour. The lab pavilion sits on a
 * cliff-top terrace; the megacity and river sprawl below, the sun low on
 * the horizon. Camera drifts in like a drone and enters the glass facade.
 */
export function ExteriorWorld() {
  const sun = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!sun.current || journey.reducedMotion) return;
    sun.current.position.x =
      44 + Math.sin(state.clock.elapsedTime * 0.05) * 2;
  });

  // towers rise from the city floor far below the terrace (y ≈ -18)
  const towers = useMemo(
    () =>
      [
        [30, -60, 9, 30], [42, -75, 11, 38], [55, -66, 8, 26],
        [64, -90, 12, 44], [48, -108, 9, 32], [70, -120, 10, 36],
        [34, -128, 8, 28], [56, -140, 12, 40], [78, -100, 9, 30],
        [-36, -80, 9, 26], [-48, -95, 11, 34], [-60, -110, 8, 24],
        [-42, -125, 10, 30], [86, -80, 8, 26], [-28, -140, 9, 28],
      ] as [number, number, number, number][],
    [],
  );

  return (
    <group>
      {/* ── the terrace deck the lab stands on ─────────────────── */}
      <mesh position={[0, -0.25, -52]} receiveShadow>
        <boxGeometry args={[64, 0.5, 140]} />
        <meshStandardMaterial color="#4a5160" roughness={0.7} metalness={0.25} />
      </mesh>
      {/* terrace front fascia */}
      <mesh position={[0, -1, 17.5]}>
        <boxGeometry args={[64, 1.6, 0.6]} />
        <meshStandardMaterial color="#1c2433" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* cliff face dropping to the city — east edge + front */}
      <mesh position={[33.5, -9, -50]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[4, 20, 140]} />
        <meshStandardMaterial color="#161d2b" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, -9, 19]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[70, 20, 4]} />
        <meshStandardMaterial color="#141b28" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* planted ledges on the cliff */}
      <FoliageCluster position={[31.5, -3.2, -30]} scale={1.6} />
      <FoliageCluster position={[31.5, -5.5, -55]} scale={1.3} />
      <FoliageCluster position={[31.5, -2.5, -85]} scale={1.8} />
      <FoliageCluster position={[-29, -0.2, -40]} scale={1.2} />
      <FoliageCluster position={[24, -0.2, -18]} scale={1.1} />
      <FoliageCluster position={[-24, -0.2, -14]} scale={1.4} />

      {/* path inlay strips guiding the eye to the door */}
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 26]} />
          <meshBasicMaterial color="#7dd3fc" toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* terrace edge lights */}
      {[-14, -9, -4, 4, 9, 14].map((x) => (
        <mesh key={x} position={[x, 0.35, 12]}>
          <cylinderGeometry args={[0.05, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#2a3850" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}

      {/* ── the research pavilion ──────────────────────────────── */}
      <CurtainWall position={[0, 0, -24]} width={30} height={13} doorWidth={4.4} />
      <SlidingDoors position={[0, 0, -23.8]} openRange={[0.105, 0.15]} />

      {/* dark annex slab left of the facade carrying the lab signage */}
      <mesh position={[-19.5, 6.5, -24]} castShadow receiveShadow>
        <boxGeometry args={[9, 13, 2.4]} />
        <meshStandardMaterial color="#101825" roughness={0.55} metalness={0.5} />
      </mesh>
      <SignPanel
        position={[-19.5, 7.4, -22.75]}
        title={"AI RESEARCH\n& ROBOTICS LAB"}
        lines={["Smarter systems.", "A more connected", "tomorrow.", "", "AI · Robotics", "IoT · Data Science"]}
        width={7}
      />

      {/* east wing block */}
      <mesh position={[19, 4, -28]} castShadow receiveShadow>
        <boxGeometry args={[8, 8, 10]} />
        <meshStandardMaterial color="#22304a" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* rooftop plant room + mast */}
      <mesh position={[0, 13.6, -26]} castShadow>
        <boxGeometry args={[10, 1.2, 4]} />
        <meshStandardMaterial color="#1a2433" roughness={0.55} metalness={0.6} />
      </mesh>
      <mesh position={[0, 14.5, -26]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.8} />
      </mesh>
      <FoliageCluster position={[-8, 13.4, -27]} scale={0.9} />
      <FoliageCluster position={[8, 13.4, -26]} scale={0.8} />

      {/* (ring luminaires inside are rendered by the ops floor — visible
          through the facade glass) */}

      {/* ── the city, far below ────────────────────────────────── */}
      {towers.map(([x, z, w, h], i) => (
        <CityTower
          key={i}
          position={[x, h / 2 - 18, z]}
          w={w}
          h={h}
          d={w * 0.8}
          windows={20 + (i % 3) * 8}
        />
      ))}
      {/* river threading through the towers */}
      <mesh position={[52, -17.6, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 130]} />
        <meshStandardMaterial
          color="#3a5a80"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      {/* sun glint on the river */}
      <mesh position={[46, -17.5, -90]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 70]} />
        <meshBasicMaterial color="#ffb257" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {/* bridges */}
      {[[-72], [-104]].map(([z], i) => (
        <mesh key={i} position={[52, -12.5, z]}>
          <boxGeometry args={[30, 0.5, 1.6]} />
          <meshStandardMaterial color="#2a3850" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* low sun on the horizon */}
      <mesh ref={sun} position={[44, 4, -130]}>
        <circleGeometry args={[5, 48]} />
        <meshBasicMaterial color="#ffb257" toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[44, 4, -131]}>
        <circleGeometry args={[10, 48]} />
        <meshBasicMaterial
          color="#ff9850"
          transparent
          opacity={0.35}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      {/* air traffic over the city + a patrol drone near the entrance */}
      <MaintenanceDrone center={[46, 6, -80]} radius={10} speed={0.5} />
      <MaintenanceDrone center={[60, 9, -110]} radius={12} speed={0.4} />
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
