export const cn = (
  ...classes: (string | false | null | undefined)[]
): string => classes.filter(Boolean).join(" ");

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const smoothstep = (t: number) => t * t * (3 - 2 * t);
