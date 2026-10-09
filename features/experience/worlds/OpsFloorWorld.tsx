"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { journey } from "../journey-store";
import {
  ServerRack,
  ProjectBay,
  HumanoidRobot,
  MonitorWall,
  LightShaft,
} from "../props/Facility";
import { featuredProjects } from "@/data/projects";

/**
 * Scene 02 — the AI operations floor. Reflective dark floor, server
 * aisles, five project bays (one per featured project), robots at work,
 * and a corridor at the far end leading to the descent.
 */
export function OpsFloorWorld() {
  const racks = useMemo(() => {
    const list: { x: number; z: number; r: number }[] = [];
    for (let z = -38; z > -112; z -= 5.2) {
      list.push({ x: -13.5, z, r: 0.25 });
      list.push({ x: 13.5, z: z - 2.6, r: -0.25 });
      if (z % 10 < 5) {
        list.push({ x: -17.5, z: z - 1.3, r: 0.15 });
        list.push({ x: 17.5, z: z - 3.9, r: -0.15 });
      }
    }
    return list;
  }, []);

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
          <meshStandardMaterial color="#0d1524" roughness={0.35} metalness={0.6} />
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
            color="#0d1524"
            metalness={0.45}
            mirror={0.55}
          />
        )}
      </mesh>

      {/* side walls */}
      {[-20, 20].map((x) => (
        <mesh key={x} position={[x, 4, -74]} receiveShadow>
          <boxGeometry args={[0.6, 8, 96]} />
          <meshStandardMaterial color="#1b2638" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}

      {/* ceiling slab + light panels + trusses */}
      <mesh position={[0, 7.2, -74]}>
        <boxGeometry args={[44, 0.5, 96]} />
        <meshStandardMaterial color="#16202f" roughness={0.8} metalness={0.3} />
      </mesh>
      {[-36, -48, -60, -72, -84, -96, -108].map((z) => (
        <group key={z}>
          <mesh position={[0, 6.9, z]}>
            <boxGeometry args={[10, 0.12, 3.4]} />
            <meshBasicMaterial color="#cfe8ff" toneMapped={false} />
          </mesh>
          <mesh position={[0, 6.7, z]}>
            <boxGeometry args={[36, 0.18, 0.3]} />
            <meshStandardMaterial color="#1a2433" roughness={0.5} metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* subtle light shafts from ceiling panels */}
      {[-48, -72, -96].map((z) => (
        <LightShaft
          key={z}
          position={[0, 3.6, z]}
          radius={3.4}
          height={6.6}
          opacity={0.05}
        />
      ))}

      {/* ── server aisles ──────────────────────────────────────── */}
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

      {/* robots */}
      <HumanoidRobot position={[5.5, 0, -46]} rotationY={-0.6} />
      <HumanoidRobot position={[-6.5, 0, -80]} rotationY={0.7} />

      {/* technical displays on the side walls */}
      <MonitorWall position={[-19.6, 3.6, -52]} rotationY={Math.PI / 2} />
      <MonitorWall position={[19.6, 3.6, -80]} rotationY={-Math.PI / 2} accent="#34d399" />

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
        {/* cool blue light spilling from below */}
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

      {/* lighting — cool operational white/cyan */}
      <directionalLight
        position={[8, 12, -60]}
        intensity={1.1}
        color="#dceaff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={2}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
      />
      <pointLight color="#9cc8ff" intensity={20} distance={30} position={[0, 5.5, -55]} />
      <pointLight color="#9cc8ff" intensity={20} distance={30} position={[0, 5.5, -85]} />
      <pointLight color="#5aa0e8" intensity={12} distance={24} position={[0, 4, -110]} />
      <hemisphereLight args={["#3a5578", "#0a1220", 0.5]} />
    </group>
  );
}
