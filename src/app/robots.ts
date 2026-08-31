import type { MetadataRoute } from "next";

/**
 * Generates dynamic robots.txt rules for search engines.
 * Allows public storefront pages while completely shielding the admin portal from crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin", "/api/"],
    },
  };
}
