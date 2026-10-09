import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getProject, projects } from "@/data/projects";
import type { ProjectSlug } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function Page({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = await getDictionary(locale);
  const project = getProject(slug);
  if (!project) return {};
  const copy = dict.projects.items[project.slug];

  return {
    title: copy.name,
    description: copy.summary,
    alternates: {
      canonical: `/${locale}/projects/${project.slug}`,
      languages: {
        en: `/en/projects/${project.slug}`,
        fr: `/fr/projects/${project.slug}`,
        ar: `/ar/projects/${project.slug}`,
      },
    },
  };
}

async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const dict = await getDictionary(locale);

  const project = getProject(slug);
  if (!project) notFound();
  const copy = dict.projects.items[project.slug as ProjectSlug];
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <main id="content" className="relative z-10 min-h-svh">
      {/* ambient backdrop — CSS stands in for the 3D scene here */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(55% 45% at 75% 15%, ${project.accent}22, transparent 65%), radial-gradient(40% 35% at 15% 80%, ${project.accentSoft}14, transparent 60%), #050816`,
        }}
      />

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-10">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
          {dict.projectPage.back}
        </Link>

        <header className="mt-10">
          <div className="flex items-center gap-3">
            <span
              className="size-3 rounded-full"
              style={{
                background: project.accent,
                boxShadow: `0 0 18px ${project.accent}`,
              }}
              aria-hidden
            />
            <p className="kicker">{copy.kicker}</p>
          </div>
          <h1
            className="font-display mt-4 text-5xl font-bold tracking-tight text-ink sm:text-7xl"
            style={{ textShadow: `0 0 60px ${project.accent}44` }}
          >
            {copy.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">
            {copy.summary}
          </p>
          {copy.role && (
            <p className="mt-3 text-sm font-medium" style={{ color: project.accent }}>
              {copy.role}
            </p>
          )}
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section aria-labelledby="overview">
            <h2 id="overview" className="kicker">
              {dict.projectPage.overview}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-mist">
              {copy.description}
            </p>

            <h2 className="kicker mt-10">{dict.projectPage.features}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {copy.features.map((f) => (
                <li
                  key={f}
                  className="panel flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-ink"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: project.accent }}
                    aria-hidden
                  />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-8">
            <section aria-labelledby="stack">
              <h2 id="stack" className="kicker">
                {dict.projectPage.stack}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="chip !text-[0.8rem]"
                    style={{ borderColor: `${project.accent}44` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section aria-labelledby="links">
              <h2 id="links" className="kicker">
                {dict.projectPage.links}
              </h2>
              <div className="mt-4 space-y-2.5">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan/40"
                  >
                    <GithubIcon className="size-4 text-cyan" />
                    {dict.projectPage.github}
                    <ArrowUpRight className="ms-auto size-4 text-dim" aria-hidden />
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan/40"
                  >
                    <ExternalLink className="size-4 text-cyan" aria-hidden />
                    {dict.projects.demo}
                    <ArrowUpRight className="ms-auto size-4 text-dim" aria-hidden />
                  </a>
                )}
                {project.links.private && (
                  <p className="panel flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed text-mist">
                    <Lock className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
                    {dict.projectPage.privateNote}
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="others">
          <h2 id="others" className="kicker">
            {dict.projectPage.otherProjects}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((p) => {
              const oc = dict.projects.items[p.slug];
              return (
                <Link
                  key={p.slug}
                  href={`/${locale}/projects/${p.slug}`}
                  className="panel group rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: p.accent,
                      boxShadow: `0 0 10px ${p.accent}`,
                    }}
                    aria-hidden
                  />
                  <h3 className="font-display mt-3 font-bold text-ink">
                    {oc.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dim">
                    {oc.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
