"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYS, COLOR_STOPS } from "./camera-path";
import { journey } from "./journey-store";
import { clamp01, smoothstep } from "@/lib/utils";

// Precomputed outside the component — mutable scratch objects reused
// every frame, not React state.
const KEYS = CAMERA_KEYS.map((k) => ({
  p: k.p,
  pos: new THREE.Vector3(...k.pos),
  look: new THREE.Vector3(...k.look),
}));

const STOPS = COLOR_STOPS.map((s) => ({
  p: s.p,
  bg: new THREE.Color(s.bg),
  fog: new THREE.Color(s.fog),
}));

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _bg = new THREE.Color("#5fb3e8");
const _fog = new THREE.Color("#a8d4ea");
const _fwd = new THREE.Vector3();

let prevHeading = 0;
let roll = 0;

/**
 * Reads the smoothed scroll progress and moves the camera along the
 * choreographed keyframe path — with gentle banking into turns — while
 * cross-fading sky and fog colors between environments.
 */
export function CameraRig() {
  useFrame((state, delta) => {
    const p = clamp01(journey.progress);
    const dt = Math.min(delta, 0.05);

    // ── camera keyframe interpolation ─────────────────────────────
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1].p <= p) i++;
    const a = KEYS[i];
    const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const t = smoothstep(clamp01((p - a.p) / Math.max(b.p - a.p, 1e-5)));
    _pos.lerpVectors(a.pos, b.pos, t);
    _look.lerpVectors(a.look, b.look, t);

    if (!journey.reducedMotion) {
      _pos.x += journey.pointerX * 0.4;
      _pos.y += journey.pointerY * 0.25;
      _look.x += journey.pointerX * 0.8;
      _look.y += journey.pointerY * 0.5;
    }

    state.camera.position.copy(_pos);
    state.camera.lookAt(_look);

    // ── banking into turns ────────────────────────────────────────
    state.camera.getWorldDirection(_fwd);
    const heading = Math.atan2(_fwd.x, -_fwd.z);
    let dh = heading - prevHeading;
    if (dh > Math.PI) dh -= Math.PI * 2;
    if (dh < -Math.PI) dh += Math.PI * 2;
    prevHeading = heading;
    const targetRoll = journey.reducedMotion
      ? 0
      : THREE.MathUtils.clamp(dh * 10, -0.09, 0.09);
    roll = THREE.MathUtils.damp(roll, targetRoll, 4, dt);
    state.camera.rotation.z += roll;

    // ── atmosphere color grading ──────────────────────────────────
    let j = 0;
    while (j < STOPS.length - 2 && STOPS[j + 1].p <= p) j++;
    const ca = STOPS[j];
    const cb = STOPS[Math.min(j + 1, STOPS.length - 1)];
    const ct = clamp01((p - ca.p) / Math.max(cb.p - ca.p, 1e-5));
    _bg.lerpColors(ca.bg, cb.bg, ct);
    _fog.lerpColors(ca.fog, cb.fog, ct);

    state.scene.background = _bg;
    const sceneFog = state.scene.fog as THREE.Fog | null;
    if (sceneFog) sceneFog.color.copy(_fog);
  });

  return null;
}
