"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey, setHovered } from "../journey-store";
import type { Project } from "@/data/projects";

/**
 * The cosmic prop kit — everything GPU-side:
 * starfields and nebulae as shaders, a procedural planet, ring systems,
 * a spiral galaxy, a luminous star with an accretion disc, and the
 * project stations that serve as interactive destinations.
 */

const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
`;

/* ── Starfield ──────────────────────────────────────────────────── */

/** Instanced star layer with per-star size, color and twinkle. */
export function Starfield({
  count = 2500,
  radius = 380,
  zMin = -720,
  zMax = 60,
  size = 1.6,
  seed = 1,
}: {
  count?: number;
  radius?: number;
  zMin?: number;
  zMax?: number;
  size?: number;
  seed?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { geometry, uniforms } = useMemo(() => {
    const n = journey.lowQuality ? Math.floor(count / 2) : count;
    const pos = new Float32Array(n * 3);
    const sz = new Float32Array(n);
    const col = new Float32Array(n * 3);
    const tw = new Float32Array(n);
    const rand = (i: number, k: number) => {
      const x = Math.sin(i * 127.1 + k * 311.7 + seed * 17.3) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < n; i++) {
      const a = rand(i, 1) * Math.PI * 2;
      const r = Math.sqrt(rand(i, 2)) * radius;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (rand(i, 3) - 0.5) * radius * 1.6;
      pos[i * 3 + 2] = zMin + rand(i, 4) * (zMax - zMin);
      const mag = rand(i, 5);
      sz[i] = size * (0.4 + Math.pow(mag, 2.4) * 2.2); // a few bright, many faint
      const warm = rand(i, 6);
      const c =
        warm > 0.92
          ? [1.0, 0.82, 0.62] // rare warm giant
          : warm > 0.75
            ? [0.72, 0.82, 1.0] // blue-white
            : [0.82, 0.87, 0.97];
      const dim = 0.45 + mag * 0.55;
      col[i * 3] = c[0] * dim;
      col[i * 3 + 1] = c[1] * dim;
      col[i * 3 + 2] = c[2] * dim;
      tw[i] = 0.4 + rand(i, 7) * 2.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aTwinkle", new THREE.BufferAttribute(tw, 1));
    return {
      geometry: g,
      uniforms: { uTime: { value: 0 } },
    };
  }, [count, radius, zMin, zMax, size, seed]);

  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aSize;
          attribute vec3 aColor;
          attribute float aTwinkle;
          uniform float uTime;
          varying vec3 vColor;
          varying float vTw;
          void main() {
            vColor = aColor;
            vTw = aTwinkle;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (240.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          varying vec3 vColor;
          varying float vTw;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.08, d);
            float tw = 0.72 + 0.28 * sin(uTime * vTw + vTw * 12.0);
            gl_FragColor = vec4(vColor, a * tw);
          }
        `}
      />
    </points>
  );
}

/* ── Nebula ─────────────────────────────────────────────────────── */

/** A vast soft nebula veil — fbm shader on a huge plane. */
export function NebulaVeil({
  position,
  rotation = [0, 0, 0],
  width = 320,
  height = 200,
  colorA = "#0d1e3e",
  colorB = "#2a1e4e",
  seed = 0,
  opacity = 0.5,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  colorA?: string;
  colorB?: string;
  seed?: number;
  opacity?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uSeed: { value: seed },
      uOpacity: { value: opacity },
    }),
    [colorA, colorB, seed, opacity],
  );
  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          ${NOISE_GLSL}
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uSeed;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv - 0.5;
            float n = fbm(vUv * 3.0 + uSeed * 13.0 + uTime * 0.006);
            float n2 = fbm(vUv * 6.5 - uTime * 0.004 + uSeed * 29.0);
            float mask = smoothstep(0.52, 0.05, length(uv));
            float density = smoothstep(0.32, 0.9, n * 0.85 + n2 * 0.4) * mask;
            vec3 col = mix(uColorA, uColorB, n2);
            // faint embedded star knots
            col += vec3(0.10, 0.14, 0.20) * pow(max(n2 - 0.62, 0.0), 2.0) * 3.0;
            gl_FragColor = vec4(col, density * uOpacity);
          }
        `}
      />
    </mesh>
  );
}

/* ── Planet ─────────────────────────────────────────────────────── */

/**
 * A procedural planet: fbm continents, drifting cloud bands, an
 * ice cap, a day/night terminator lit by `sunDir`, and a fresnel
 * atmosphere shell.
 */
export function Planet({
  position,
  radius = 22,
  sunDir = [-0.55, 0.35, -0.75],
  seed = 3,
}: {
  position: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  seed?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const atmo = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSeed: { value: seed },
    }),
    [sunDir, seed],
  );
  useFrame((state) => {
    if (journey.reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (mat.current) mat.current.uniforms.uTime.value = t;
    if (atmo.current) atmo.current.uniforms.uTime.value = t;
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec3 vNormal;
            varying vec3 vPos;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            ${NOISE_GLSL}
            uniform float uTime;
            uniform vec3 uSunDir;
            uniform float uSeed;
            varying vec3 vNormal;
            varying vec3 vPos;
            void main() {
              vec3 nrm = normalize(vPos);
              // continents from 3-axis fbm blend
              float c1 = fbm(nrm.xy * 2.2 + uSeed * 7.0);
              float c2 = fbm(nrm.yz * 2.2 + uSeed * 11.0);
              float c3 = fbm(nrm.zx * 2.2 + uSeed * 17.0);
              float land = smoothstep(0.46, 0.56, (c1 + c2 + c3) / 3.0);
              // palette: deep ocean → shallow → forest → rock
              vec3 ocean = vec3(0.035, 0.13, 0.24);
              vec3 shallow = vec3(0.10, 0.24, 0.30);
              vec3 forest = vec3(0.11, 0.22, 0.13);
              vec3 rock = vec3(0.24, 0.22, 0.19);
              vec3 surf = mix(ocean, shallow, smoothstep(0.0, 0.35, land));
              surf = mix(surf, forest, smoothstep(0.35, 0.7, land));
              surf = mix(surf, rock, smoothstep(0.7, 1.0, land) * c2);
              // polar ice
              float ice = smoothstep(0.72, 0.85, abs(nrm.y));
              surf = mix(surf, vec3(0.75, 0.82, 0.9), ice);
              // drifting cloud bands
              float clouds = fbm(vec2(nrm.x * 3.0 + uTime * 0.008, nrm.y * 5.0) + uSeed);
              clouds = smoothstep(0.55, 0.78, clouds);
              // day/night
              float day = clamp(dot(vNormal, uSunDir), 0.0, 1.0);
              float terminator = smoothstep(0.0, 0.35, day);
              vec3 dayCol = surf * (0.25 + day * 1.15) + clouds * day * 0.55;
              // faint city speckle on the night side
              float speck = step(0.985, vnoise(nrm.xz * 90.0)) * land;
              vec3 nightCol = surf * 0.05 + vec3(1.0, 0.75, 0.4) * speck * 0.5;
              vec3 col = mix(nightCol, dayCol, terminator);
              // rim: thin atmosphere edge
              float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
              col += vec3(0.15, 0.35, 0.55) * rim * (0.3 + day);
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
      {/* atmosphere shell */}
      <mesh scale={1.09}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          ref={atmo}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              vView = normalize(-mv.xyz);
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uSunDir;
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              float f = pow(1.0 - abs(dot(vNormal, vView)), 3.2);
              float day = clamp(dot(vNormal, uSunDir) * 0.5 + 0.55, 0.12, 1.0);
              gl_FragColor = vec4(vec3(0.30, 0.55, 0.85) * day, f * 0.85);
            }
          `}
        />
      </mesh>
    </group>
  );
}

/** Quiet grey moon. */
export function Moon({
  position,
  radius = 4,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color="#8a93a2" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

/* ── Rings & galaxy ─────────────────────────────────────────────── */

/** Planetary ring system — banded shader ring, tilted. */
export function RingSystem({
  position,
  inner = 24,
  outer = 48,
  tilt = [1.15, 0.1, 0.15],
  tint = "#7a8fb0",
}: {
  position: [number, number, number];
  inner?: number;
  outer?: number;
  tilt?: [number, number, number];
  tint?: string;
}) {
  const uniforms = useMemo(
    () => ({
      uTint: { value: new THREE.Color(tint) },
      uInner: { value: inner },
      uOuter: { value: outer },
    }),
    [tint, inner, outer],
  );
  return (
    <mesh position={position} rotation={tilt}>
      <ringGeometry args={[inner, outer, 128, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={/* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          ${NOISE_GLSL}
          uniform vec3 uTint;
          uniform float uInner;
          uniform float uOuter;
          varying vec3 vPos;
          void main() {
            float r = (length(vPos.xy) - uInner) / (uOuter - uInner);
            float bands = fbm(vec2(r * 14.0, 0.5));
            float a = smoothstep(0.0, 0.06, r) * smoothstep(1.0, 0.82, r);
            a *= 0.25 + bands * 0.55;
            gl_FragColor = vec4(uTint * (0.6 + bands * 0.8), a * 0.7);
          }
        `}
      />
    </mesh>
  );
}

/** A distant spiral galaxy — instanced points in logarithmic arms. */
export function SpiralGalaxy({
  position,
  rotation = [0.9, 0.2, 0.3],
  radius = 55,
  count = 2400,
  arms = 2,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  count?: number;
  arms?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const n = journey.lowQuality ? count / 2 : count;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const arm = i % arms;
      const t = Math.pow((i / n) * 0.9 + ((i * 37) % 10) / 100, 0.72);
      const angle = t * 4.6 + (arm * Math.PI * 2) / arms;
      const r = t * radius;
      const spread = (1 - t) * 3.2 + 0.8;
      const rx = Math.sin(i * 12.9898) * 0.5 - 0.25;
      pos[i * 3] = Math.cos(angle) * r + rx * spread * 2;
      pos[i * 3 + 1] = Math.sin(i * 78.233) * spread * 0.35;
      pos[i * 3 + 2] = Math.sin(angle) * r + rx * spread;
      const heat = 1 - t;
      col[i * 3] = 0.55 + heat * 0.45;
      col[i * 3 + 1] = 0.55 + heat * 0.35;
      col[i * 3 + 2] = 0.85 + heat * 0.15;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, radius, arms]);

  useFrame((_, delta) => {
    if (group.current && !journey.reducedMotion) {
      group.current.rotation.z += delta * 0.008;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={group}>
        <points geometry={geometry} frustumCulled={false}>
          <pointsMaterial
            size={0.5}
            vertexColors
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            fog={false}
          />
        </points>
      </group>
    </group>
  );
}

/* ── The luminous star + accretion disc ─────────────────────────── */

function makeGlowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(190,225,255,0.55)");
  grad.addColorStop(0.6, "rgba(120,170,255,0.16)");
  grad.addColorStop(1, "rgba(60,100,220,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
let glowTex: THREE.Texture | null = null;
function getGlowTexture() {
  if (!glowTex) glowTex = makeGlowTexture();
  return glowTex;
}

/** A radiant star: bright core + layered billboards + light. */
export function StarGlow({
  position,
  coreRadius = 3,
  glowScale = 60,
  color = "#cfe6ff",
  intensity = 3,
}: {
  position: [number, number, number];
  coreRadius?: number;
  glowScale?: number;
  color?: string;
  intensity?: number;
}) {
  const s1 = useRef<THREE.Sprite>(null);
  useFrame((state) => {
    if (s1.current && !journey.reducedMotion) {
      const t = state.clock.elapsedTime;
      s1.current.material.rotation = Math.sin(t * 0.1) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[coreRadius, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <sprite ref={s1} scale={[glowScale, glowScale, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </sprite>
      <sprite scale={[glowScale * 2.2, glowScale * 2.2, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.28}
        />
      </sprite>
      <pointLight color={color} intensity={intensity} distance={0} decay={0.6} />
    </group>
  );
}

/** A slow-swirling accretion disc. */
export function AccretionDisc({
  position,
  inner = 10,
  outer = 46,
  tilt = [1.12, 0, 0.1],
}: {
  position: [number, number, number];
  inner?: number;
  outer?: number;
  tilt?: [number, number, number];
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uInner: { value: inner },
      uOuter: { value: outer },
    }),
    [inner, outer],
  );
  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={position} rotation={tilt}>
      <ringGeometry args={[inner, outer, 128, 8]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          ${NOISE_GLSL}
          uniform float uTime;
          uniform float uInner;
          uniform float uOuter;
          varying vec3 vPos;
          void main() {
            float r = length(vPos.xy);
            float t = (r - uInner) / (uOuter - uInner);
            float angle = atan(vPos.y, vPos.x);
            // swirling dust lanes — inner material orbits faster
            float swirl = fbm(vec2(angle * 3.0 + t * 9.0 - uTime * (0.22 - t * 0.12), t * 16.0));
            // doppler-ish beaming: brighter approaching side
            float beam = 0.75 + 0.45 * cos(angle - 0.6);
            float a = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.7, t);
            vec3 warm = vec3(0.85, 0.62, 0.42);
            vec3 cool = vec3(0.45, 0.65, 0.95);
            vec3 col = mix(warm, cool, smoothstep(0.15, 0.75, t));
            gl_FragColor = vec4(col * beam * (0.5 + swirl * 0.9), a * (0.25 + swirl * 0.5));
          }
        `}
      />
    </mesh>
  );
}

/* ── Dust & debris ──────────────────────────────────────────────── */

/** Slow dust motes drifting along the travel corridor. */
export function DustField({
  count = 900,
  zMin = -40,
  zMax = -660,
  spread = 60,
  size = 0.35,
  seed = 5,
}: {
  count?: number;
  zMin?: number;
  zMax?: number;
  spread?: number;
  size?: number;
  seed?: number;
}) {
  const geometry = useMemo(() => {
    const n = journey.lowQuality ? count / 2 : count;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r1 = Math.sin(i * 127.1 + seed) * 0.5 - Math.floor(Math.sin(i * 127.1 + seed) * 0.5);
      const r2 = Math.sin(i * 311.7 + seed * 2) * 0.5 - Math.floor(Math.sin(i * 311.7 + seed * 2) * 0.5);
      const r3 = Math.sin(i * 74.7 + seed * 3) * 0.5 - Math.floor(Math.sin(i * 74.7 + seed * 3) * 0.5);
      pos[i * 3] = r1 * spread;
      pos[i * 3 + 1] = r2 * spread * 0.6;
      pos[i * 3 + 2] = zMin + r3 * (zMax - zMin);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, zMin, zMax, spread, seed]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={size}
        color="#5a7aa8"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        fog={false}
      />
    </points>
  );
}

/** Scattered rocky debris — instanced low-poly rocks. */
export function DebrisField({
  center,
  count = 140,
  spread = 40,
  seed = 9,
}: {
  center: [number, number, number];
  count?: number;
  spread?: number;
  seed?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const r = (k: number) => {
        const v = Math.sin(i * 157.1 + k * 91.3 + seed) * 43758.5453;
        return v - Math.floor(v) - 0.5;
      };
      e.set(r(1) * Math.PI, r(2) * Math.PI, r(3) * Math.PI);
      q.setFromEuler(e);
      const sc = 0.3 + Math.abs(r(4)) * 1.6;
      s.set(sc, sc * (0.7 + Math.abs(r(5))), sc);
      m.compose(new THREE.Vector3(r(6) * spread, r(7) * spread * 0.5, r(8) * spread), q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, spread, seed]);

  useFrame((state, delta) => {
    if (group.current && !journey.reducedMotion) {
      group.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group position={center}>
      <group ref={group}>
        <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#3a4250" roughness={0.9} metalness={0.2} />
        </instancedMesh>
      </group>
    </group>
  );
}

/* ── Project station ────────────────────────────────────────────── */

/**
 * A project destination: a small station — beveled core, service ring,
 * antenna mast and an accent beacon. Registers as a journey
 * interactable: hover → accent light swells + DOM chip; click opens
 * the project page.
 */
export function ProjectStation({
  project,
  position,
  rotationY = 0,
}: {
  project: Project;
  position: [number, number, number];
  rotationY?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const accentLight = useRef<THREE.PointLight>(null);
  const beacon = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const obj = root.current;
    if (!obj) return;
    journey.interactables.set(obj, project.slug);
    return () => {
      journey.interactables.delete(obj);
      if (journey.hoveredSlug === project.slug) setHovered(null);
    };
  }, [project.slug]);

  useFrame((state, delta) => {
    const hovered = journey.hoveredSlug === project.slug;
    lift.current = THREE.MathUtils.damp(lift.current, hovered ? 1 : 0, 6, delta);
    if (accentLight.current) accentLight.current.intensity = 3 + lift.current * 14;
    if (beacon.current) {
      beacon.current.opacity =
        0.55 + Math.sin(state.clock.elapsedTime * 2.4) * 0.25 + lift.current * 0.2;
    }
    if (spin.current && !journey.reducedMotion) {
      spin.current.rotation.y += delta * 0.25;
    }
    if (root.current) {
      const s = 1 + lift.current * 0.08;
      root.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group ref={root}>
        <group ref={spin}>
          {/* central hub */}
          <mesh castShadow>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color="#28344a" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* service ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.09, 8, 40]} />
            <meshStandardMaterial color="#3a4a66" roughness={0.35} metalness={0.8} />
          </mesh>
          {/* accent nodes on the ring */}
          {[0, 1, 2].map((i) => {
            const a = (i * Math.PI * 2) / 3;
            return (
              <mesh key={i} position={[Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial color={project.accent} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
        {/* antenna mast */}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 1.2, 6]} />
          <meshStandardMaterial color="#46587a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshBasicMaterial
            ref={beacon}
            color={project.accent}
            toneMapped={false}
            transparent
          />
        </mesh>
        {/* faint identification halo */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <ringGeometry args={[2.0, 2.06, 48]} />
          <meshBasicMaterial
            color={project.accent}
            transparent
            opacity={0.35}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <pointLight
        ref={accentLight}
        color={project.accent}
        intensity={3}
        distance={10}
        position={[0, 0.5, 0]}
      />
    </group>
  );
}
