export type ProjectSlug =
  | "edtech"
  | "crafthub"
  | "velora"
  | "autotrack"
  | "facedetector"
  | "scholvia"
  | "autonova";

export type ProjectScene =
  | "panels" // floating examination panels
  | "market" // architectural marketplace blocks
  | "luxury" // elegant product-inspired forms
  | "network" // interconnected locations grid
  | "scanner"; // computer-vision scanning rings

export interface Project {
  slug: ProjectSlug;
  /** Show in the cinematic 3D journey */
  featured: boolean;
  /** Visual identity of its world / card */
  accent: string;
  accentSoft: string;
  scene: ProjectScene;
  stack: string[];
  links: {
    github?: string;
    demo?: string;
    /** true → code available on request only */
    private?: boolean;
  };
}

export const projects: Project[] = [
  {
    slug: "edtech",
    featured: true,
    accent: "#4a8fb8", // Earth blue
    accentSoft: "#3a6f92",
    scene: "panels",
    stack: ["Next.js", "Laravel", "PostgreSQL", "REST API"],
    links: { github: "https://github.com/tmd-err/EdTech" },
  },
  {
    slug: "crafthub",
    featured: true,
    accent: "#b0653f", // Mars rust
    accentSoft: "#7a4a33",
    scene: "market",
    stack: ["MongoDB", "Express", "React", "Node.js", "Docker"],
    links: { github: "https://github.com/tmd-err/Crafthub" },
  },
  {
    slug: "velora",
    featured: true,
    accent: "#c8a06a", // Jupiter ochre
    accentSoft: "#96754a",
    scene: "luxury",
    stack: ["React", "Next.js", "Tailwind CSS"],
    links: { github: "https://github.com/tmd-err/Velora" },
  },
  {
    slug: "autotrack",
    featured: true,
    accent: "#c9bb95", // Saturn gold
    accentSoft: "#9a8f6f",
    scene: "network",
    stack: ["Laravel", "MySQL", "PHPUnit"],
    links: { github: "https://github.com/tmd-err/Autotrack" },
  },
  {
    slug: "facedetector",
    featured: true,
    accent: "#8fc3c9", // Uranus cyan
    accentSoft: "#6a99a0",
    scene: "scanner",
    stack: ["Python", "OpenCV", "TensorFlow", "DeepFace"],
    links: { github: "https://github.com/tmd-err/FaceDetector" },
  },
  {
    slug: "scholvia",
    featured: false,
    accent: "#8a8f96",
    accentSoft: "#666c73",
    scene: "panels",
    stack: ["WordPress"],
    links: { private: true },
  },
  {
    slug: "autonova",
    featured: false,
    accent: "#6f8790",
    accentSoft: "#52666e",
    scene: "market",
    stack: ["React", "Laravel"],
    links: { private: true },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const supportingProjects = projects.filter((p) => !p.featured);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
