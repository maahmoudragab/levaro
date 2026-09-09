import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getStorefrontProducts } from "@/services/storefront/products";
import { getStorefrontCategorySlugs } from "@/services/storefront/categories";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (
    entry: MetadataRoute.Sitemap[number],
  ) => {
    const cleanUrl = entry.url
      .trim()
      .replace(/\/+$/, "");

    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);

      entries.push({
        ...entry,
        url: cleanUrl,
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /* 1. Core public pages                                                     */
  /* ------------------------------------------------------------------------ */

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/new-arrivals`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  staticRoutes.forEach(addEntry);

  /* ------------------------------------------------------------------------ */
  /* 2. Dynamic categories                                                    */
  /* ------------------------------------------------------------------------ */

  try {
    const categorySlugs =
      await getStorefrontCategorySlugs();

    for (const category of categorySlugs) {
      const slug = category.slug
        ?.trim()
        .toLowerCase();

      if (!slug) continue;

      addEntry({
        url: `${SITE_URL}/shop/${encodeURIComponent(slug)}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch (error) {
    console.error(
      "Error generating category sitemap entries:",
      error,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* 3. Dynamic products                                                      */
  /* ------------------------------------------------------------------------ */

  try {
    const products =
      await getStorefrontProducts();

    for (const product of products) {
      const slug = product.slug
        ?.trim()
        .toLowerCase();

      if (!slug) continue;

      addEntry({
        url: `${SITE_URL}/shop/${encodeURIComponent(slug)}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  } catch (error) {
    console.error(
      "Error generating product sitemap entries:",
      error,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* 4. Return unique canonical URLs                                          */
  /* ------------------------------------------------------------------------ */

  return entries;
}