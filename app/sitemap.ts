import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants/site";
import { getAiCrimeSlugs, getJurisdictionCodes } from "@/lib/data";

/** Generated from the route map and the data layer — never hand-maintained. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [codes, slugs] = await Promise.all([
    getJurisdictionCodes(),
    getAiCrimeSlugs(),
  ]);

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/compare", priority: 0.9 },
    { path: "/tracker", priority: 0.9 },
    { path: "/ai-crimes", priority: 0.9 },
    { path: "/assistant", priority: 0.8 },
    { path: "/methodology", priority: 0.7 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE.url}${r.path}`,
      changeFrequency: "weekly" as const,
      priority: r.priority,
    })),
    ...codes.map((code) => ({
      url: `${SITE.url}/jurisdictions/${code.toLowerCase()}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...slugs.map((slug) => ({
      url: `${SITE.url}/ai-crimes/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
