import type { ProjectSlug } from "@/data/projects";
import type { SkillCategory } from "@/data/skills";
import type { MilestoneId } from "@/data/timeline";

export interface ProjectCopy {
  name: string;
  kicker: string;
  summary: string;
  description: string;
  features: string[];
  role?: string;
}

export interface MilestoneCopy {
  title: string;
  org: string;
  period: string;
  summary: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    projects: string;
    skills: string;
    journey: string;
    cv: string;
    contact: string;
    downloadCv: string;
    openMenu: string;
    closeMenu: string;
    languageSwitcher: string;
    progressLabel: string;
    returnToLaunch: string;
    skipIntro: string;
  };
  hero: {
    availability: string;
    role: string;
    intro: string;
    ctaExplore: string;
    ctaProjects: string;
    ctaCv: string;
    scrollHint: string;
  };
  about: {
    label: string;
    heading: string;
    lead: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  projects: {
    label: string;
    heading: string;
    intro: string;
    supportingHeading: string;
    supportingIntro: string;
    viewProject: string;
    github: string;
    demo: string;
    privateLabel: string;
    nextLabel: string;
    items: Record<ProjectSlug, ProjectCopy>;
  };
  skills: {
    label: string;
    heading: string;
    intro: string;
    groups: Record<SkillCategory, { title: string; blurb: string }>;
  };
  journey: {
    label: string;
    heading: string;
    intro: string;
    education: string;
    experience: string;
    items: Record<MilestoneId, MilestoneCopy>;
  };
  cv: {
    label: string;
    heading: string;
    text: string;
    download: string;
    open: string;
  };
  contact: {
    label: string;
    heading: string;
    intro: string;
    availability: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    formTitle: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSend: string;
    formHint: string;
    closing: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  projectPage: {
    overview: string;
    stack: string;
    features: string;
    links: string;
    github: string;
    privateNote: string;
    back: string;
    otherProjects: string;
  };
  a11y: {
    skipToContent: string;
    sceneAlt: string;
  };
  notFound: {
    title: string;
    text: string;
    cta: string;
  };
}
