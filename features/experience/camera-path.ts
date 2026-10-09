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
 *   terrace plaza 0 → lab entrance -18 → ops floor -24…-110
 *   → gallery bridge -118…-180 → balcony arc around the nucleus (0,-196)
 *   → chamber floor y-14, camera low looking up at the core.
 */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.0, pos: [16, 8.5, 24], look: [0, 7, -38] }, // drone establishing shot
  { p: 0.05, pos: [10, 6, 4], look: [-1, 6.5, -34] }, // lateral sweep to the front
  { p: 0.09, pos: [4, 3.4, -8], look: [0, 4, -24] }, // nearing the facade
  { p: 0.14, pos: [0, 2.3, -15], look: [0, 2.6, -32] }, // at the glass doors
  { p: 0.175, pos: [0, 2.1, -24], look: [0, 2.2, -46] }, // inside — the lab
  { p: 0.21, pos: [-3.5, 2.1, -34], look: [-8.5, 1.8, -50] }, // robot display left
  { p: 0.27, pos: [3, 2.1, -46], look: [8.5, 1.7, -60] }, // EdTech bay (right)
  { p: 0.34, pos: [-3, 2.1, -58], look: [-8.5, 1.7, -72] }, // CraftHUB (left)
  { p: 0.41, pos: [3, 2.1, -70], look: [8.5, 1.7, -84] }, // VELORA (right)
  { p: 0.475, pos: [-3, 2.1, -82], look: [-8.5, 1.7, -96] }, // AutoTrack (left)
  { p: 0.545, pos: [0, 2.2, -94], look: [0, 1.7, -110] }, // FaceDetector (center)
  { p: 0.6, pos: [0, 2.5, -106], look: [0, 0.5, -130] }, // toward the gallery
  { p: 0.66, pos: [0, 2.4, -114], look: [0, -2, -150] }, // overlook — cavern opens
  { p: 0.72, pos: [0, 0.7, -140], look: [0, -3, -185] }, // gallery bridge over the void
  { p: 0.78, pos: [-1.5, -0.8, -168], look: [0, -2, -196] }, // reaching the walkway
  { p: 0.84, pos: [-9.5, -5, -188], look: [0, 0, -198] }, // west arc, core in view
  { p: 0.9, pos: [-6, -9.5, -198], look: [0, 8, -198] }, // lower arc — look UP
  { p: 0.955, pos: [-1, -11, -194], look: [0, 13, -199] }, // base, rising gaze
  { p: 1.0, pos: [2, -10.8, -191], look: [0, 15, -198] }, // final low-angle pose
];

export const COLOR_STOPS: ColorStop[] = [
  { p: 0.0, bg: "#f0a868", fog: "#eec39c" }, // golden-hour exterior
  { p: 0.09, bg: "#dd9468", fog: "#e0ab84" }, // dusk approach
  { p: 0.15, bg: "#8fa8c4", fog: "#a8bccc" }, // through the glass
  { p: 0.21, bg: "#b8c8da", fog: "#c2d0de" }, // bright daylight lab
  { p: 0.36, bg: "#afc0d4", fog: "#bacadb" },
  { p: 0.5, bg: "#a8b8cc", fog: "#b2c2d4" },
  { p: 0.62, bg: "#2a3c58", fog: "#263c5c" }, // gallery edge — dark falls
  { p: 0.72, bg: "#12223e", fog: "#122542" }, // descent
  { p: 0.84, bg: "#0a1628", fog: "#0b1a32" },
  { p: 0.93, bg: "#060f20", fog: "#081628" },
  { p: 1.0, bg: "#050b16", fog: "#060f20" }, // nucleus chamber
];
