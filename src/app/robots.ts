import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Generates dynamic robots.txt rules for search engines.
 * Allows public storefront pages and products while shielding the admin portal and internal APIs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
