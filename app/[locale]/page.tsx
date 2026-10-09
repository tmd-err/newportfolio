import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { featuredProjects } from "@/data/projects";
import { ExperienceLayer } from "@/features/experience/ExperienceLayer";
import { ProgressRail } from "@/components/navigation/ProgressRail";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsIntroSection } from "@/components/sections/ProjectsIntroSection";
import { ProjectWorldSection } from "@/components/sections/ProjectWorldSection";
import { SupportingProjectsSection } from "@/components/sections/SupportingProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { CvSection } from "@/components/sections/CvSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/sections/SiteFooter";

const PROJECT_SIDES: Record<string, "left" | "right"> = {
  edtech: "left",
  crafthub: "right",
  velora: "left",
  autotrack: "right",
  facedetector: "left",
};

export default function Page({ params }: PageProps<"/[locale]">) {
  return (
    <Suspense fallback={null}>
      <Journey params={params} />
    </Suspense>
  );
}

async function Journey({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = await getDictionary(locale);

  const acts = [
    { id: "hero", label: "00" },
    { id: "about", label: dict.nav.about },
    { id: "projects", label: dict.nav.projects },
    { id: "skills", label: dict.nav.skills },
    { id: "journey", label: dict.nav.journey },
    { id: "cv", label: dict.nav.cv },
    { id: "contact", label: dict.nav.contact },
  ];

  return (
    <div id="journey-scroll">
      <ExperienceLayer locale={locale} dict={dict} />
      <ProgressRail acts={acts} label={dict.nav.progressLabel} />

      <main id="content" className="relative z-10">
        <HeroSection dict={dict} />
        <AboutSection dict={dict} />
        <ProjectsIntroSection dict={dict} />
        {featuredProjects.map((p, i) => (
          <ProjectWorldSection
            key={p.slug}
            project={p}
            dict={dict}
            locale={locale}
            side={PROJECT_SIDES[p.slug] ?? "left"}
            index={i}
          />
        ))}
        <SupportingProjectsSection dict={dict} locale={locale} />
        <SkillsSection dict={dict} />
        <JourneySection dict={dict} />
        <CvSection dict={dict} />
        <ContactSection dict={dict} locale={locale} />
      </main>
      <SiteFooter dict={dict} />
    </div>
  );
}
