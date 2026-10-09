"use client";

import {
  GlassRailing,
  MonitorWall,
  LightShaft,
  Silhouette,
  CurvedWalkway,
  RockWall,
  GreeneryWindow,
  SignPanel,
  FeedMonitor,
} from "../props/Facility";

/**
 * Scene 03 — the descent (reference: 3d_image_road_to_under_earth /
 * 3d_image_datacenters). A gallery bridge crosses the cavern void, then a
 * curved balcony walkway wraps around the nucleus and spirals down.
 * Greenery atria glow behind tall windows in the rock walls.
 */
export function DescentWorld() {
  return (
    <group>
      {/* ── landing continuing from the ops floor ──────────────── */}
      <mesh position={[0, -0.25, -120]} receiveShadow>
        <boxGeometry args={[30, 0.5, 8]} />
        <meshStandardMaterial color="#232f45" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* ── cavern rock walls enclosing the descent ────────────── */}
      {[-21, 21].map((x) =>
        [-134, -152, -170, -188, -206].map((z) => (
          <RockWall
            key={`${x}-${z}`}
            position={[x, -4, z]}
            rotationY={x < 0 ? Math.PI / 2 : -Math.PI / 2}
            w={17}
            h={26}
          />
        )),
      )}
      {/* wall flanks beside the corridor exit */}
      <RockWall position={[-12, 0, -120]} rotationY={0.35} w={16} h={14} />
      <RockWall position={[12, 0, -120]} rotationY={-0.35} w={16} h={14} />

      {/* ── gallery bridge over the void ───────────────────────── */}
      <mesh position={[0, -0.2, -150.5]} receiveShadow>
        <boxGeometry args={[4.5, 0.4, 61]} />
        <meshStandardMaterial color="#2a3648" roughness={0.55} metalness={0.55} />
      </mesh>
      {/* edge lights */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 0.02, -150.5]}>
          <boxGeometry args={[0.05, 0.03, 61]} />
          <meshBasicMaterial color="#7dd3fc" toneMapped={false} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* glass railings */}
      <GlassRailing position={[-2.1, 0, -150.5]} length={61} rotationY={Math.PI / 2} />
      <GlassRailing position={[2.1, 0, -150.5]} length={61} rotationY={Math.PI / 2} />
      {/* support pylons dropping into the dark */}
      {[-130, -146, -162, -178].map((z) => (
        <mesh key={z} position={[0, -7.2, z]} castShadow>
          <cylinderGeometry args={[0.22, 0.3, 14, 8]} />
          <meshStandardMaterial color="#1c2838" roughness={0.55} metalness={0.6} />
        </mesh>
      ))}
      {/* cavern floor far below the bridge */}
      <mesh position={[0, -14.2, -150]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 70]} />
        <meshStandardMaterial color="#0b1220" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* ── curved balcony walkway wrapping the nucleus ────────── */}
      {/* north landing where the bridge meets the arc */}
      <mesh position={[0, -0.35, -182]} receiveShadow>
        <boxGeometry args={[6, 0.35, 5]} />
        <meshStandardMaterial color="#2a3648" roughness={0.55} metalness={0.55} />
      </mesh>
      <CurvedWalkway
        center={[0, -198]}
        radius={13}
        a0={0.05}
        a1={Math.PI * 0.82}
        y0={-0.5}
        y1={-11}
        width={3.6}
        segments={46}
      />

      {/* ── greenery atria + signage on the west rock wall ─────── */}
      <GreeneryWindow position={[-20.0, -1, -150]} rotationY={Math.PI / 2} width={7} height={9} />
      <GreeneryWindow position={[-20.0, -3, -166]} rotationY={Math.PI / 2} width={7} height={10} />
      <GreeneryWindow position={[-20.0, -5, -182]} rotationY={Math.PI / 2} width={7} height={10} />
      <SignPanel
        position={[-19.95, 1.5, -160]}
        rotationY={Math.PI / 2}
        title={"THE\nNUCLEUS"}
        lines={["Central Intelligence", "Sub-Level 07"]}
        width={5}
      />

      {/* technical displays on the east wall */}
      <MonitorWall position={[20.0, 1.5, -140]} rotationY={-Math.PI / 2} cols={3} rows={2} />
      <MonitorWall position={[20.0, -1.5, -160]} rotationY={-Math.PI / 2} cols={3} rows={2} accent="#34d399" />
      <MonitorWall position={[20.0, -4.5, -180]} rotationY={-Math.PI / 2} cols={3} rows={2} accent="#a78bfa" />

      {/* ops-floor camera feed on the walkway landing */}
      <FeedMonitor
        position={[-1.8, 2.1, -182.5]}
        rotationY={0.5}
        src="/assets/3D_images/3d_image_labo.png"
        width={2}
      />

      {/* silhouettes — scale cue on bridge + walkway */}
      <Silhouette position={[1.2, 0.1, -136]} rotationY={Math.PI} />
      <Silhouette position={[-8.5, -4.4, -190.5]} rotationY={1.9} />
      <Silhouette position={[0, -0.2, -175]} rotationY={Math.PI} />

      {/* blue light rising from the depths around the core */}
      <LightShaft position={[0, -5, -196]} radius={5.5} height={20} opacity={0.09} />
      <LightShaft position={[-7, -7, -190]} radius={2.5} height={16} color="#5aa0e8" opacity={0.07} />
      <LightShaft position={[8, -7, -202]} radius={2.5} height={16} color="#5aa0e8" opacity={0.07} />

      {/* lighting — cold descending blue */}
      <directionalLight
        position={[0, 10, -125]}
        intensity={0.6}
        color="#bcd8ff"
      />
      <pointLight color="#4a90e0" intensity={30} distance={50} position={[0, -8, -196]} />
      <pointLight color="#2a5a9e" intensity={12} distance={26} position={[0, -2, -145]} />
      <pointLight color="#3a6ab0" intensity={10} distance={24} position={[-14, -4, -170]} />
      <hemisphereLight args={["#24354e", "#060b16", 0.4]} />
    </group>
  );
}
