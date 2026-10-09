"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey, setHovered } from "../journey-store";
import type { Project } from "@/data/projects";
import { SCREEN_KINDS, ScreenBezel, ScreenCode, type ScreenKind } from "./Screens";

const DARK_METAL = "#1a2433";
const BRUSHED = "#2a3850";
const CONCRETE = "#39445a";

/* ── Exterior ───────────────────────────────────────────────────── */

/** City silhouette tower with sparse lit windows. */
export function CityTower({
  position,
  w = 6,
  h = 20,
  d = 6,
  windows = 26,
  color = "#22304a",
}: {
  position: [number, number, number];
  w?: number;
  h?: number;
  d?: number;
  windows?: number;
  color?: string;
}) {
  const wins = useMemo(
    () =>
      [...Array(windows)].map((_, i) => ({
        x: (((i * 53) % 90) / 100 - 0.45) * w,
        y: (((i * 71) % 85) / 100 + 0.06) * h,
        s: 0.12 + ((i * 29) % 10) / 40,
      })),
    [windows, w, h],
  );
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
      </mesh>
      {wins.map((win, i) => (
        <mesh key={i} position={[win.x, win.y - h / 2 + h * 0.05, d / 2 + 0.01]}>
          <planeGeometry args={[win.s * 1.4, win.s]} />
          <meshBasicMaterial color="#ffd9a0" toneMapped={false} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The facility facade: column grid + glass curtain wall, with a lit
 * interior band and a central door opening.
 */
export function CurtainWall({
  position,
  width = 30,
  height = 14,
  doorWidth = 4,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
  doorWidth?: number;
}) {
  const cols = 8;
  const segW = (width - doorWidth) / 2;
  return (
    <group position={position}>
      {/* glass sheets — left/right of the entrance */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (doorWidth / 2 + segW / 2), height / 2, 0]}>
            <planeGeometry args={[segW, height]} />
            <meshPhysicalMaterial
              color="#8fb8dd"
              transparent
              opacity={0.22}
              roughness={0.04}
              metalness={0.15}
              envMapIntensity={1.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* interior glow visible through the glass */}
          <mesh position={[s * (doorWidth / 2 + segW / 2), height / 2, -1.2]}>
            <planeGeometry args={[segW, height]} />
            <meshBasicMaterial
              color="#3a6a9e"
              toneMapped={false}
              transparent
              opacity={0.28}
            />
          </mesh>
        </group>
      ))}
      {/* column grid */}
      {[...Array(cols + 1)].map((_, i) => {
        const x = -width / 2 + (i * width) / cols;
        if (Math.abs(x) < doorWidth / 2 + 0.3) return null;
        return (
          <mesh key={i} position={[x, height / 2, 0.05]} castShadow>
            <boxGeometry args={[0.28, height, 0.28]} />
            <meshStandardMaterial color={DARK_METAL} roughness={0.45} metalness={0.7} />
          </mesh>
        );
      })}
      {/* horizontal mullions */}
      {[0.02, height * 0.5, height - 0.02].map((y) => (
        <mesh key={y} position={[0, y, 0.05]}>
          <boxGeometry args={[width, 0.18, 0.24]} />
          <meshStandardMaterial color={DARK_METAL} roughness={0.45} metalness={0.7} />
        </mesh>
      ))}
      {/* roof slab + signage band */}
      <mesh position={[0, height + 0.35, 0]} castShadow>
        <boxGeometry args={[width + 1.4, 0.7, 1.6]} />
        <meshStandardMaterial color={BRUSHED} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, height - 0.7, 0.09]}>
        <planeGeometry args={[width * 0.5, 0.5]} />
        <meshBasicMaterial color="#7dd3fc" toneMapped={false} transparent opacity={0.6} />
      </mesh>
      {/* plinth */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[width + 1, 0.5, 2]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Sliding glass doors that part as the camera approaches. */
export function SlidingDoors({
  position,
  openRange = [0.11, 0.15],
}: {
  position: [number, number, number];
  openRange?: [number, number];
}) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const open = useRef(0);
  useFrame((_, delta) => {
    const [s, e] = openRange;
    const t = THREE.MathUtils.clamp((journey.progress - s) / (e - s), 0, 1);
    open.current = THREE.MathUtils.damp(open.current, t, 4, delta);
    const off = open.current * 2.1;
    if (left.current) left.current.position.x = -1.05 - off;
    if (right.current) right.current.position.x = 1.05 + off;
  });
  return (
    <group position={position}>
      {/* frame */}
      {[-2.15, 2.15].map((x) => (
        <mesh key={x} position={[x, 1.75, 0]} castShadow>
          <boxGeometry args={[0.24, 3.5, 0.4]} />
          <meshStandardMaterial color={DARK_METAL} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 3.55, 0]} castShadow>
        <boxGeometry args={[4.6, 0.24, 0.4]} />
        <meshStandardMaterial color={DARK_METAL} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* sliding panels */}
      <mesh ref={left} position={[-1.05, 1.75, 0]}>
        <planeGeometry args={[2.1, 3.4]} />
        <meshPhysicalMaterial
          color="#a8cbe8"
          transparent
          opacity={0.3}
          roughness={0.03}
          metalness={0.1}
          envMapIntensity={1.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={right} position={[1.05, 1.75, 0]}>
        <planeGeometry args={[2.1, 3.4]} />
        <meshPhysicalMaterial
          color="#a8cbe8"
          transparent
          opacity={0.3}
          roughness={0.03}
          metalness={0.1}
          envMapIntensity={1.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* floor strip */}
      <mesh position={[0, 0.02, 0.3]} receiveShadow>
        <boxGeometry args={[4.6, 0.06, 1.4]} />
        <meshStandardMaterial color={BRUSHED} roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}

/** A small drone that patrols a loop. */
export function MaintenanceDrone({
  center,
  radius = 6,
  speed = 0.3,
}: {
  center: [number, number, number];
  radius?: number;
  speed?: number;
}) {
  const g = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime * speed;
    g.current.position.set(
      center[0] + Math.cos(t) * radius,
      center[1] + Math.sin(t * 2.3) * 0.6,
      center[2] + Math.sin(t) * radius * 0.55,
    );
    g.current.rotation.y = -t - Math.PI / 2;
    g.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    if (rotors.current) rotors.current.rotation.y += delta * 20;
  });
  return (
    <group ref={g} position={center}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.14, 0.34]} />
        <meshStandardMaterial color={BRUSHED} roughness={0.4} metalness={0.7} />
      </mesh>
      <group ref={rotors}>
        {[[-0.28, 0.2], [0.28, 0.2], [-0.28, -0.2], [0.28, -0.2]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.09, z]}>
            <boxGeometry args={[0.2, 0.015, 0.03]} />
            <meshStandardMaterial color="#0e1523" roughness={0.5} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.02, 0.18]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>
      <pointLight color="#38bdf8" intensity={1.2} distance={4} />
    </group>
  );
}

/* ── Ops floor ──────────────────────────────────────────────────── */

/** Server rack with rows of blinking indicators. */
export function ServerRack({
  position,
  rotationY = 0,
  accent = "#38bdf8",
}: {
  position: [number, number, number];
  rotationY?: number;
  accent?: string;
}) {
  const leds = useRef<THREE.Group>(null);
  const rows = 8;
  useFrame((state) => {
    if (!leds.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    leds.current.children.forEach((led, i) => {
      const m = led as THREE.Mesh;
      (m.material as THREE.MeshBasicMaterial).opacity =
        0.25 + (Math.sin(t * 3 + i * 2.4) > 0.2 ? 0.7 : 0.05);
    });
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 2.2, 0.9]} />
        <meshStandardMaterial color="#141d2e" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* front panel */}
      <mesh position={[0, 1.1, 0.46]}>
        <planeGeometry args={[0.66, 2.05]} />
        <meshStandardMaterial color="#0c1424" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* vent slots */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.28, 0.465]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="#1f2c44" toneMapped={false} />
        </mesh>
      ))}
      {/* indicator LEDs */}
      <group ref={leds} position={[0.22, 0, 0.47]}>
        {[...Array(rows)].map((_, i) => (
          <mesh key={i} position={[0, 0.45 + i * 0.22, 0]}>
            <planeGeometry args={[0.06, 0.03]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#34d399" : accent}
              toneMapped={false}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Industrial robot arm with a slow working sweep. */
export function RobotArm({
  position,
  rotationY = 0,
  accent = "#fb923c",
}: {
  position: [number, number, number];
  rotationY?: number;
  accent?: string;
}) {
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (shoulder.current) {
      shoulder.current.rotation.y = Math.sin(t * 0.4 + position[2]) * 0.5;
      shoulder.current.rotation.z = 0.35 + Math.sin(t * 0.6) * 0.12;
    }
    if (elbow.current) {
      elbow.current.rotation.z = -0.8 + Math.sin(t * 0.5 + 1) * 0.25;
    }
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 12]} />
        <meshStandardMaterial color={DARK_METAL} roughness={0.5} metalness={0.7} />
      </mesh>
      <group ref={shoulder} position={[0, 0.65, 0]}>
        {/* upper arm */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.9, 4, 10]} />
          <meshStandardMaterial color={accent} roughness={0.45} metalness={0.4} />
        </mesh>
        <group ref={elbow} position={[0, 1.15, 0]}>
          {/* forearm */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.7, 4, 10]} />
            <meshStandardMaterial color="#e8edf4" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* wrist + tool */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color={DARK_METAL} roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <coneGeometry args={[0.07, 0.25, 8]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
        {/* shoulder joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color={DARK_METAL} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/** Humanoid service robot standing at a station. */
export function HumanoidRobot({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  const body = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!body.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    body.current.rotation.y = Math.sin(t * 0.35) * 0.2;
    body.current.position.y = Math.sin(t * 0.9) * 0.02;
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group ref={body}>
        {/* legs */}
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.5, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.7, 4, 8]} />
            <meshStandardMaterial color={BRUSHED} roughness={0.45} metalness={0.7} />
          </mesh>
        ))}
        {/* torso */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <capsuleGeometry args={[0.24, 0.5, 4, 10]} />
          <meshStandardMaterial color="#e8edf4" roughness={0.35} metalness={0.5} />
        </mesh>
        {/* chest light */}
        <mesh position={[0, 1.3, 0.22]}>
          <circleGeometry args={[0.06, 12]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
        {/* arms */}
        {[-0.4, 0.4].map((x) => (
          <mesh key={x} position={[x, 1.15, 0]} rotation={[0, 0, x > 0 ? -0.25 : 0.25]} castShadow>
            <capsuleGeometry args={[0.07, 0.55, 4, 8]} />
            <meshStandardMaterial color={BRUSHED} roughness={0.45} metalness={0.7} />
          </mesh>
        ))}
        {/* head */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.17, 14, 14]} />
          <meshStandardMaterial color="#e8edf4" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.74, 0.13]}>
          <planeGeometry args={[0.2, 0.05]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * A project bay: desk console + triple monitor wall + robot arm beside.
 * Registers as a journey interactable (hover → lift + chip → click opens).
 */
export function ProjectBay({
  project,
  position,
  rotationY = 0,
}: {
  project: Project;
  position: [number, number, number];
  rotationY?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const accentLight = useRef<THREE.PointLight>(null);

  const kind: ScreenKind =
    project.slug === "edtech"
      ? "dashboard"
      : project.slug === "crafthub"
        ? "network"
        : project.slug === "velora"
          ? "dashboard"
          : project.slug === "autotrack"
            ? "code"
            : "scan";

  const Screen = SCREEN_KINDS[kind];

  useEffect(() => {
    const obj = root.current;
    if (!obj) return;
    journey.interactables.set(obj, project.slug);
    return () => {
      journey.interactables.delete(obj);
      if (journey.hoveredSlug === project.slug) setHovered(null);
    };
  }, [project.slug]);

  useFrame((_, delta) => {
    const hovered = journey.hoveredSlug === project.slug;
    lift.current = THREE.MathUtils.damp(lift.current, hovered ? 1 : 0, 6, delta);
    if (accentLight.current) {
      accentLight.current.intensity = 4 + lift.current * 16;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group ref={root}>
        {/* console desk */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.1, 0.9]} />
          <meshStandardMaterial color={BRUSHED} roughness={0.4} metalness={0.6} />
        </mesh>
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.24, 0]} castShadow>
            <boxGeometry args={[0.12, 0.5, 0.7]} />
            <meshStandardMaterial color={DARK_METAL} roughness={0.5} metalness={0.7} />
          </mesh>
        ))}
        {/* accent edge strip */}
        <mesh position={[0, 0.56, 0.44]}>
          <planeGeometry args={[2.6, 0.04]} />
          <meshBasicMaterial color={project.accent} toneMapped={false} />
        </mesh>
        {/* monitor wall — center screen + two flanks */}
        <group position={[0, 1.55, -0.5]}>
          <ScreenBezel width={1.9} height={1.1}>
            <Screen accent={project.accent} width={1.82} height={1.02} />
          </ScreenBezel>
          {[-1.35, 1.35].map((x) => (
            <group key={x} position={[x, 0.12, 0.06]} rotation={[0, x > 0 ? -0.35 : 0.35, 0]}>
              <ScreenBezel width={0.7} height={0.8}>
                <ScreenCode accent={project.accent} width={0.64} height={0.74} />
              </ScreenBezel>
            </group>
          ))}
          {/* mount */}
          <mesh position={[0, -0.85, -0.05]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
            <meshStandardMaterial color={DARK_METAL} roughness={0.45} metalness={0.7} />
          </mesh>
        </group>
        {/* bay floor pad */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.9, 2.05, 40]} />
          <meshBasicMaterial
            color={project.accent}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* robot arm to one side */}
      <RobotArm position={[2, 0, 0.4]} rotationY={-0.4} accent={project.accent} />
      <pointLight
        ref={accentLight}
        color={project.accent}
        intensity={4}
        distance={9}
        position={[0, 2.4, 1]}
      />
    </group>
  );
}

/* ── Structure & atmosphere ─────────────────────────────────────── */

/** Glass balustrade segment along +z. */
export function GlassRailing({
  position,
  length = 4,
  rotationY = 0,
}: {
  position: [number, number, number];
  length?: number;
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <planeGeometry args={[length, 1.0]} />
        <meshPhysicalMaterial
          color="#9cc4e4"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.1}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.08, 0]} castShadow>
        <boxGeometry args={[length, 0.06, 0.06]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.4} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

/** A flight of illuminated stairs descending `depth` along -z. */
export function StairFlight({
  position,
  steps = 14,
  width = 4,
  depth = 10,
  drop = 4,
}: {
  position: [number, number, number];
  steps?: number;
  width?: number;
  depth?: number;
  drop?: number;
}) {
  const list = useMemo(
    () =>
      [...Array(steps)].map((_, i) => ({
        z: -(i * depth) / steps,
        y: -(i * drop) / steps,
      })),
    [steps, depth, drop],
  );
  return (
    <group position={position}>
      {list.map((s, i) => (
        <group key={i} position={[0, s.y, s.z]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[width, 0.16, depth / steps + 0.05]} />
            <meshStandardMaterial color="#232f45" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* illuminated nosing */}
          <mesh position={[0, 0.09, -(depth / steps) / 2 + 0.02]}>
            <boxGeometry args={[width, 0.025, 0.04]} />
            <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Volumetric-ish light shaft (additive gradient cylinder). */
export function LightShaft({
  position,
  radius = 2,
  height = 20,
  color = "#7dd3fc",
  opacity = 0.1,
}: {
  position: [number, number, number];
  radius?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius * 0.7, radius, height, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Concentric catwalk ring for the nucleus chamber. */
export function CatwalkRing({
  position,
  radius = 7,
  tube = 0.9,
}: {
  position: [number, number, number];
  radius?: number;
  tube?: number;
}) {
  const posts = useMemo(() => [...Array(18)].map((_, i) => (i * Math.PI * 2) / 18), []);
  return (
    <group position={position}>
      {/* deck */}
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[radius, tube / 2, 8, 48]} />
        <meshStandardMaterial color="#26344e" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* edge light */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + tube / 2, 0.03, 6, 48]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} transparent opacity={0.8} />
      </mesh>
      {/* railing posts */}
      {posts.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * (radius + tube / 2), 0.55, Math.sin(a) * (radius + tube / 2)]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
          <meshStandardMaterial color={DARK_METAL} roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.08, 0]}>
        <torusGeometry args={[radius + tube / 2, 0.035, 6, 48]} />
        <meshStandardMaterial color={BRUSHED} roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}

/** Tiny engineer silhouette for scale. */
export function Silhouette({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 6]} />
        <meshStandardMaterial color="#0c1526" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#0c1526" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Wall of small technical displays. */
export function MonitorWall({
  position,
  rotationY = 0,
  cols = 4,
  rows = 3,
  accent = "#38bdf8",
}: {
  position: [number, number, number];
  rotationY?: number;
  cols?: number;
  rows?: number;
  accent?: string;
}) {
  const kinds: ScreenKind[] = ["dashboard", "network", "code", "scan"];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[...Array(cols * rows)].map((_, i) => {
        const cx = (i % cols) - (cols - 1) / 2;
        const cy = Math.floor(i / cols) - (rows - 1) / 2;
        const Screen = SCREEN_KINDS[kinds[i % kinds.length]];
        return (
          <group key={i} position={[cx * 0.85, cy * 0.62, 0]}>
            <ScreenBezel width={0.78} height={0.55}>
              <Screen accent={accent} width={0.72} height={0.49} />
            </ScreenBezel>
          </group>
        );
      })}
    </group>
  );
}
