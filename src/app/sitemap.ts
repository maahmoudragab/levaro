import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getStorefrontProducts } from "@/services/storefront/products";
import { getStorefrontCategorySlugs } from "@/services/storefront/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    const cleanUrl = entry.url.trim();
    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);
      entries.push({
        ...entry,
        url: cleanUrl,
      });
    }
  };

  // 1. Core High-Priority Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
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
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  staticRoutes.forEach(addEntry);

  // 2. Dedicated Canonical Category Routes (/shop/[slug])
  try {
    const categorySlugs = await getStorefrontCategorySlugs();
    for (const cat of categorySlugs) {
      if (cat.slug) {
        addEntry({
          url: `${SITE_URL}/shop/${encodeURIComponent(cat.slug.toLowerCase().trim())}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }
    }
  } catch (err) {
    console.error("Error generating category sitemap entries:", err);
  }

  // 3. Dynamic Product Canonical Pages (/shop/[slug])
  try {
    const products = await getStorefrontProducts();
    for (const product of products) {
      if (product.slug) {
        addEntry({
          url: `${SITE_URL}/shop/${encodeURIComponent(product.slug.trim())}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.error("Error generating product sitemap entries:", err);
  }

  return entries;
}
