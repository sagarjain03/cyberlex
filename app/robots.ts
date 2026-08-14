import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No crawlable content behind the API, and the summarize route is a POST
      // endpoint that should never appear in an index.
      disallow: "/api/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
