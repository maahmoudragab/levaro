import type { Product } from "@/app/services/admin/products";

export const PRODUCTS_PER_PAGE = 10;
export const LOW_STOCK_THRESHOLD = 10;

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

export function getTotalStock(product: Product) {
  return (product.stock ?? []).reduce((total, item) => total + item.stock, 0);
}

export function getStockInfo(product: Product) {
  const total = getTotalStock(product);

  if (total === 0) {
    return { label: "Out of stock" };
  }

  if (total <= LOW_STOCK_THRESHOLD) {
    return { label: `Low stock ${total}` };
  }

  return { label: `In stock ${total}` };
}

function uniqueValues(
  products: Product[],
  getValue: (product: Product) => string | null,
) {
  const values = products
    .map(getValue)
    .filter((value): value is string => Boolean(value?.trim()));

  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

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

export function filterProducts(
  products: Product[],
  search: string,
  filters: ProductFilterState,
) {
  const query = search.trim().toLowerCase();

  return products
    .filter((product) => {
      const price = product.sale_price ?? product.price;
      const totalStock = getTotalStock(product);

      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.sku ?? "").toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);

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
