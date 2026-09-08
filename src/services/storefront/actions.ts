"use server";
import type { ProductItem } from "@/types/storefront";
import { getStorefrontProducts } from "@/services/storefront/products";

export interface StorefrontPaginationParams {
  page?: number;
  limit?: number;
  department?: string;
  category?: string;
  collection?: string;
  fit?: string;
  color?: string;
  priceIndex?: number;
  sort?: string;
  query?: string;
}

export interface StorefrontPaginatedResult {
  products: ProductItem[];
  totalCount: number;
  page: number;
  hasMore: boolean;
}

const PRICE_RANGES = [
  { label: "ALL PRICES", min: 0, max: Infinity },
  { label: "UNDER EGP 3,000", min: 0, max: 3000 },
  { label: "EGP 3,000 – EGP 6,000", min: 3000, max: 6000 },
  { label: "OVER EGP 6,000", min: 6000, max: Infinity },
];

/**
 * Server Action: Fetches a paginated slice of products based on active filters and page index.
 * Scales seamlessly to 1,000+ products by querying only the requested range.
 */
export async function fetchStorefrontProductsAction(
  params: StorefrontPaginationParams = {}
): Promise<StorefrontPaginatedResult> {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Number(params.limit || 9));
  const department = params.department || "all";
  const category = params.category || "all";
  const collection = params.collection || "all";
  const fit = params.fit || "all";
  const color = params.color || "all";
  const priceIndex = Number(params.priceIndex || 0);
  const sort = params.sort || "curated";
  const query = (params.query || "").trim().toLowerCase();

  try {
    // 1. Fetch from cached full products list (cached via Next.js unstable_cache)
    // This leverages the warm memory cache while only shipping the 9 requested items over the network
    const allProducts = await getStorefrontProducts();

    const priceRange = PRICE_RANGES[priceIndex] || PRICE_RANGES[0];

    // Filter products
    const filtered = allProducts.filter((product) => {
      if (product.is_active === false) return false;

      // Department filter
      if (department !== "all") {
        const dLower = department.toLowerCase();
        const matchesDept =
          (product.department && product.department.toLowerCase() === dLower) ||
          (product.category_parent_slug && product.category_parent_slug.toLowerCase() === dLower) ||
          (product.category_parent_name && product.category_parent_name.toLowerCase() === dLower) ||
          (product.category_slug && product.category_slug.toLowerCase() === dLower) ||
          (product.category_id && product.category_id.toLowerCase() === dLower) ||
          (product.category_parent_id && product.category_parent_id.toLowerCase() === dLower);
        if (!matchesDept) return false;
      }

      // Category filter
      if (category !== "all") {
        const catLower = category.toLowerCase();
        const matchesCat =
          (product.category && product.category.toLowerCase() === catLower) ||
          (product.category_slug && product.category_slug.toLowerCase() === catLower) ||
          (product.category_id && product.category_id.toLowerCase() === catLower) ||
          (product.category_name && product.category_name.toLowerCase() === catLower);
        if (!matchesCat) return false;
      }

      // Collection filter
      if (collection !== "all") {
        const colLower = collection.toLowerCase();
        const matchesCol =
          (product.collection && product.collection.toLowerCase() === colLower) ||
          (product.category_slug && product.category_slug.toLowerCase() === colLower) ||
          (product.category_id && product.category_id.toLowerCase() === colLower) ||
          (product.category_name && product.category_name.toLowerCase() === colLower) ||
          (product.tags || []).some((t) => t.toLowerCase() === colLower);
        if (!matchesCol) return false;
      }

      // Fit filter
      if (fit !== "all") {
        const fLower = fit.toLowerCase();
        const matchesFit =
          (product.fit && (product.fit.toLowerCase().includes(fLower) || fLower.includes(product.fit.toLowerCase()))) ||
          (product.silhouette && (product.silhouette.toLowerCase().includes(fLower) || fLower.includes(product.silhouette.toLowerCase()))) ||
          (product.tags || []).some((t) => t.toLowerCase().includes(fLower) || fLower.includes(t.toLowerCase()));
        if (!matchesFit) return false;
      }

      // Color filter
      if (color !== "all") {
        const cLower = color.toLowerCase();
        const matchesColor =
          (product.color && (product.color.toLowerCase().includes(cLower) || cLower.includes(product.color.toLowerCase()))) ||
          (product.colors || []).some((c) => c.toLowerCase().includes(cLower) || cLower.includes(c.toLowerCase()));
        if (!matchesColor) return false;
      }

      // Price range filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      // Search query filter
      if (query) {
        const haystack = `${product.name} ${product.code} ${product.material} ${product.silhouette} ${product.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "code") return a.code.localeCompare(b.code);
      return 0; // curated preserves default atelier sequence
    });

    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + paginatedProducts.length < totalCount;

    return {
      products: paginatedProducts,
      totalCount,
      page,
      hasMore,
    };
  } catch (error) {
    console.error("Error in fetchStorefrontProductsAction:", error);
    return {
      products: [],
      totalCount: 0,
      page,
      hasMore: false,
    };
  }
}

/**
 * Server Action: Fast Live Search for Command Palette across all active archive pieces.
 */
export async function searchStorefrontProductsAction(
  query: string = "",
  limit: number = 8
): Promise<ProductItem[]> {
  try {
    const allProducts = await getStorefrontProducts();
    const clean = query.trim().toLowerCase();

    if (!clean) {
      return allProducts.filter((p) => p.is_active !== false).slice(0, limit);
    }

    return allProducts
      .filter((p) => {
        if (p.is_active === false) return false;
        const haystack = `${p.name} ${p.code} ${p.sku || ""} ${p.material || ""} ${p.department || ""} ${p.category || ""} ${p.collection || ""} ${p.silhouette || ""} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
        return haystack.includes(clean);
      })
      .slice(0, limit);
  } catch (err) {
    console.error("Error in searchStorefrontProductsAction:", err);
    return [];
  }
}

