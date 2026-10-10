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
 * The solar-system tour choreographed as camera keyframes.
 *
 * Space map (compressed distances, real order):
 *   Sun      (-180, 100,-250)    Mercury (-30,  6,-120)
 *   Venus    (  28, -10,-240)    Earth   (-32, 10,-380)
 *   Mars     (  30, -14,-500)    belt    (  0, -5,-575)
 *   Jupiter  ( -42,  18,-680)    Saturn  ( 40, 22,-840)
 *   Uranus   ( -30, -18,-980)    Neptune ( 24, -8,-1100)
 *   black hole (  0,  10,-1280)
 *
 * Each leg differs: lateral swings, descents, a climb through the belt,
 * a settling arc per planet, then the long dark fall into the hole.
 */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.0, pos: [0, 0, 4], look: [-45, 18, -200] }, // open — Sun far upper-left
  { p: 0.06, pos: [0, 0, -16], look: [-60, 22, -220] }, // gentle drift
  { p: 0.115, pos: [-8, 1, -85], look: [-30, 6, -120] }, // Mercury — small crescent
  { p: 0.155, pos: [-10, -1, -140], look: [10, -4, -230] }, // transit → Venus
  { p: 0.195, pos: [10, -6, -212], look: [28, -10, -240] }, // Venus
  { p: 0.235, pos: [6, -3, -285], look: [-18, 4, -365] }, // transit → Earth
  { p: 0.27, pos: [-8, 2, -342], look: [-32, 10, -380] }, // Earth — edtech
  { p: 0.315, pos: [-4, -1, -410], look: [16, -8, -480] }, // transit → Mars
  { p: 0.35, pos: [12, -8, -468], look: [30, -14, -500] }, // Mars — crafthub
  { p: 0.385, pos: [8, -6, -545], look: [-10, 4, -650] }, // through the belt
  { p: 0.42, pos: [-14, 4, -640], look: [-42, 18, -680] }, // Jupiter — velora
  { p: 0.46, pos: [-16, 8, -715], look: [16, 14, -815] }, // transit → Saturn
  { p: 0.5, pos: [10, 11, -795], look: [40, 22, -840] }, // Saturn — autotrack
  { p: 0.545, pos: [10, 8, -870], look: [-12, -8, -955] }, // transit → ice giants
  { p: 0.58, pos: [-10, -10, -948], look: [-30, -18, -980] }, // Uranus — facedetector
  { p: 0.615, pos: [-12, -12, -1015], look: [8, -6, -1075] }, // transit → Neptune
  { p: 0.655, pos: [8, -8, -1080], look: [24, -8, -1100] }, // Neptune — supporting
  { p: 0.71, pos: [4, -4, -1130], look: [0, 6, -1265] }, // the void — hole emerging
  { p: 0.77, pos: [0, 0, -1180], look: [0, 8, -1280] }, // skills — the approach
  { p: 0.83, pos: [-2, 3, -1212], look: [-3, 10, -1282] }, // journey — off-axis drift
  { p: 0.9, pos: [0, 4, -1240], look: [0, 10, -1282] }, // cv — close approach
  { p: 0.96, pos: [0, 4, -1252], look: [0, 10, -1282] }, // contact — event horizon
  { p: 1.0, pos: [0, 4, -1258], look: [0, 10, -1283] }, // facing the shadow
];

export const COLOR_STOPS: ColorStop[] = [
  { p: 0.0, bg: "#060708", fog: "#08090c" }, // void — charcoal, warm undertone
  { p: 0.12, bg: "#070809", fog: "#090a0d" }, // warm solar light nearby
  { p: 0.27, bg: "#07090f", fog: "#090b13" }, // Earth's orbit
  { p: 0.38, bg: "#080807", fog: "#0a0a0a" }, // the belt
  { p: 0.5, bg: "#07080b", fog: "#090a0e" }, // giant realm
  { p: 0.62, bg: "#06080c", fog: "#080a10" }, // ice giants — colder
  { p: 0.75, bg: "#050608", fog: "#07080b" }, // the void
  { p: 0.9, bg: "#040405", fog: "#050506" }, // near the hole
  { p: 1.0, bg: "#030303", fog: "#040404" }, // the shadow
];
