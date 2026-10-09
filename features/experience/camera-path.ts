export interface CameraKey {
  /** normalized scroll progress 0..1 */
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
}

export interface ColorStop {
  p: number;
  bg: string;
  fog: string;
}

/**
 * The journey choreographed as camera keyframes. Section heights are set in
 * svh so each act owns a fixed scroll fraction regardless of viewport size.
 *
 * World map (z into the screen):
 *   plaza 0 → facade -24 → ops floor -30…-118 → stairwell -120…-162
 *   nucleus chamber -170…-235 (floor at y≈-14)
 */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.0, pos: [16, 7.5, 26], look: [0, 8, -40] }, // drone establishing shot
  { p: 0.05, pos: [9, 5.5, 6], look: [0, 7, -35] }, // lateral approach
  { p: 0.09, pos: [3, 3.5, -8], look: [0, 5, -30] }, // nearing the facade
  { p: 0.14, pos: [0, 2.4, -19], look: [0, 3, -34] }, // at the glass doors
  { p: 0.175, pos: [0, 2.2, -27], look: [0, 2.4, -48] }, // inside — ops floor
  { p: 0.21, pos: [-3, 2.2, -38], look: [-8, 2, -52] }, // track left
  { p: 0.27, pos: [3, 2.2, -48], look: [8, 1.8, -62] }, // EdTech bay (right)
  { p: 0.34, pos: [-3, 2.2, -60], look: [-8, 1.8, -74] }, // CraftHUB (left)
  { p: 0.41, pos: [3, 2.2, -72], look: [8, 1.8, -86] }, // VELORA (right)
  { p: 0.475, pos: [-3, 2.2, -84], look: [-8, 1.8, -98] }, // AutoTrack (left)
  { p: 0.545, pos: [0, 2.3, -96], look: [0, 1.8, -112] }, // FaceDetector (center)
  { p: 0.6, pos: [0, 2.6, -108], look: [0, 1.5, -124] }, // toward the stairwell
  { p: 0.66, pos: [0, 2.4, -118], look: [0, 0, -134] }, // landing — look down
  { p: 0.72, pos: [0, 0.5, -128], look: [0, -4, -146] }, // descending
  { p: 0.78, pos: [0, -3, -138], look: [0, -8, -160] }, // deeper — glow below
  { p: 0.84, pos: [0, -7, -150], look: [0, -6, -175] }, // the chamber opens
  { p: 0.9, pos: [0, -10, -162], look: [0, 4, -200] }, // base of the nucleus
  { p: 0.955, pos: [-3, -11, -176], look: [0, 10, -206] }, // look up the core
  { p: 1.0, pos: [2, -10.5, -188], look: [0, 14, -212] }, // final low-angle pose
];

export const COLOR_STOPS: ColorStop[] = [
  { p: 0.0, bg: "#f0a868", fog: "#eec39c" }, // golden-hour exterior
  { p: 0.09, bg: "#dd9468", fog: "#e0ab84" }, // dusk approach
  { p: 0.15, bg: "#3d5a80", fog: "#4a6a8f" }, // through the glass
  { p: 0.21, bg: "#101c30", fog: "#14243c" }, // ops floor
  { p: 0.36, bg: "#0e1a2e", fog: "#122036" },
  { p: 0.5, bg: "#0c1830", fog: "#101d34" },
  { p: 0.62, bg: "#0a1528", fog: "#0c1a32" },
  { p: 0.72, bg: "#081226", fog: "#0a1830" }, // descent
  { p: 0.84, bg: "#071020", fog: "#081428" },
  { p: 0.93, bg: "#06101f", fog: "#071224" },
  { p: 1.0, bg: "#050b16", fog: "#060f20" }, // nucleus chamber
];
