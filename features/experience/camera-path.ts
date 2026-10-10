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
 * Space map — destinations are widely separated, not on one axis:
 *   rust planet     (-40,  14,-180)  far left
 *   icy moon        ( 55, -26,-360)  low right
 *   volcanic body   (-52, -34,-480)  deep low left
 *   teal world      ( 16, -12,-660)  deep right
 *   ringed giant    ( 42,  34,-620)  high right
 *   system star     (-95,  60,-720)  far upper-left sun
 *   final star+disc (  0,  12,-830)  deep center
 *
 * The route swings left → descends right → drops left → climbs right →
 * sinks into the deep: every leg differs in direction and elevation.
 */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.0, pos: [0, 0, 4], look: [-14, 4, -180] }, // open: terra distant-left
  { p: 0.06, pos: [0, 0, -20], look: [-26, 8, -180] }, // gentle drift
  { p: 0.13, pos: [-2, 1, -70], look: [-36, 12, -178] }, // about — drifting left
  { p: 0.2, pos: [-10, 3, -120], look: [-38, 13, -180] }, // terra looms
  { p: 0.27, pos: [-16, 5, -148], look: [-30, 8, -165] }, // edtech orb, planet behind
  { p: 0.31, pos: [-10, 0, -210], look: [16, -8, -310] }, // transit: swing right, down
  { p: 0.35, pos: [14, -10, -300], look: [34, -16, -330] }, // crafthub orb, moon beyond
  { p: 0.39, pos: [12, -14, -370], look: [-16, -18, -430] }, // transit: back left, down
  { p: 0.42, pos: [-10, -18, -420], look: [-34, -22, -455] }, // velora orb, embers behind
  { p: 0.46, pos: [-6, -10, -470], look: [14, 10, -560] }, // transit: climb right
  { p: 0.5, pos: [10, 4, -530], look: [26, 20, -585] }, // autotrack orb, giant behind
  { p: 0.55, pos: [14, 10, -560], look: [4, 0, -625] }, // transit: leave the giant
  { p: 0.58, pos: [6, 0, -600], look: [4, -2, -640] }, // facedetector orb, teal world
  { p: 0.64, pos: [2, 2, -650], look: [0, 10, -825] }, // quiet — the star far ahead
  { p: 0.71, pos: [0, 4, -685], look: [0, 11, -827] }, // skills — slow advance
  { p: 0.79, pos: [-2, 6, -705], look: [-5, 13, -830] }, // journey — off-axis drift
  { p: 0.88, pos: [0, 5, -735], look: [0, 11, -830] }, // cv — final approach
  { p: 0.95, pos: [0, 4, -758], look: [0, 11, -831] }, // contact — settle
  { p: 1.0, pos: [0, 4, -764], look: [0, 11, -833] }, // facing the star + disc
];

export const COLOR_STOPS: ColorStop[] = [
  { p: 0.0, bg: "#060708", fog: "#08090c" }, // void — charcoal, warm undertone
  { p: 0.12, bg: "#06080c", fog: "#080b10" },
  { p: 0.25, bg: "#080a14", fog: "#0a0d18" }, // indigo hint around the planet
  { p: 0.4, bg: "#07080d", fog: "#090b12" },
  { p: 0.56, bg: "#080a12", fog: "#0a0d16" },
  { p: 0.66, bg: "#0a0c14", fog: "#0c0f18" }, // faint light from the system star
  { p: 0.78, bg: "#07090e", fog: "#090c12" },
  { p: 0.9, bg: "#070a10", fog: "#0a0d14" },
  { p: 1.0, bg: "#0a0c12", fog: "#0c0e14" }, // the destination glow
];
