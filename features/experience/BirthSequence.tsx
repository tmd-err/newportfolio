"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "./journey-store";
import { clamp01, smoothstep } from "@/lib/utils";

/**
 * The Birth of the Universe — runs inside the main canvas, at the real
 * Sun's position. A seed light flickers awake, ambient particles are
 * drawn in, settle into tilted orbits, accelerate, then collapse into
 * the forming star — which is the same <Sun> the journey uses.
 *
 * Stages (fractions of introT):
 *   0.00–0.10  darkness
 *   0.08–0.30  the seed light appears, faint flicker
 *   0.15–0.65  particles converge → tilted orbits → accelerate
 *   0.50–0.82  the real Sun scales up and ignites
 *   0.72–0.97  particles absorb into the star
 *   0.80–1.00  camera hands off to the scroll journey
 */

const SUN_POS = new THREE.Vector3(-180, 100, -250);

function mulberry32(a: number) {
  let t = a >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLE_VERT = /* glsl */ `
  attribute vec4 aSeed; // phase, orbitRadiusMix, inclSign, tintSize
  uniform float uAppear;
  uniform float uOrbit;
  uniform float uAbsorb;
  uniform float uTime;
  varying float vAlpha;
  varying vec3 vColor;

  vec3 rotAxis(vec3 v, vec3 k, float a) {
    float c = cos(a);
    float s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }

  void main() {
    // scattered start — drifts gently inward as gravity organizes it
    vec3 scatter = position * (1.0 - 0.4 * uOrbit);

    // inclined elliptical orbit in a per-particle tilted plane
    vec3 axis = normalize(
      vec3(aSeed.x - 0.5, aSeed.y - 0.5, aSeed.z - 0.5) + vec3(0.03)
    );
    float tilt = (aSeed.y - 0.5) * 1.6;
    float speed = 0.25 + aSeed.z * 0.9;
    float ang =
      aSeed.x * 6.28318 + uTime * speed * (0.25 + uOrbit * 2.4);
    float orbR = mix(length(position) * 0.6, 9.0 + aSeed.w * 26.0, uOrbit);
    vec3 orbit = rotAxis(
      vec3(cos(ang) * orbR, (aSeed.y - 0.5) * 2.5, sin(ang) * orbR),
      axis,
      tilt
    );

    vec3 pos = mix(scatter, orbit, uOrbit);
    pos *= 1.0 - uAbsorb * 0.94; // collapse into the forming star

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // staggered appearance, absorbed fade-out
    float stagger = smoothstep(aSeed.w * 0.7, aSeed.w * 0.7 + 0.3, uAppear);
    vAlpha = stagger * (1.0 - uAbsorb);
    vColor = mix(vec3(1.0, 0.96, 0.85), vec3(1.0, 0.7, 0.32), aSeed.z);
    gl_PointSize =
      (1.1 + aSeed.z * 2.3) * (1.0 - uAbsorb * 0.4) * (160.0 / -mv.z);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

export function BirthSequence() {
  const root = useRef<THREE.Group>(null);
  const seed = useRef<THREE.Sprite>(null);
  const seedCore = useRef<THREE.Mesh>(null);
  const pmat = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms, seedTex } = useMemo(() => {
    const n = journey.lowQuality ? 700 : 1500;
    const pos = new Float32Array(n * 3);
    const seedArr = new Float32Array(n * 4);
    const rand = mulberry32(4177);
    for (let i = 0; i < n; i++) {
      // random direction on the sphere
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = 45 + rand() * 95; // shell 45..140 around the Sun
      pos[i * 3] = Math.cos(a) * s * r;
      pos[i * 3 + 1] = u * r;
      pos[i * 3 + 2] = Math.sin(a) * s * r;
      seedArr[i * 4] = rand();
      seedArr[i * 4 + 1] = rand();
      seedArr[i * 4 + 2] = rand();
      seedArr[i * 4 + 3] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seedArr, 4));

    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,250,235,1)");
    grad.addColorStop(0.3, "rgba(255,220,160,0.55)");
    grad.addColorStop(1, "rgba(255,170,80,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;

    return {
      geometry: g,
      seedTex: tex,
      uniforms: {
        uAppear: { value: 0 },
        uOrbit: { value: 0 },
        uAbsorb: { value: 0 },
        uTime: { value: 0 },
      },
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // ── intro clock ───────────────────────────────────────────────
    if (!journey.introDone) {
      const rate = journey.introSkip ? 9 : 1;
      const dur = journey.reducedMotion ? 2.2 : 9.5;
      journey.introT = Math.min(1, journey.introT + (dt * rate) / dur);
      if (journey.introT >= 1) {
        journey.introDone = true;
        try {
          sessionStorage.setItem("yt-born", "1");
        } catch {
          /* storage unavailable — intro may replay next visit */
        }
      }
    }
    const T = journey.introT;
    const t = state.clock.elapsedTime;

    // hide the whole rig once the journey has begun
    if (root.current) root.current.visible = !journey.introDone;

    // ── seed light: appear 0.06→0.25, fade as the star ignites ────
    const seedEnv =
      smoothstep(clamp01((T - 0.06) / 0.19)) *
      (1 - smoothstep(clamp01((T - 0.5) / 0.22)));
    const flicker = journey.reducedMotion
      ? 1
      : 0.88 + 0.12 * Math.sin(t * 21) * Math.sin(t * 7.3 + 1.7);
    if (seed.current) {
      const m = seed.current.material;
      m.opacity = seedEnv * flicker * 0.85;
      const sc = 16 + seedEnv * 14;
      seed.current.scale.set(sc, sc, 1);
    }
    if (seedCore.current) {
      const m = seedCore.current.material as THREE.MeshBasicMaterial;
      m.opacity = seedEnv * flicker;
    }

    // ── particle stages ───────────────────────────────────────────
    if (pmat.current) {
      const u = pmat.current.uniforms;
      u.uTime.value = journey.reducedMotion ? 0 : t;
      u.uAppear.value = smoothstep(clamp01((T - 0.14) / 0.2));
      u.uOrbit.value = smoothstep(clamp01((T - 0.26) / 0.4));
      u.uAbsorb.value = smoothstep(clamp01((T - 0.7) / 0.27));
    }
  });

  return (
    <group ref={root} position={SUN_POS} visible={!journey.introDone}>
      {/* the first light — a warm point in the dark */}
      <sprite ref={seed} scale={[16, 16, 1]}>
        <spriteMaterial
          map={seedTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0}
        />
      </sprite>
      <mesh ref={seedCore}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color="#fff4dc"
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* ambient matter drawn into orbit */}
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={pmat}
          uniforms={uniforms}
          vertexShader={PARTICLE_VERT}
          fragmentShader={PARTICLE_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
