import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { SHOP_PRODUCTS } from "@/data/storefront";
import type { ProductItem } from "@/types/storefront";
import { formatEgpPrice } from "@/lib/formatting";
import { getImageValue, getPublicImageUrl } from "@/lib/supabase/storage";

/* -------------------------------------------------------------------------- */
/* Helpers for Normalizing Supabase Data to Storefront ProductItem            */
/* -------------------------------------------------------------------------- */

function normalizeDepartment(gender: string | null, parentSlug?: string | null): "men" | "women" | "accessories" {
  if (gender) {
    const g = gender.toLowerCase().trim();
    if (g.includes("women") || g === "female") return "women";
    if (g.includes("access") || g === "unisex" || g === "objects") return "accessories";
    if (g.includes("men") || g === "male") return "men";
  }
  if (parentSlug) {
    const p = parentSlug.toLowerCase().trim();
    if (p.includes("women")) return "women";
    if (p.includes("access") || p.includes("object")) return "accessories";
    if (p.includes("men")) return "men";
  }
  return "men";
}

function normalizeCategory(categoryNameOrSlug: string | null): string {
  if (!categoryNameOrSlug) return "outerwear";
  return categoryNameOrSlug.toLowerCase().trim();
}

function normalizeCollection(
  tags: string[] | null,
  categoryParentId?: string | null,
  categorySlug?: string | null,
  rawCollection?: string | null
): string | undefined {
  if (rawCollection && typeof rawCollection === "string" && rawCollection.trim()) {
    return rawCollection.toLowerCase().trim();
  }
  if (categoryParentId && categorySlug) {
    return categorySlug.toLowerCase().trim();
  }
  if (!tags || !Array.isArray(tags)) return undefined;
  const lowerTags = tags.map((t) => t.toLowerCase());
  for (const t of lowerTags) {
    if (t === "motion" || t === "shift" || t.includes("collection") || t.startsWith("col-")) {
      return t;
    }
  }
  return undefined;
}

function mapSupabaseRowToStorefrontProduct(
  supabase: ReturnType<typeof createAdminClient>,
  row: Record<string, unknown>,
  index: number,
  categoryMap?: Map<string, { id: string; name: string; slug: string; parent_id: string | null }>,
): ProductItem {
  const id = (row.id as string) || `prod-${index}`;
  const name = (row.name as string) || "UNTITLED PIECE";
  const slug = (row.slug as string) || `piece-${index + 1}`;
  const price = Number(row.price ?? 0);
  const salePrice = row.sale_price != null ? Number(row.sale_price) : null;

  // Resolve Category & Hierarchy
  let categoryName: string | null = null;
  let categorySlug: string | null = null;
  let categoryParentId: string | null = null;
  let categoryParentSlug: string | null = null;
  let categoryParentName: string | null = null;
  let categoryNameOrSlug: string | null = null;
  let categoryId: string | null = (row.category_id as string) || null;

  if (row.categories && typeof row.categories === "object") {
    const catObj = Array.isArray(row.categories)
      ? (row.categories[0] as Record<string, unknown>)
      : (row.categories as Record<string, unknown>);
    if (catObj && typeof catObj === "object") {
      categoryName = (catObj.name as string) ?? null;
      categorySlug = (catObj.slug as string) ?? null;
      categoryParentId = (catObj.parent_id as string | null) ?? null;
      categoryNameOrSlug = (catObj.slug as string) || (catObj.name as string) || null;
      if (!categoryId) categoryId = (catObj.id as string) ?? null;
    }
  }

  // Enrich with full categoryMap hierarchy
  if (categoryId && categoryMap && categoryMap.has(categoryId)) {
    const cat = categoryMap.get(categoryId)!;
    if (!categoryName) categoryName = cat.name;
    if (!categorySlug) categorySlug = cat.slug;
    if (!categoryParentId) categoryParentId = cat.parent_id;
    categoryNameOrSlug = categorySlug || categoryName;

    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      const parentCat = categoryMap.get(cat.parent_id)!;
      categoryParentSlug = parentCat.slug;
      categoryParentName = parentCat.name;
    } else if (!cat.parent_id) {
      categoryParentSlug = cat.slug;
      categoryParentName = cat.name;
    }
  }

  // Fallback if category has parent_id directly in row
  if (!categoryParentSlug && categoryParentId && categoryMap && categoryMap.has(categoryParentId)) {
    const parentCat = categoryMap.get(categoryParentId)!;
    categoryParentSlug = parentCat.slug;
    categoryParentName = parentCat.name;
  }

  const resolvedDeptSlug = categoryParentSlug || categorySlug;

  // Resolve Images
  let images: string[] = [];
  if (Array.isArray(row.product_images) && row.product_images.length > 0) {
    const sortedImages = [...(row.product_images as Record<string, unknown>[])].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    );

    images = sortedImages
      .map((img) => getPublicImageUrl(supabase, getImageValue(img)))
      .filter((img): img is string => Boolean(img));
  }

  // Fallback images if none attached
  if (images.length === 0) {
    images = [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop",
    ];
  }

  // Parse Stock & Sizes
  const rawStock = row.stock;
  let sizes: string[] = [];
  let stockData: { size: string; stock: number }[] = [];

  if (Array.isArray(rawStock) && rawStock.length > 0) {
    stockData = rawStock.map((s: Record<string, unknown>) => ({
      size: String(s.size || "ONE SIZE"),
      stock: Number(s.stock ?? 0),
    }));
    sizes = stockData.map((s) => s.size);
  } else if (rawStock && typeof rawStock === "object") {
    stockData = Object.entries(rawStock).map(([sz, qty]) => ({
      size: sz,
      stock: Number(qty ?? 0),
    }));
    sizes = stockData.map((s) => s.size);
  }

  if (sizes.length === 0) {
    sizes = ["XS", "S", "M", "L", "XL"];
    stockData = sizes.map((s) => ({ size: s, stock: 5 }));
  }

  const tags = Array.isArray(row.tags) ? (row.tags as string[]) : [];
  const editionNumber = String(index + 1).padStart(2, "0");

  const colorsList: string[] = [];
  if (typeof row.color === "string" && row.color.trim()) {
    colorsList.push(row.color.trim());
  } else {
    colorsList.push("Obsidian Black");
  }

  return {
    id,
    slug,
    code: (row.sku as string) || `EDITION ${editionNumber}`,
    sku: (row.sku as string) || `LVR-AW26-${editionNumber}`,
    name,
    department: normalizeDepartment(row.gender as string | null, resolvedDeptSlug),
    category: normalizeCategory(categoryNameOrSlug),
    collection: normalizeCollection(tags, categoryParentId, categorySlug, (row.collection as string) || null),
    product_type: (row.product_type as string) || "ATELIER EDITION",
    brand: (row.brand as string) || "LÉVARO ATELIER",
    gender: (row.gender as string) || "UNISEX",
    material: (row.material as string) || "SIGNATURE BESPOKE TEXTILE",
    fit: (row.fit as string) || "SCULPTURAL RELAXED FIT",
    silhouette: (row.fit as string) || "ARCHITECTURAL FIT",
    country_of_origin: (row.country_of_origin as string) || "HANDCRAFTED ATELIER",
    color: (row.color as string) || "Obsidian Black",
    colors: colorsList,
    price,
    priceFormatted: formatEgpPrice(price),
    sale_price: salePrice,
    salePriceFormatted: salePrice ? formatEgpPrice(salePrice) : null,
    is_active: Boolean(row.is_active ?? true),
    is_featured: Boolean(row.is_featured ?? false),
    is_new: Boolean(row.is_new ?? false),
    category_id: (row.category_id as string) || null,
    category_name: categoryName,
    category_slug: categorySlug,
    category_parent_id: categoryParentId,
    category_parent_slug: categoryParentSlug,
    category_parent_name: categoryParentName,
    short_description: (row.short_description as string) || (row.description as string) || "",
    description: (row.description as string) || (row.short_description as string) || "",
    stock: stockData,
    sizes,
    tags,
    images,
  };
}

/* -------------------------------------------------------------------------- */
/* Cached Storefront Data Queries (Minimized Requests)                        */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all active products for the storefront.
 * Cached via Next.js unstable_cache for 1 hour (3600 seconds).
 * Zero extra database calls when visitors filter or search on the client.
 */
export const getStorefrontProducts = unstable_cache(
  async (): Promise<ProductItem[]> => {
    try {
      const supabase = createAdminClient();

      const [{ data, error }, { data: allCategories }] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name,
              slug,
              parent_id
            ),
            product_images (
              id,
              image_url,
              is_primary,
              sort_order
            )
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, name, slug, parent_id"),
      ]);

      const categoryMap = new Map<string, { id: string; name: string; slug: string; parent_id: string | null }>();
      (allCategories || []).forEach((c) => {
        categoryMap.set(c.id, c);
      });

      if (error || !data || data.length === 0) {
        console.warn("Notice [getStorefrontProducts]: Supabase returned empty or error, falling back to mock catalog.");
        return SHOP_PRODUCTS;
      }

      return data.map((row, index) =>
        mapSupabaseRowToStorefrontProduct(supabase, row as Record<string, unknown>, index, categoryMap)
      );
    } catch (err) {
      console.error("Error in getStorefrontProducts:", err);
      return SHOP_PRODUCTS;
    }
  },
  ["storefront-all-products"],
  {
    revalidate: 3600,
    tags: ["storefront-products", "products"],
  },
);

/**
 * Fetches a single product by its slug for /shop/[slug].
 * Cached with individual product tags for instant response.
 */
export const getStorefrontProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductItem | null> => {
    try {
      const cleanSlug = decodeURIComponent(slug).trim();
      const supabase = createAdminClient();

      const [{ data, error }, { data: allCategories }] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name,
              slug,
              parent_id
            ),
            product_images (
              id,
              image_url,
              is_primary,
              sort_order
            )
          `)
          .eq("slug", cleanSlug)
          .eq("is_active", true)
          .maybeSingle(),
        supabase
          .from("categories")
          .select("id, name, slug, parent_id"),
      ]);

      const categoryMap = new Map<string, { id: string; name: string; slug: string; parent_id: string | null }>();
      (allCategories || []).forEach((c) => {
        categoryMap.set(c.id, c);
      });

      if (error || !data) {
        // Fallback to mock data if slug is found there
        const fallback = SHOP_PRODUCTS.find((p) => p.slug === cleanSlug);
        return fallback || null;
      }

      return mapSupabaseRowToStorefrontProduct(supabase, data as Record<string, unknown>, 0, categoryMap);
    } catch (err) {
      console.error(`Error in getStorefrontProductBySlug(${slug}):`, err);
      const fallback = SHOP_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }
  },
  ["storefront-product-detail"],
  {
    revalidate: 3600,
    tags: ["storefront-products", "products"],
  },
);

/**
 * Returns slugs of active products for generateStaticParams().
 */
export async function getStorefrontProductSlugs(): Promise<{ slug: string }[]> {
  try {
    const products = await getStorefrontProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
  }
}

/**
 * Intelligently recommends related atelier pieces based primarily on shared tags,
 * with secondary weighting on category, collection, and curated pairings.
 */
export function getRelatedProductsByTags(
  currentProduct: ProductItem,
  allProducts: ProductItem[],
  limit = 3
): ProductItem[] {
  const currentTags = new Set(
    (currentProduct.tags || []).map((t) => t.toLowerCase().trim()).filter(Boolean)
  );

  const scoredProducts = allProducts
    .filter((p) => p.id !== currentProduct.id && p.is_active !== false)
    .map((candidate) => {
      const candidateTags = (candidate.tags || [])
        .map((t) => t.toLowerCase().trim())
        .filter(Boolean);

      let matchingTagsCount = 0;
      for (const tag of candidateTags) {
        if (currentTags.has(tag)) {
          matchingTagsCount++;
        }
      }

      let affinityScore = matchingTagsCount * 10;

      // Category match affinity
      const isSameCategory =
        (candidate.category_id && candidate.category_id === currentProduct.category_id) ||
        (candidate.category_slug && candidate.category_slug.toLowerCase() === currentProduct.category_slug?.toLowerCase()) ||
        (candidate.category && candidate.category.toLowerCase() === currentProduct.category?.toLowerCase());
      if (isSameCategory) affinityScore += 4;

      // Collection match affinity
      if (candidate.collection && currentProduct.collection && candidate.collection.toLowerCase() === currentProduct.collection.toLowerCase()) {
        affinityScore += 3;
      }

      // Department/Gender match affinity
      const isSameDept =
        (candidate.department && candidate.department.toLowerCase() === currentProduct.department?.toLowerCase()) ||
        (candidate.gender && candidate.gender.toLowerCase() === currentProduct.gender?.toLowerCase());
      if (isSameDept) affinityScore += 2;

      // Explicit curated related product ID
      if (currentProduct.relatedProductIds?.includes(candidate.id)) {
        affinityScore += 25;
      }

      return {
        product: candidate,
        matchingTagsCount,
        affinityScore,
      };
    });

  // Sort primarily by matching tags count (descending), then by affinity score
  scoredProducts.sort((a, b) => {
    if (b.matchingTagsCount !== a.matchingTagsCount) {
      return b.matchingTagsCount - a.matchingTagsCount;
    }
    return b.affinityScore - a.affinityScore;
  });

  return scoredProducts.slice(0, limit).map((sp) => sp.product);
}

