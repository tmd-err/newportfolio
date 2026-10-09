export type MilestoneId = "licence" | "skoda" | "dts" | "bac";

export type MilestoneKind = "education" | "experience";

export interface Milestone {
  id: MilestoneId;
  kind: MilestoneKind;
  /** sortable year marker used for ordering */
  order: number;
}

/** Ordered newest → oldest */
export const timeline: Milestone[] = [
  { id: "licence", kind: "education", order: 4 },
  { id: "skoda", kind: "experience", order: 3 },
  { id: "dts", kind: "education", order: 2 },
  { id: "bac", kind: "education", order: 1 },
];
