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
 * The cosmic journey choreographed as camera keyframes.
 *
 * Space map (z into the void):
 *   open void 0 → planet approach (36,-20,-215 r22) → five project
 *   stations along -250…-450 → ringed planet (-26,14,-480) + system star
 *   (-50,30,-530) → quiet drift → luminous star + disc (0,-2,-645).
 */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.0, pos: [0, 0, 4], look: [0, 0, -120] }, // restrained deep-space open
  { p: 0.05, pos: [0, 0, -16], look: [4, -4, -140] }, // gentle advance
  { p: 0.1, pos: [4, -1, -50], look: [24, -12, -215] }, // planet enters frame
  { p: 0.15, pos: [6, -3, -100], look: [32, -18, -215] },
  { p: 0.2, pos: [6, -5, -150], look: [34, -19, -218] }, // planet fills the view
  { p: 0.26, pos: [4, -4, -195], look: [10, -6, -250] }, // over the limb, onward
  { p: 0.31, pos: [6, -3, -243], look: [10, -2, -250] }, // EdTech station
  { p: 0.37, pos: [-6, 2, -292], look: [-14, 4, -300] }, // CraftHUB
  { p: 0.44, pos: [8, 4, -342], look: [14, 6, -350] }, // VELORA
  { p: 0.5, pos: [-6, -1, -392], look: [-12, -2, -400] }, // AutoTrack
  { p: 0.56, pos: [2, 0, -442], look: [4, 0, -450] }, // FaceDetector
  { p: 0.62, pos: [0, 6, -465], look: [-26, 14, -480] }, // ringed planet reveal
  { p: 0.68, pos: [-8, 9, -498], look: [-50, 30, -530] }, // the system star
  { p: 0.74, pos: [-4, 8, -536], look: [-10, 8, -620] }, // stillness — drift on
  { p: 0.8, pos: [2, 5, -566], look: [0, -2, -645] }, // destination emerging
  { p: 0.88, pos: [2, 3, -596], look: [0, -2, -650] },
  { p: 0.95, pos: [0, 4, -614], look: [0, -2, -650] },
  { p: 1.0, pos: [0, 4, -626], look: [0, -2, -648] }, // facing the star + disc
];

export const COLOR_STOPS: ColorStop[] = [
  { p: 0.0, bg: "#020309", fog: "#04060d" }, // void
  { p: 0.12, bg: "#030412", fog: "#050713" },
  { p: 0.25, bg: "#04051a", fog: "#060a1c" }, // indigo around the planet
  { p: 0.4, bg: "#030414", fog: "#050816" },
  { p: 0.56, bg: "#040518", fog: "#060a1a" },
  { p: 0.66, bg: "#070a1e", fog: "#080e20" }, // faint warmth near the star
  { p: 0.78, bg: "#040613", fog: "#060a18" },
  { p: 0.9, bg: "#030512", fog: "#050914" },
  { p: 1.0, bg: "#040714", fog: "#060b16" }, // the destination glow
];
