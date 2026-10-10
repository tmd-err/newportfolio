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
    accent: "#8fc3c9",
    items: ["JavaScript", "TypeScript", "PHP", "Python", "Java"],
  },
  {
    id: "frontend",
    accent: "#4a8fb8",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "shadcn/ui"],
  },
  {
    id: "backend",
    accent: "#b0653f",
    items: ["Laravel", "Node.js", "Express.js"],
  },
  {
    id: "data",
    accent: "#5f8a86",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL", "NoSQL"],
  },
  {
    id: "architecture",
    accent: "#c9bb95",
    items: ["REST API", "MVC", "OOP", "Microservices", "Agile"],
  },
  {
    id: "tools",
    accent: "#a9bcc4",
    items: ["Git", "GitHub", "Docker", "CI/CD", "Postman", "Figma"],
  },
];

export const allSkills = skillGroups.flatMap((g) => g.items);
