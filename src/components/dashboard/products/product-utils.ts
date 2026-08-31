import type { Product } from "@/app/services/admin/products";

/* -------------------------------------------------------------------------- */
/* Fashion Constants & Presets (Shared across Create/Edit & Filters)          */
/* -------------------------------------------------------------------------- */

export const PRODUCTS_PER_PAGE = 10;
export const LOW_STOCK_THRESHOLD = 10;

export const GENDERS = ["Men", "Women", "Kids", "Unisex"];

export const BRANDS = [
  "LÉVARO",
  "LÉVARO Atelier",
  "LÉVARO Studio",
  "LÉVARO Sport",
  "LÉVARO Noir",
];

export const PRODUCT_TYPES = [
  "T-Shirt",
  "Oversized Tee",
  "Polo Shirt",
  "Hoodie",
  "Sweatshirt",
  "Overshirt",
  "Button-Up Shirt",
  "Knitwear",
  "Jacket",
  "Blazer",
  "Trousers",
  "Denim Jeans",
  "Shorts",
  "Suit",
  "Accessories",
  "Footwear",
];

export const FITS = [
  "Regular Fit",
  "Slim Fit",
  "Relaxed Fit",
  "Oversized Fit",
  "Boxy Fit",
  "Tailored Fit",
  "Athletic Fit",
  "Wide Leg",
];

export const COLORS = [
  // Monochrome & Neutrals
  { name: "Black", hex: "#121212" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Off-White", hex: "#F5F5F0" },
  { name: "Ivory / Cream", hex: "#FFFDD0" },
  { name: "Charcoal Grey", hex: "#374151" },
  { name: "Heather Grey", hex: "#9CA3AF" },
  { name: "Light Grey", hex: "#E5E7EB" },

  // Earth Tones & Browns
  { name: "Beige / Sand", hex: "#D4B996" },
  { name: "Taupe", hex: "#8B8589" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Caramel", hex: "#AF6F37" },
  { name: "Chocolate Brown", hex: "#4A2C11" },
  { name: "Espresso", hex: "#2B1B17" },
  { name: "Mocha", hex: "#7A4B3A" },
  { name: "Terracotta / Rust", hex: "#C85A32" },

  // Blues & Denim
  { name: "Midnight Navy", hex: "#0F172A" },
  { name: "Classic Navy", hex: "#1E3A8A" },
  { name: "Royal Blue", hex: "#2563EB" },
  { name: "Denim Blue", hex: "#3B82F6" },
  { name: "Sky Blue", hex: "#7DD3FC" },
  { name: "Baby Blue", hex: "#BAE6FD" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Teal", hex: "#0D9488" },

  // Greens & Olives
  { name: "Forest Green", hex: "#18694F" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Emerald Green", hex: "#046307" },
  { name: "Dark Moss", hex: "#3E4A35" },
  { name: "Mint Green", hex: "#98FF98" },

  // Reds, Pinks & Purples
  { name: "Burgundy", hex: "#800020" },
  { name: "Crimson Red", hex: "#DC2626" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Dusty Rose", hex: "#DCAE96" },
  { name: "Blush Pink", hex: "#F8B8D0" },
  { name: "Plum / Violet", hex: "#4A0E4E" },
  { name: "Lavender", hex: "#E6E6FA" },

  // Warm & Accents
  { name: "Mustard Yellow", hex: "#E1AD01" },
  { name: "Amber Gold", hex: "#FFBF00" },
  { name: "Sunset Orange", hex: "#EA580C" },
];

export const MATERIALS = [
  "100% Egyptian Cotton",
  "Heavyweight Cotton (240+ GSM)",
  "French Terry",
  "Linen Blend",
  "100% Pure Linen",
  "Wool & Cashmere",
  "Merino Wool",
  "Raw Denim",
  "Silk Satin",
  "Tech Fleece",
];

export const ORIGINS = [
  "Egypt",
  "Italy",
  "Portugal",
  "Turkey",
  "France",
  "Spain",
  "United Kingdom",
];

export const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const PRESET_TAGS = [
  "Summer Collection",
  "Winter Collection",
  "Essential",
  "Minimalist",
  "Luxury",
  "Streetwear",
  "Formal",
  "Casual",
  "Oversized",
  "Organic Cotton",
  "100% Linen",
  "Pure Silk",
  "Limited Edition",
  "Best Seller",
  "Trending",
];

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

export type CategoryOption = {
  id: string;
  name: string;
  slug?: string | null;
  parent_id?: string | null;
  is_active?: boolean;
};

export type ProductFilterState = {
  category: string;
  collection: string;
  gender: string;
  product_type: string;
  fit: string;
  color: string;
  material: string;
  brand: string;
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
  collection: "All Collections",
  gender: "All Genders",
  product_type: "All Types",
  fit: "All Fits",
  color: "All Colors",
  material: "All Materials",
  brand: "All Brands",
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

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }

  const numA = parseFloat(normalizedA);
  const numB = parseFloat(normalizedB);
  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }

  return normalizedA.localeCompare(normalizedB);
}

/**
 * Formats a raw ISO date string into a user-friendly relative or local date.
 */
export function formatRelativeDate(isoDate: string): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/* -------------------------------------------------------------------------- */
/* Filter & Search Helpers                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Filters and sorts the product collection with full Category and Collection hierarchy awareness.
 */
export function filterProducts(
  products: Product[],
  search: string,
  filters: ProductFilterState,
  categoriesList: CategoryOption[] = [],
): Product[] {
  const query = search.trim().toLowerCase();

  // Create fast category lookup map
  const categoryMap = new Map<string, CategoryOption>();
  categoriesList.forEach((c) => {
    categoryMap.set(c.id, c);
  });

  return products
    .filter((product) => {
      const price = product.sale_price ?? product.price;
      const totalStock = getTotalStock(product);

      // Search query match (by name, SKU, or ID)
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku ?? "").toLowerCase().includes(query) ||
        (product.category_name ?? "").toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

      // Category matching: checks if product is directly in category or in a collection under this category
      let matchCategory = true;
      if (filters.category && filters.category !== "All Categories") {
        const catTarget = filters.category.toLowerCase();
        const prodCat = product.category_id ? categoryMap.get(product.category_id) : null;
        const prodCatParent = prodCat?.parent_id ? categoryMap.get(prodCat.parent_id) : null;

        const prodCatName = (product.category_name ?? prodCat?.name ?? "").toLowerCase();
        const prodCatSlug = (product.category_slug ?? prodCat?.slug ?? "").toLowerCase();
        const prodCatId = (product.category_id ?? "").toLowerCase();

        const parentName = (prodCatParent?.name ?? "").toLowerCase();
        const parentSlug = (prodCatParent?.slug ?? "").toLowerCase();
        const parentId = (prodCatParent?.id ?? "").toLowerCase();

        matchCategory =
          prodCatName === catTarget ||
          prodCatSlug === catTarget ||
          prodCatId === catTarget ||
          parentName === catTarget ||
          parentSlug === catTarget ||
          parentId === catTarget;
      }

      // Collection matching: checks if product is in this collection
      let matchCollection = true;
      if (filters.collection && filters.collection !== "All Collections") {
        const colTarget = filters.collection.toLowerCase();
        const prodCat = product.category_id ? categoryMap.get(product.category_id) : null;

        const prodCatName = (product.category_name ?? prodCat?.name ?? "").toLowerCase();
        const prodCatSlug = (product.category_slug ?? prodCat?.slug ?? "").toLowerCase();
        const prodCatId = (product.category_id ?? "").toLowerCase();

        matchCollection =
          prodCatName === colTarget ||
          prodCatSlug === colTarget ||
          prodCatId === colTarget;
      }

      const matchGender =
        filters.gender === "All Genders" || product.gender === filters.gender;

      const matchType =
        filters.product_type === "All Types" ||
        product.product_type === filters.product_type;

      const matchFit =
        filters.fit === "All Fits" || product.fit === filters.fit;

      const matchColor =
        filters.color === "All Colors" || product.color === filters.color;

      const matchMaterial =
        filters.material === "All Materials" ||
        product.material === filters.material;

      const matchBrand =
        filters.brand === "All Brands" || product.brand === filters.brand;

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
        matchCollection &&
        matchGender &&
        matchType &&
        matchFit &&
        matchColor &&
        matchMaterial &&
        matchBrand &&
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
