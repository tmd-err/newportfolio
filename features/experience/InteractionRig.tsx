"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journey, setHovered } from "./journey-store";

/**
 * Centralized pointer interaction: one raycaster against registered
 * interactable groups. Pointer coords arrive via journey.ndcX/Y (written
 * by ExperienceLayer's window listener — the canvas sits behind the DOM
 * overlay, so it cannot receive pointer events itself).
 *
 * Hover → gentle lift/lighting handled inside each InstallationShell.
 * Click on empty space while hovering → SPA navigation to the project.
 */
// module-level scratch — only one InteractionRig mounts at a time
let lastProgress = -1;

export function InteractionRig() {
  const { camera } = useThree();
  const raycaster = useMemo(() => {
    const r = new THREE.Raycaster();
    r.far = 70;
    return r;
  }, []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  // click-to-open: only when the click didn't land on interactive DOM
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.closest("a,button,input,textarea,select,[role='button'],nav,header,footer")) {
        return;
      }
      if (journey.hoveredSlug && journey.navigate) {
        journey.navigate(`/${journey.locale}/projects/${journey.hoveredSlug}`);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useFrame(() => {
    // re-raycast when the camera moves under a stationary cursor too
    if (Math.abs(journey.progress - lastProgress) > 0.002) {
      journey.pointerDirty = true;
      lastProgress = journey.progress;
    }
    if (!journey.pointerDirty) return;
    journey.pointerDirty = false;
    if (journey.interactables.size === 0) {
      setHovered(null);
      return;
    }
    ndc.set(journey.ndcX, journey.ndcY);
    raycaster.setFromCamera(ndc, camera);
    const roots = [...journey.interactables.keys()].filter((o) => o.parent);
    const hits = raycaster.intersectObjects(roots, true);
    if (hits.length === 0) {
      setHovered(null);
      return;
    }
    // walk up to the registered root
    let obj: THREE.Object3D | null = hits[0].object;
    let slug: string | null = null;
    while (obj) {
      const found = journey.interactables.get(obj);
      if (found) {
        slug = found;
        break;
      }
      obj = obj.parent;
    }
    setHovered(slug);
  });

  return null;
}
