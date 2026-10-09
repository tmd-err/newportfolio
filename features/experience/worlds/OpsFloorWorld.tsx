"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { journey } from "../journey-store";
import {
  ServerRack,
  ProjectBay,
  HumanoidRobot,
  MonitorWall,
  LightShaft,
  GlassCylinder,
  SignPanel,
  RingLight,
  CityTower,
  FeedMonitor,
} from "../props/Facility";
import { featuredProjects } from "@/data/projects";

/**
 * Scene 02 — the AI research lab interior (reference: 3d_image_labo).
 * Bright daylight: floor-to-ceiling glass on the east wall looking over
 * the city, a mezzanine gallery, a humanoid robot in a glass display
 * cylinder, workstation bays, and a corridor to the descent.
 */
export function OpsFloorWorld() {
  // a single row of racks beneath the mezzanine on the west side
  const racks = useMemo(() => {
    const list: { x: number; z: number; r: number }[] = [];
    for (let z = -46; z > -104; z -= 6) {
      list.push({ x: -13.5, z, r: 0.12 });
    }
    return list;
  }, []);

  // towers visible through the east glass wall (city below the cliff)
  const skyline = useMemo(
    () =>
      [
        [30, -40, 9, 30], [38, -58, 11, 38], [48, -46, 8, 26],
        [56, -70, 12, 42], [44, -86, 9, 30], [62, -98, 10, 34],
        [36, -102, 8, 26], [52, -112, 11, 36],
      ] as [number, number, number, number][],
    [],
  );

  // bay positions match CAMERA_KEYS look targets
  const bays: Record<string, [number, number, number, number]> = {
    edtech: [8, 0, -62, -0.45],
    crafthub: [-8, 0, -74, 0.45],
    velora: [8, 0, -86, -0.45],
    autotrack: [-8, 0, -98, 0.45],
    facedetector: [0, 0, -112, 0],
  };

  return (
    <group>
      {/* ── reflective dark floor ──────────────────────────────── */}
      <mesh position={[0, 0, -74]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 96]} />
        {journey.lowQuality ? (
          <meshStandardMaterial color="#141c2a" roughness={0.35} metalness={0.6} />
        ) : (
          <MeshReflectorMaterial
            blur={[280, 90]}
            resolution={1024}
            mixBlur={0.9}
            mixStrength={10}
            roughness={0.85}
            depthScale={0.6}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#141c2a"
            metalness={0.45}
            mirror={0.55}
          />
        )}
      </mesh>

      {/* ── east wall: floor-to-ceiling glass over the city ────── */}
      <mesh position={[20, 4, -74]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[96, 8]} />
        <meshPhysicalMaterial
          color="#a8d0ec"
          transparent
          opacity={0.12}
          roughness={0.03}
          metalness={0.1}
          envMapIntensity={1.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* glass mullions */}
      {[...Array(17)].map((_, i) => (
        <mesh key={i} position={[20, 4, -30 - i * 5.5]}>
          <boxGeometry args={[0.18, 8, 0.18]} />
          <meshStandardMaterial color="#3a4654" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {/* city panorama outside */}
      {skyline.map(([x, z, w, h], i) => (
        <CityTower
          key={i}
          position={[x, h / 2 - 16, z]}
          w={w}
          h={h}
          d={w * 0.8}
          windows={16}
        />
      ))}

      {/* ── west wall: dark, signage + monitor walls ───────────── */}
      <mesh position={[-20, 4, -74]} receiveShadow>
        <boxGeometry args={[0.6, 8, 96]} />
        <meshStandardMaterial color="#232e40" roughness={0.7} metalness={0.4} />
      </mesh>
      <SignPanel
        position={[-19.6, 3.6, -36]}
        rotationY={Math.PI / 2}
        title={"AI RESEARCH LAB"}
        lines={[
          "Building a smarter tomorrow.",
          "",
          "Computer Vision",
          "Machine Learning",
          "Robotics",
          "IoT & Edge AI",
          "Human–AI Interaction",
        ]}
        width={6.5}
      />
      <MonitorWall position={[-19.6, 3.4, -62]} rotationY={Math.PI / 2} />
      <MonitorWall position={[-19.6, 3.4, -88]} rotationY={Math.PI / 2} accent="#34d399" />

      {/* ── mezzanine gallery along the west wall ──────────────── */}
      <group>
        <mesh position={[-14.5, 4.3, -66]} receiveShadow castShadow>
          <boxGeometry args={[11, 0.4, 64]} />
          <meshStandardMaterial color="#3c4656" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* glass railing on the open edge */}
        <mesh position={[-9.1, 5.05, -66]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[64, 1.1]} />
          <meshPhysicalMaterial
            color="#9cc4e4"
            transparent
            opacity={0.16}
            roughness={0.05}
            metalness={0.1}
            envMapIntensity={1.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-9.1, 5.6, -66]}>
          <boxGeometry args={[0.06, 0.06, 64]} />
          <meshStandardMaterial color="#5a7aa0" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* support columns */}
        {[-40, -58, -76, -94].map((z) => (
          <mesh key={z} position={[-10, 2.15, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 4.3, 10]} />
            <meshStandardMaterial color="#4a5568" roughness={0.45} metalness={0.7} />
          </mesh>
        ))}
        {/* people + desks up there (scale cue) */}
        <HumanoidRobot position={[-15, 4.5, -50]} rotationY={1.2} />
        <HumanoidRobot position={[-13, 4.5, -80]} rotationY={0.6} />
      </group>

      {/* ── ceiling + strip lighting ───────────────────────────── */}
      <mesh position={[0, 7.2, -74]}>
        <boxGeometry args={[44, 0.5, 96]} />
        <meshStandardMaterial color="#7c8798" roughness={0.8} metalness={0.25} />
      </mesh>
      {[-36, -48, -60, -72, -84, -96, -108].map((z) => (
        <group key={z}>
          <mesh position={[0, 6.9, z]}>
            <boxGeometry args={[10, 0.12, 3.4]} />
            <meshBasicMaterial color="#eef4ff" toneMapped={false} />
          </mesh>
          <mesh position={[0, 6.7, z]}>
            <boxGeometry args={[36, 0.18, 0.3]} />
            <meshStandardMaterial color="#3a4654" roughness={0.5} metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* hanging ring luminaires (seen in the exterior shot) */}
      <RingLight position={[-4, 4.6, -30]} radius={1.8} />
      <RingLight position={[3.5, 4.8, -40]} radius={2.2} />
      <RingLight position={[0, 4.7, -64]} radius={2.6} />
      {/* subtle light shafts from ceiling panels */}
      {[-48, -72, -96].map((z) => (
        <LightShaft
          key={z}
          position={[0, 3.6, z]}
          radius={3.4}
          height={6.6}
          opacity={0.04}
        />
      ))}

      {/* ── server row beneath the mezzanine ───────────────────── */}
      {racks.map((r, i) => (
        <ServerRack
          key={i}
          position={[r.x, 0, r.z]}
          rotationY={r.r}
          accent={i % 4 === 0 ? "#34d399" : "#38bdf8"}
        />
      ))}

      {/* ── the five project bays ──────────────────────────────── */}
      {featuredProjects.map((p) => {
        const [x, y, z, r] = bays[p.slug] ?? [0, 0, -60, 0];
        return (
          <ProjectBay
            key={p.slug}
            project={p}
            position={[x, y, z]}
            rotationY={r}
          />
        );
      })}

      {/* humanoid in a glass display cylinder — the lab centerpiece */}
      <GlassCylinder position={[-7, 0, -40]} radius={2.1} height={6.2} />
      <HumanoidRobot position={[-7, 0.3, -40]} rotationY={0.9} />
      {/* free-standing units */}
      <HumanoidRobot position={[5.5, 0, -46]} rotationY={-0.6} />
      <HumanoidRobot position={[-6.5, 0, -80]} rotationY={0.7} />

      {/* facility camera feeds on pole monitors */}
      <FeedMonitor
        position={[14, 2.3, -32]}
        rotationY={-0.5}
        src="/assets/3D_images/3d_image_start_camera.png"
      />
      <FeedMonitor
        position={[-14, 2.3, -110]}
        rotationY={0.4}
        src="/assets/3D_images/3d_image_the_last_vision.png"
      />

      {/* far corridor — entrance to the descent */}
      <group position={[0, 0, -118.5]}>
        {[-2.6, 2.6].map((x) => (
          <mesh key={x} position={[x, 2, 0]} castShadow>
            <boxGeometry args={[0.5, 4, 0.8]} />
            <meshStandardMaterial color="#1a2433" roughness={0.45} metalness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 4.1, 0]} castShadow>
          <boxGeometry args={[5.7, 0.5, 0.8]} />
          <meshStandardMaterial color="#1a2433" roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.8, -0.3]}>
          <planeGeometry args={[4.6, 3.6]} />
          <meshBasicMaterial
            color="#4a8fd8"
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#5aa0e8" intensity={14} distance={14} position={[0, 2, -1.5]} />
      </group>

      {/* lighting — bright daylight through the glass wall */}
      <directionalLight
        position={[30, 14, -50]}
        intensity={2.6}
        color="#ffe8c8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={2}
        shadow-camera-far={120}
        shadow-bias={-0.0004}
      />
      <pointLight color="#9cc8ff" intensity={20} distance={30} position={[0, 5.5, -55]} />
      <pointLight color="#9cc8ff" intensity={20} distance={30} position={[0, 5.5, -85]} />
      <pointLight color="#5aa0e8" intensity={12} distance={24} position={[0, 4, -110]} />
      <hemisphereLight args={["#bcd0e8", "#2a3444", 0.85]} />
    </group>
  );
}
