import type * as THREE from "three";

/**
 * Mutable journey state shared between the GSAP scroll driver, the DOM
 * layer and the per-frame 3D rigs. Kept outside React state on purpose —
 * it is written ~60x/second and read inside useFrame.
 */
export const journey = {
  /** scroll progress through the whole page, smoothed by GSAP scrub */
  progress: 0,
  /** pointer position normalized -1..1 (CSS pixels) */
  pointerX: 0,
  pointerY: 0,
  /** pointer in NDC for raycasting */
  ndcX: 0,
  ndcY: 0,
  /** pointer moved since last raycast */
  pointerDirty: true,
  reducedMotion: false,
  /** lower fidelity for small screens / weak GPUs */
  lowQuality: false,

  /** "birth of the universe" intro: 0..1 timeline, done flag, skip request */
  introT: 1,
  introDone: true,
  introSkip: false,

  /** slug of the 3D installation currently hovered, if any */
  hoveredSlug: null as string | null,
  /** DOM tooltip wants hover updates */
  onHoverChange: null as ((slug: string | null) => void) | null,
  /** SPA navigation injected by the client layer */
  navigate: null as ((path: string) => void) | null,
  locale: "en" as string,

  /** raycast targets: root object → project slug */
  interactables: new Map<THREE.Object3D, string>(),
};

export function setHovered(slug: string | null) {
  if (journey.hoveredSlug === slug) return;
  journey.hoveredSlug = slug;
  journey.onHoverChange?.(slug);
  if (typeof document !== "undefined") {
    document.body.style.cursor = slug ? "pointer" : "";
  }
}
