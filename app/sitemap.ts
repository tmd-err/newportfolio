import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${base}/${locale}`,
      changeFrequency: "monthly",
      priority: 1,
    });
    for (const p of projects) {
      entries.push({
        url: `${base}/${locale}/projects/${p.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
