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
    accent: "#38bdf8",
    accentSoft: "#0ea5e9",
    scene: "panels",
    stack: ["Next.js", "Laravel", "PostgreSQL", "REST API"],
    links: { github: "https://github.com/tmd-err/EdTech" },
  },
  {
    slug: "crafthub",
    featured: true,
    accent: "#fb923c",
    accentSoft: "#f59e0b",
    scene: "market",
    stack: ["MongoDB", "Express", "React", "Node.js", "Docker"],
    links: { github: "https://github.com/tmd-err/Crafthub" },
  },
  {
    slug: "velora",
    featured: true,
    accent: "#c084fc",
    accentSoft: "#a855f7",
    scene: "luxury",
    stack: ["React", "Next.js", "Tailwind CSS"],
    links: { github: "https://github.com/tmd-err/Velora" },
  },
  {
    slug: "autotrack",
    featured: true,
    accent: "#34d399",
    accentSoft: "#10b981",
    scene: "network",
    stack: ["Laravel", "MySQL", "PHPUnit"],
    links: { github: "https://github.com/tmd-err/Autotrack" },
  },
  {
    slug: "facedetector",
    featured: true,
    accent: "#818cf8",
    accentSoft: "#6366f1",
    scene: "scanner",
    stack: ["Python", "OpenCV", "TensorFlow", "DeepFace"],
    links: { github: "https://github.com/tmd-err/FaceDetector" },
  },
  {
    slug: "scholvia",
    featured: false,
    accent: "#fbbf24",
    accentSoft: "#f59e0b",
    scene: "panels",
    stack: ["WordPress"],
    links: { private: true },
  },
  {
    slug: "autonova",
    featured: false,
    accent: "#f87171",
    accentSoft: "#ef4444",
    scene: "market",
    stack: ["React", "Laravel"],
    links: { private: true },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const supportingProjects = projects.filter((p) => !p.featured);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
