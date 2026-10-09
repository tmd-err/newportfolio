export type SkillCategory =
  | "languages"
  | "frontend"
  | "backend"
  | "data"
  | "architecture"
  | "tools";

export interface SkillGroup {
  id: SkillCategory;
  items: string[];
  /** accent color used in the 3D constellation + UI chips */
  accent: string;
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    accent: "#38bdf8",
    items: ["JavaScript", "TypeScript", "PHP", "Python", "Java"],
  },
  {
    id: "frontend",
    accent: "#22d3ee",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "shadcn/ui"],
  },
  {
    id: "backend",
    accent: "#fb923c",
    items: ["Laravel", "Node.js", "Express.js"],
  },
  {
    id: "data",
    accent: "#34d399",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL", "NoSQL"],
  },
  {
    id: "architecture",
    accent: "#c084fc",
    items: ["REST API", "MVC", "OOP", "Microservices", "Agile"],
  },
  {
    id: "tools",
    accent: "#fbbf24",
    items: ["Git", "GitHub", "Docker", "CI/CD", "Postman", "Figma"],
  },
];

export const allSkills = skillGroups.flatMap((g) => g.items);
