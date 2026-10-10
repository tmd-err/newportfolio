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

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

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
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(10, 10) }, // off-screen
      },
    };
  }, [count, radius, zMin, zMax, size, seed]);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uPointer.value.set(journey.ndcX, journey.ndcY);
      if (!journey.reducedMotion) {
        mat.current.uniforms.uTime.value = state.clock.elapsedTime;
      }
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
          uniform vec2 uPointer;
          varying vec3 vColor;
          varying float vTw;
          void main() {
            vColor = aColor;
            vTw = aTwinkle;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec4 clip = projectionMatrix * mv;
            vec2 ndc = clip.xy / clip.w;
            // subtle local gravitational nudge + brighten near the pointer
            vec2 d = ndc - uPointer;
            float dist = length(d);
            float f = exp(-dist * dist * 22.0);
            vec2 push = f > 0.001 ? (d / max(dist, 1e-4)) * f * 0.028 : vec2(0.0);
            ndc += push;
            clip = vec4(ndc * clip.w, clip.z, clip.w);
            vColor *= 1.0 + f * 0.7;
            gl_PointSize = aSize * (240.0 / -mv.z);
            gl_Position = clip;
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
  spin = 0.02,
  palette,
}: {
  position: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  seed?: number;
  /** surface rotation speed rad/s — the surface spins, the light stays fixed */
  spin?: number;
  /** surface palette: [ocean, shallow, lowland, highland, ice, atmosphere] */
  palette?: {
    ocean: string;
    shallow: string;
    low: string;
    high: string;
    ice: string;
    atmos: string;
    /** 0..1 — higher = more land coverage */
    landLevel?: number;
    /** cloud coverage 0..1 */
    clouds?: number;
  };
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const atmo = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSeed: { value: seed },
      uSpin: { value: spin },
      uOcean: { value: new THREE.Color(palette?.ocean ?? "#0a2138") },
      uShallow: { value: new THREE.Color(palette?.shallow ?? "#1a3d4d") },
      uLow: { value: new THREE.Color(palette?.low ?? "#1c3821") },
      uHigh: { value: new THREE.Color(palette?.high ?? "#3d3830") },
      uIce: { value: new THREE.Color(palette?.ice ?? "#bfD1e6") },
      uAtmos: { value: new THREE.Color(palette?.atmos ?? "#4d8cd9") },
      uLand: { value: palette?.landLevel ?? 0.51 },
      uClouds: { value: palette?.clouds ?? 0.6 },
    }),
    [sunDir, seed, spin, palette],
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
            uniform float uSpin;
            uniform vec3 uOcean;
            uniform vec3 uShallow;
            uniform vec3 uLow;
            uniform vec3 uHigh;
            uniform vec3 uIce;
            uniform vec3 uAtmos;
            uniform float uLand;
            uniform float uClouds;
            varying vec3 vNormal;
            varying vec3 vPos;
            void main() {
              // slowly rotate the sampled domain — the world turns under fixed light
              float ang = uTime * uSpin;
              vec3 nrm = normalize(vPos);
              nrm = vec3(
                cos(ang) * nrm.x - sin(ang) * nrm.z,
                nrm.y,
                sin(ang) * nrm.x + cos(ang) * nrm.z
              );
              // continents from 3-axis fbm blend
              float c1 = fbm(nrm.xy * 2.2 + uSeed * 7.0);
              float c2 = fbm(nrm.yz * 2.2 + uSeed * 11.0);
              float c3 = fbm(nrm.zx * 2.2 + uSeed * 17.0);
              float land = smoothstep(uLand - 0.05, uLand + 0.05, (c1 + c2 + c3) / 3.0);
              vec3 surf = mix(uOcean, uShallow, smoothstep(0.0, 0.35, land));
              surf = mix(surf, uLow, smoothstep(0.35, 0.7, land));
              surf = mix(surf, uHigh, smoothstep(0.7, 1.0, land) * c2);
              // polar caps
              float ice = smoothstep(0.72, 0.85, abs(nrm.y));
              surf = mix(surf, uIce, ice);
              // drifting cloud bands
              float clouds = fbm(vec2(nrm.x * 3.0 + uTime * 0.008, nrm.y * 5.0) + uSeed);
              clouds = smoothstep(0.55, 0.78, clouds) * uClouds;
              // day/night
              float day = clamp(dot(vNormal, uSunDir), 0.0, 1.0);
              float terminator = smoothstep(0.0, 0.35, day);
              vec3 dayCol = surf * (0.3 + day * 1.35) + clouds * day * 0.5;
              // faint city speckle on the night side
              float speck = step(0.985, vnoise(nrm.xz * 90.0)) * land;
              vec3 nightCol = surf * 0.06 + vec3(1.0, 0.75, 0.4) * speck * 0.4;
              vec3 col = mix(nightCol, dayCol, terminator);
              // subtle atmosphere rim in the world's own color
              float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
              col += uAtmos * rim * (0.12 + day * 0.35);
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
            uniform vec3 uAtmos;
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              float f = pow(1.0 - abs(dot(vNormal, vView)), 3.2);
              float day = clamp(dot(vNormal, uSunDir) * 0.5 + 0.55, 0.12, 1.0);
              gl_FragColor = vec4(uAtmos * 0.8 * day, f * 0.6);
            }
          `}
        />
      </mesh>
    </group>
  );
}

/** Quiet moon — procedural regolith, craters, a real terminator. */
export function Moon({
  position,
  radius = 4,
  sunDir = [-0.55, 0.35, -0.72],
  seed = 8,
  tint = [0.48, 0.48, 0.50],
  spin = 0.008,
}: {
  position: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  seed?: number;
  /** surface albedo — pale blue-grey for ice, warm grey for rock */
  tint?: [number, number, number];
  spin?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSeed: { value: seed },
      uTint: { value: new THREE.Vector3(...tint) },
      uSpin: { value: spin },
    }),
    [sunDir, seed, tint, spin],
  );
  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 48, 48]} />
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
          uniform vec3 uTint;
          uniform float uSpin;
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            float ang = uTime * uSpin;
            vec3 nrm = normalize(vPos);
            nrm = vec3(
              cos(ang) * nrm.x - sin(ang) * nrm.z,
              nrm.y,
              sin(ang) * nrm.x + cos(ang) * nrm.z
            );
            // regolith base tone
            float rock = fbm(nrm.xy * 4.0 + nrm.zx * 3.2 + uSeed);
            vec3 surf = mix(uTint * 0.62, uTint * 1.05, rock);
            // craters — darkened bowls from thresholded noise at two scales
            float c1 = smoothstep(0.70, 0.78, vnoise(nrm.xz * 16.0 + uSeed * 5.0));
            float c2 = smoothstep(0.74, 0.80, vnoise(nrm.xy * 27.0 + uSeed * 9.0));
            surf *= 1.0 - (c1 * 0.5 + c2 * 0.35);
            // rim highlight on crater edges
            float edge = smoothstep(0.68, 0.70, vnoise(nrm.xz * 16.0 + uSeed * 5.0)) - c1;
            surf += vec3(0.10) * max(edge, 0.0);
            float day = clamp(dot(vNormal, uSunDir), 0.0, 1.0);
            float terminator = smoothstep(0.0, 0.18, day);
            vec3 col = mix(surf * 0.06, surf * (0.3 + day * 1.35), terminator);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** A dark volcanic body — emissive fissures in a charcoal crust. */
export function VolcanicBody({
  position,
  radius = 9,
  sunDir = [-0.55, 0.35, -0.72],
  seed = 11,
  spin = 0.012,
}: {
  position: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  seed?: number;
  spin?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSeed: { value: seed },
      uSpin: { value: spin },
    }),
    [sunDir, seed, spin],
  );
  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 48, 48]} />
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
          uniform float uSpin;
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            float ang = uTime * uSpin;
            vec3 nrm = normalize(vPos);
            nrm = vec3(
              cos(ang) * nrm.x - sin(ang) * nrm.z,
              nrm.y,
              sin(ang) * nrm.x + cos(ang) * nrm.z
            );
            // charcoal basalt crust — warm grey so the lit side reads
            float crust = fbm(nrm.xy * 5.0 + nrm.zx * 4.0 + uSeed);
            vec3 surf = mix(vec3(0.06, 0.05, 0.045), vec3(0.17, 0.14, 0.12), crust);
            // lava fissures — ridged noise channels
            float rid = abs(fbm(nrm.xz * 4.5 + nrm.y * 3.0 + uSeed * 3.0) - 0.5) * 2.0;
            float fiss = smoothstep(0.06, 0.0, rid);
            float pulse = 0.75 + 0.25 * sin(uTime * 0.7 + crust * 8.0);
            vec3 lava = vec3(0.85, 0.32, 0.08) * fiss * pulse;
            float day = clamp(dot(vNormal, uSunDir), 0.0, 1.0);
            float terminator = smoothstep(0.0, 0.3, day);
            // lava glows on the night side too — that is the point
            vec3 col = mix(surf * 0.08 + lava, surf * (0.35 + day * 1.1) + lava * 0.6, terminator);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/** A banded gas giant — stripes, terminator, thin atmosphere rim. */
export function GasGiant({
  position,
  radius = 14,
  sunDir = [-0.5, 0.3, -0.8],
  seed = 4,
  spin = 0.03,
}: {
  position: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  seed?: number;
  spin?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSeed: { value: seed },
      uSpin: { value: spin },
    }),
    [sunDir, seed, spin],
  );
  useFrame((state) => {
    if (mat.current && !journey.reducedMotion) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 56, 56]} />
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
            uniform float uSpin;
            varying vec3 vNormal;
            varying vec3 vPos;
            void main() {
              float ang = uTime * uSpin;
              vec3 nrm = normalize(vPos);
              nrm = vec3(
                cos(ang) * nrm.x - sin(ang) * nrm.z,
                nrm.y,
                sin(ang) * nrm.x + cos(ang) * nrm.z
              );
              // horizontal storm bands — cream, ochre, muted brown
              float wob = fbm(vec2(nrm.x * 3.0, nrm.z * 3.0) + uSeed) * 0.6;
              float band = fbm(vec2((nrm.y + wob) * 6.5, uSeed));
              vec3 cream = vec3(0.55, 0.50, 0.40);
              vec3 ochre = vec3(0.45, 0.33, 0.20);
              vec3 brown = vec3(0.26, 0.19, 0.13);
              vec3 surf = mix(brown, cream, smoothstep(0.25, 0.6, band));
              surf = mix(surf, ochre, smoothstep(0.6, 0.85, band) * 0.8);
              // pale equatorial band
              surf += vec3(0.14, 0.12, 0.09) * smoothstep(0.12, 0.0, abs(nrm.y + wob * 0.3));
              float day = clamp(dot(vNormal, uSunDir), 0.0, 1.0);
              float terminator = smoothstep(0.0, 0.3, day);
              vec3 col = mix(surf * 0.06, surf * (0.4 + day * 1.3), terminator);
              // subtle warm atmosphere rim
              float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.5);
              col += vec3(0.35, 0.30, 0.22) * rim * (0.15 + day * 0.5);
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
    </group>
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

/**
 * Occasional fire meteors — bright heads with short tapered amber trails
 * that enter from the far left/right of the camera's current view.
 * Sparse, irregular, GPU-light: one additive streak plane per meteor.
 */
export function MeteorField({ max = 3 }: { max?: number }) {
  const streakTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 8;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, "rgba(255,244,220,1)");
    g.addColorStop(0.15, "rgba(255,196,120,0.9)");
    g.addColorStop(0.5, "rgba(220,120,50,0.45)");
    g.addColorStop(1, "rgba(140,60,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 8);
    return new THREE.CanvasTexture(c);
  }, []);

  // runtime state lives outside render — initialized lazily in useFrame
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const meteors = useRef<Array<{
    rng: () => number;
    active: boolean;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    life: number;
    lifeSpan: number;
    cooldown: number;
  }>>([]);

  useFrame((state, dt) => {
    if (journey.reducedMotion) return;
    if (meteors.current.length === 0) {
      const rng = mulberry32(777);
      for (let i = 0; i < max; i++) {
        meteors.current.push({
          rng,
          active: false,
          pos: new THREE.Vector3(),
          vel: new THREE.Vector3(),
          life: 0,
          lifeSpan: 1,
          cooldown: rng() * 8,
        });
      }
    }
    const camPos = state.camera.position;
    for (let i = 0; i < meteors.current.length; i++) {
      const m = meteors.current[i];
      const mesh = meshes.current[i];
      if (!mesh) continue;
      if (!m.active) {
        m.cooldown -= dt;
        if (m.cooldown > 0) continue;
        const side = m.rng() < 0.5 ? -1 : 1;
        const depth = 60 + m.rng() * 140;
        m.pos.set(
          camPos.x + side * (70 + m.rng() * 40),
          camPos.y + (m.rng() - 0.5) * 50,
          camPos.z - depth,
        );
        const speed = 55 + m.rng() * 45;
        m.vel.set(-side * speed, (m.rng() - 0.5) * 18, (m.rng() - 0.5) * 10);
        m.lifeSpan = 1.6 + m.rng() * 1.3;
        m.life = m.lifeSpan;
        m.active = true;
        mesh.visible = true;
        mesh.position.copy(m.pos);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(1, 0, 0),
          m.vel.clone().normalize(),
        );
        continue;
      }
      m.life -= dt;
      m.pos.addScaledVector(m.vel, dt);
      mesh.position.copy(m.pos);
      const fade = Math.min(1, m.life / (m.lifeSpan * 0.35));
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade;
      if (m.life <= 0) {
        m.active = false;
        mesh.visible = false;
        m.cooldown = 4 + m.rng() * 14;
      }
    }
  });

  return (
    <group frustumCulled={false}>
      {Array.from({ length: max }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshes.current[i] = el; }}
          visible={false}
          renderOrder={5}
        >
          <planeGeometry args={[14, 0.28]} />
          <meshBasicMaterial
            map={streakTex}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            fog={false}
          />
        </mesh>
      ))}
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
        color="#6a7a8e"
        map={getGlowTexture()}
        alphaTest={0.02}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        fog={false}
      />
    </points>
  );
}



/* ── Project orb ────────────────────────────────────────────────── */

/**
 * A project destination: a small artificial celestial body — a dark
 * core wrapped in a translucent atmospheric shell, crossed by one
 * thin inclined orbit ring carrying a tiny moonlet. An emissive
 * meridian seam glows in the project's accent. Registers as a journey
 * interactable: hover → shell brightens, orbit tilts open; click →
 * the project page.
 */
export function ProjectOrb({
  project,
  position,
  tilt = 0.5,
}: {
  project: Project;
  position: [number, number, number];
  /** inclination of the orbit ring */
  tilt?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const moonlet = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const accentLight = useRef<THREE.PointLight>(null);
  const shell = useRef<THREE.MeshStandardMaterial>(null);
  const seam = useRef<THREE.MeshBasicMaterial>(null);

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
    if (accentLight.current) accentLight.current.intensity = 2 + lift.current * 10;
    if (shell.current) shell.current.opacity = 0.14 + lift.current * 0.2;
    if (seam.current) {
      seam.current.opacity =
        0.4 + Math.sin(state.clock.elapsedTime * 1.8) * 0.15 + lift.current * 0.35;
    }
    if (moonlet.current && !journey.reducedMotion) {
      moonlet.current.rotation.z += delta * 0.35;
    }
    if (spin.current && !journey.reducedMotion) {
      spin.current.rotation.y += delta * 0.12;
    }
    if (root.current) {
      root.current.scale.setScalar(1 + lift.current * 0.06);
    }
  });

  return (
    <group position={position}>
      <group ref={root}>
        <group ref={spin}>
          {/* dark core sphere */}
          <mesh>
            <sphereGeometry args={[1.1, 40, 40]} />
            <meshStandardMaterial
              color="#14161a"
              roughness={0.55}
              metalness={0.5}
            />
          </mesh>
          {/* translucent atmospheric shell — edge-lit */}
          <mesh>
            <sphereGeometry args={[1.32, 40, 40]} />
            <meshStandardMaterial
              ref={shell}
              color="#20242c"
              transparent
              opacity={0.14}
              roughness={0.15}
              metalness={0.2}
              depthWrite={false}
            />
          </mesh>
          {/* emissive meridian seam — the data marking */}
          <mesh rotation={[0, 0, 0.35]}>
            <torusGeometry args={[1.115, 0.006, 6, 72]} />
            <meshBasicMaterial
              ref={seam}
              color={project.accent}
              transparent
              opacity={0.4}
              toneMapped={false}
            />
          </mesh>
        </group>
        {/* inclined orbit ring + moonlet crossing in front and behind */}
        <group rotation={[tilt, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.9, 1.92, 96]} />
            <meshBasicMaterial
              color="#9a968c"
              transparent
              opacity={0.35}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <group ref={moonlet} rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[1.91, 0, 0]}>
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshBasicMaterial color={project.accent} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
      <pointLight
        ref={accentLight}
        color={project.accent}
        intensity={2}
        distance={9}
        position={[0, 0.4, 0]}
      />
    </group>
  );
}
