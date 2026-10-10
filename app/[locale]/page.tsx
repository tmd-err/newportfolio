import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { featuredProjects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ExperienceLayer } from "@/features/experience/ExperienceLayer";
import { ProgressRail } from "@/components/navigation/ProgressRail";
import { RocketReturn } from "@/components/RocketReturn";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsIntroSection } from "@/components/sections/ProjectsIntroSection";
import { ProjectWorldSection } from "@/components/sections/ProjectWorldSection";
import { SupportingProjectsSection } from "@/components/sections/SupportingProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { CvSection } from "@/components/sections/CvSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ChatSection } from "@/components/sections/ChatSection";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteFooter } from "@/components/sections/SiteFooter";

const PROJECT_SIDES: Record<
  string,
  { side: "left" | "right"; valign: "top" | "center" | "bottom" }
> = {
  edtech: { side: "right", valign: "center" },
  crafthub: { side: "left", valign: "bottom" },
  velora: { side: "right", valign: "top" },
  autotrack: { side: "left", valign: "bottom" },
  facedetector: { side: "right", valign: "center" },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${profile.siteUrl}/#person`,
        name: profile.name,
        url: `${profile.siteUrl}/${locale}`,
        jobTitle: dict.hero.role,
        description: dict.hero.intro,
        email: profile.email ? `mailto:${profile.email}` : undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rabat",
          addressCountry: "MA",
        },
        knowsAbout: [
          "Full-Stack Web Development",
          "Web Application Development",
          "Frontend Development",
          "Backend Development",
          "React",
          "Next.js",
          "Laravel",
          "Node.js",
          "REST APIs",
          "Databases",
          "Mobile Application Development",
        ],
        sameAs: [profile.github, profile.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${profile.siteUrl}/#website`,
        url: profile.siteUrl,
        name: profile.name,
        description: dict.meta.description,
        inLanguage: ["en", "fr", "ar"],
        author: { "@id": `${profile.siteUrl}/#person` },
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExperienceLayer locale={locale} dict={dict} />
      <ProgressRail acts={acts} label={dict.nav.progressLabel} />
      <RocketReturn label={dict.nav.returnToLaunch} />

      <ChatWidget dict={dict.chat} />
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
            side={PROJECT_SIDES[p.slug]?.side ?? "left"}
            valign={PROJECT_SIDES[p.slug]?.valign ?? "center"}
            index={i}
          />
        ))}
        <SupportingProjectsSection dict={dict} locale={locale} />
        <SkillsSection dict={dict} />
        <JourneySection dict={dict} />
        <CvSection dict={dict} />
        <ContactSection dict={dict} locale={locale} />
        <ChatSection dict={dict} />
      </main>
      <SiteFooter dict={dict} />
    </div>
  );
}
