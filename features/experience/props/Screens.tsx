"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../journey-store";

/**
 * Animated screen content rendered with meshes — dashboard bars,
 * network graphs, code lines, scan frames. All unlit (toneMapped=false)
 * so they read as emissive displays.
 */

const FRAME = "#101a2c";

export function ScreenBezel({
  width = 1.6,
  height = 1,
  children,
}: {
  width?: number;
  height?: number;
  children: ReactNode;
}) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.05]} />
        <meshStandardMaterial color={FRAME} roughness={0.35} metalness={0.6} />
      </mesh>
      <group position={[0, 0, 0.03]}>{children}</group>
    </group>
  );
}

/** Dashboard: dancing metric bars + a title strip. */
export function ScreenDashboard({
  accent = "#38bdf8",
  width = 1.5,
  height = 0.9,
}: {
  accent?: string;
  width?: number;
  height?: number;
}) {
  const bars = useRef<THREE.Group>(null);
  const cols = 9;
  useFrame((state) => {
    if (!bars.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    bars.current.children.forEach((bar, i) => {
      const s = 0.2 + Math.abs(Math.sin(t * 1.1 + i * 0.9)) * 0.75;
      bar.scale.y = s;
      bar.position.y = -height / 2 + 0.1 + (s * (height - 0.24)) / 2;
    });
  });
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#0a1220"
          emissive="#0d1830"
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, height / 2 - 0.06, 0.005]}>
        <planeGeometry args={[width - 0.08, 0.045]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <group ref={bars} position={[0, 0, 0.005]}>
        {[...Array(cols)].map((_, i) => (
          <mesh
            key={i}
            position={[-width / 2 + 0.12 + (i * (width - 0.24)) / (cols - 1), 0, 0]}
          >
            <planeGeometry args={[0.07, height - 0.24]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#7dd3fc" : accent}
              toneMapped={false}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Network graph: nodes + pulsing connections. */
export function ScreenNetwork({
  accent = "#38bdf8",
  width = 1.5,
  height = 0.9,
}: {
  accent?: string;
  width?: number;
  height?: number;
}) {
  const nodes = useMemo(() => {
    const pts: [number, number][] = [
      [-0.55, 0.25], [-0.2, 0.3], [0.15, 0.22], [0.5, 0.28],
      [-0.4, -0.05], [-0.05, 0.02], [0.3, -0.02],
      [-0.55, -0.3], [-0.15, -0.28], [0.25, -0.3], [0.55, -0.22],
    ];
    return pts.map(([x, y]) => [x * width, y * height] as [number, number]);
  }, [width, height]);
  const links = useMemo(
    () =>
      [
        [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 6],
        [4, 5], [5, 6], [4, 7], [5, 8], [6, 9], [6, 10], [7, 8], [8, 9], [9, 10],
      ] as const,
    [],
  );
  const pulse = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!pulse.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    pulse.current.children.forEach((n, i) => {
      const s = 0.7 + Math.sin(t * 2 + i * 1.4) * 0.3;
      n.scale.setScalar(s);
    });
  });
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#0a1220"
          emissive="#0d1830"
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
      <group position={[0, 0, 0.004]}>
        {links.map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy);
          return (
            <mesh
              key={i}
              position={[(x1 + x2) / 2, (y1 + y2) / 2, 0]}
              rotation={[0, 0, Math.atan2(dy, dx)]}
            >
              <planeGeometry args={[len, 0.008]} />
              <meshBasicMaterial
                color={accent}
                toneMapped={false}
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })}
      </group>
      <group ref={pulse} position={[0, 0, 0.006]}>
        {nodes.map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <circleGeometry args={[0.03, 12]} />
            <meshBasicMaterial
              color={i % 4 === 0 ? "#7dd3fc" : accent}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Code/editor: typed line blocks scrolling gently. */
export function ScreenCode({
  accent = "#34d399",
  width = 1.5,
  height = 0.9,
}: {
  accent?: string;
  width?: number;
  height?: number;
}) {
  const lines = useRef<THREE.Group>(null);
  const rows = useMemo(
    () =>
      [...Array(9)].map((_, i) => ({
        indent: [0, 1, 2, 1, 3, 1, 0, 2, 1][i],
        w: 0.3 + ((i * 37) % 50) / 90,
        c: i % 3 === 0 ? accent : i % 3 === 1 ? "#7dd3fc" : "#8aa2c8",
      })),
    [accent],
  );
  useFrame((state) => {
    if (!lines.current || journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    lines.current.position.y = Math.sin(t * 0.4) * 0.02;
    const last = lines.current.children[
      lines.current.children.length - 1
    ] as THREE.Mesh | undefined;
    if (last) (last.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.abs(Math.sin(t * 4)) * 0.6;
  });
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#0a1220"
          emissive="#0b1526"
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
      <group ref={lines} position={[0, 0, 0.005]}>
        {rows.map((r, i) => (
          <mesh
            key={i}
            position={[
              -width / 2 + 0.1 + r.indent * 0.12 + (r.w * (width - 0.3)) / 2,
              height / 2 - 0.12 - i * (height - 0.2) / rows.length,
              0,
            ]}
          >
            <planeGeometry args={[r.w * (width - 0.3), 0.03]} />
            <meshBasicMaterial color={r.c} toneMapped={false} transparent opacity={0.85} />
          </mesh>
        ))}
        {/* blinking caret */}
        <mesh position={[width / 2 - 0.15, -height / 2 + 0.1, 0]}>
          <planeGeometry args={[0.05, 0.06]} />
          <meshBasicMaterial color={accent} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  );
}

/** Detection frame: brackets tracking a scanning reticle. */
export function ScreenScan({
  accent = "#818cf8",
  width = 1.5,
  height = 0.9,
}: {
  accent?: string;
  width?: number;
  height?: number;
}) {
  const scan = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (scan.current) {
      const k = (t * 0.45) % 1;
      scan.current.position.y = height / 2 - k * height;
      (scan.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(k * Math.PI) * 0.55;
    }
    if (box.current) {
      box.current.position.x = Math.sin(t * 0.6) * width * 0.15;
      box.current.position.y = Math.cos(t * 0.45) * height * 0.08;
    }
  });
  const bw = 0.32;
  const bh = 0.36;
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#0a1020"
          emissive="#101a30"
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
      {/* detection frame corners */}
      <group ref={box} position={[0, 0, 0.005]}>
        {[[-bw, bh, 1, -1], [bw, bh, -1, -1], [-bw, -bh, 1, 1], [bw, -bh, -1, 1]].map(
          ([x, y, sx, sy], i) => (
            <group key={i} position={[x, y, 0]}>
              <mesh position={[sx * -0.06, 0, 0]}>
                <planeGeometry args={[0.12, 0.02]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
              </mesh>
              <mesh position={[0, sy * -0.06, 0]}>
                <planeGeometry args={[0.02, 0.12]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
              </mesh>
            </group>
          ),
        )}
      </group>
      <mesh ref={scan} position={[0, 0, 0.004]}>
        <planeGeometry args={[width - 0.04, 0.02]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export const SCREEN_KINDS = {
  dashboard: ScreenDashboard,
  network: ScreenNetwork,
  code: ScreenCode,
  scan: ScreenScan,
} as const;

export type ScreenKind = keyof typeof SCREEN_KINDS;
