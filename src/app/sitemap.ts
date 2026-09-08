import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getStorefrontProducts } from "@/services/storefront/products";
import {
  getAllStorefrontSubCategories,
  getStorefrontCategorySlugs,
} from "@/services/storefront/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Core High-Priority Pages
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

  // 2. Dedicated Category & Discipline Routes (/shop/[slug])
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categorySlugs = await getStorefrontCategorySlugs();
    categoryRoutes = categorySlugs.map((cat) => ({
      url: `${SITE_URL}/shop/${cat.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (err) {
    console.error("Error generating category sitemap entries:", err);
  }

  // 3. Dynamic Product Pages (/shop/[slug])
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getStorefrontProducts();
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Error generating product sitemap entries:", err);
  }

  // 4. Dynamic Sub-Category & Capsule Query Routes (/shop?department=...&collection=...)
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const subCategories = await getAllStorefrontSubCategories();
    collectionRoutes = subCategories.map((col) => ({
      url: `${SITE_URL}${col.href}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Error generating collection sitemap entries:", err);
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...collectionRoutes,
  ];
}
