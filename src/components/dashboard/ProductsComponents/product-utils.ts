import type { Product } from "@/app/services/admin/products";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const PRODUCTS_PER_PAGE = 10;
export const LOW_STOCK_THRESHOLD = 10;

/* Standard fashion apparel size ordering */
const SIZE_ORDER = [
  "XXXS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "XXXXL",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProductFilterState = {
  category: string;
  color: string;
  gender: string;
  brand: string;
  fit: string;
  stockStatus: string;
  activeFilter: string;
  featuredFilter: string;
  newFilter: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  saleOnly: boolean;
};

export const DEFAULT_PRODUCT_FILTERS: ProductFilterState = {
  category: "All Categories",
  color: "All Colors",
  gender: "All Genders",
  brand: "All Brands",
  fit: "All Fits",
  stockStatus: "All Stock",
  activeFilter: "All",
  featuredFilter: "All",
  newFilter: "All",
  sort: "newest",
  minPrice: "",
  maxPrice: "",
  saleOnly: false,
};

/* -------------------------------------------------------------------------- */
/* Stock & Size Helpers                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Calculates total available stock units across all sizes for a product.
 */
export function getTotalStock(product: Product): number {
  return (product.stock ?? []).reduce(
    (total, item) => total + Number(item.stock ?? 0),
    0,
  );
}

/**
 * Returns formatted stock status information for UI badges.
 */
export function getStockInfo(product: Product): { label: string } {
  const total = getTotalStock(product);

  if (total === 0) {
    return { label: "Out of stock" };
  }

  if (total <= LOW_STOCK_THRESHOLD) {
    return { label: `Low stock ${total}` };
  }

  return { label: `In stock ${total}` };
}

/**
 * Compares two size labels for sorting (e.g. S < M < L < XL or numeric sizes 32 < 34).
 */
export function compareSizes(a: string, b: string): number {
  const normalizedA = a.trim().toUpperCase();
  const normalizedB = b.trim().toUpperCase();

  const indexA = SIZE_ORDER.indexOf(normalizedA);
  const indexB = SIZE_ORDER.indexOf(normalizedB);

  if (indexA !== -1 || indexB !== -1) {
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }

  const numberA = Number(normalizedA);
  const numberB = Number(normalizedB);

  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    return numberA - numberB;
  }

  return normalizedA.localeCompare(normalizedB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

/**
 * Formats ISO date string into a user-friendly relative representation.
 */
export function formatRelativeDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
}

/* -------------------------------------------------------------------------- */
/* Filter Helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Extracts unique non-empty string values from product list for filter dropdowns.
 */
function uniqueValues(
  products: Product[],
  getValue: (product: Product) => string | null,
): string[] {
  const values = products
    .map(getValue)
    .filter((value): value is string => Boolean(value?.trim()));

  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

/**
 * Generates dynamic filter options based on the available product collection.
 */
export function getFilterOptions(products: Product[]) {
  return {
    categories: [
      "All Categories",
      ...uniqueValues(products, (product) => product.category_name),
    ],
    colors: [
      "All Colors",
      ...uniqueValues(products, (product) => product.color),
    ],
    genders: [
      "All Genders",
      ...uniqueValues(products, (product) => product.gender),
    ],
    brands: [
      "All Brands",
      ...uniqueValues(products, (product) => product.brand),
    ],
    fits: ["All Fits", ...uniqueValues(products, (product) => product.fit)],
  };
}

/**
 * Filters and sorts the product collection according to active search query and filter criteria.
 */
export function filterProducts(
  products: Product[],
  search: string,
  filters: ProductFilterState,
): Product[] {
  const query = search.trim().toLowerCase();

  return products
    .filter((product) => {
      const price = product.sale_price ?? product.price;
      const totalStock = getTotalStock(product);

      // Search query match (by name, SKU, or ID)
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku ?? "").toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

      // Attribute filters
      const matchCategory =
        filters.category === "All Categories" ||
        product.category_name === filters.category;
      const matchColor =
        filters.color === "All Colors" || product.color === filters.color;
      const matchGender =
        filters.gender === "All Genders" || product.gender === filters.gender;
      const matchBrand =
        filters.brand === "All Brands" || product.brand === filters.brand;
      const matchFit =
        filters.fit === "All Fits" || product.fit === filters.fit;

      // Status filters
      const matchActive =
        filters.activeFilter === "All" ||
        (filters.activeFilter === "Active"
          ? product.is_active
          : !product.is_active);

      const matchFeatured =
        filters.featuredFilter === "All" ||
        (filters.featuredFilter === "Featured"
          ? product.is_featured
          : !product.is_featured);

      const matchNew =
        filters.newFilter === "All" ||
        (filters.newFilter === "New" ? product.is_new : !product.is_new);

      // Pricing & stock availability filters
      const matchSale = !filters.saleOnly || product.sale_price !== null;
      const matchMinPrice =
        filters.minPrice === "" || price >= Number(filters.minPrice);
      const matchMaxPrice =
        filters.maxPrice === "" || price <= Number(filters.maxPrice);

      const matchStock =
        filters.stockStatus === "All Stock" ||
        (filters.stockStatus === "In Stock" &&
          totalStock > LOW_STOCK_THRESHOLD) ||
        (filters.stockStatus === "Low Stock" &&
          totalStock > 0 &&
          totalStock <= LOW_STOCK_THRESHOLD) ||
        (filters.stockStatus === "Out of Stock" && totalStock === 0);

      return (
        matchSearch &&
        matchCategory &&
        matchColor &&
        matchGender &&
        matchBrand &&
        matchFit &&
        matchActive &&
        matchFeatured &&
        matchNew &&
        matchSale &&
        matchMinPrice &&
        matchMaxPrice &&
        matchStock
      );
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (a.sale_price ?? a.price) - (b.sale_price ?? b.price);
        case "price-high":
          return (b.sale_price ?? b.price) - (a.sale_price ?? a.price);
        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
}
