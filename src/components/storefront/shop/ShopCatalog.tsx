"use client";

import { useState, useMemo, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { SHOP_PRODUCTS } from "@/data/storefront";
import type {
  DepartmentKey,
  CategoryKey,
  CollectionKey,
  SortOption,
  ProductItem,
} from "@/types/storefront";
import type { StorefrontTaxonomies } from "@/app/services/storefront/categories";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "26", "28", "30", "32", "34", "36", "ONE SIZE"];
const ALL_COLORS = [
  { name: "Obsidian Black", bg: "#0A0A0A", border: "#333333" },
  { name: "Charcoal", bg: "#1C1C1C", border: "#444444" },
  { name: "Raw Indigo", bg: "#18233C", border: "#2E3F66" },
  { name: "Chalk White", bg: "#F5F3EF", border: "#D5D3CF", textDark: true },
  { name: "Bone Gray", bg: "#8C8A85", border: "#A5A39E" },
];

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "ALL CATEGORIES" },
  { key: "outerwear", label: "OUTERWEAR" },
  { key: "tailoring", label: "TAILORING" },
  { key: "trousers", label: "TROUSERS & DENIM" },
  { key: "tops", label: "TOPS & TEES" },
  { key: "objects", label: "OBJECTS & ACCESSORIES" },
];

const DEPARTMENTS: { key: DepartmentKey; label: string; number: string }[] = [
  { key: "all", label: "ALL DISCIPLINES", number: "00" },
  { key: "men", label: "MEN", number: "01" },
  { key: "women", label: "WOMEN", number: "02" },
  { key: "accessories", label: "ACCESSORIES", number: "03" },
];

const COLLECTIONS: { key: CollectionKey; label: string; season: string }[] = [
  { key: "all", label: "ALL COLLECTIONS", season: "ARCHIVE" },
  { key: "motion", label: "MOTION", season: "AW26" },
  { key: "shift", label: "SHIFT", season: "W26" },
];

const PRICE_RANGES = [
  { label: "ALL PRICES", min: 0, max: Infinity },
  { label: "UNDER EGP 3,000", min: 0, max: 3000 },
  { label: "EGP 3,000 – EGP 6,000", min: 3000, max: 6000 },
  { label: "OVER EGP 6,000", min: 6000, max: Infinity },
];

interface ShopCatalogProps {
  initialProducts?: ProductItem[];
  initialTaxonomies?: StorefrontTaxonomies;
}

export function ShopCatalog({ initialProducts, initialTaxonomies }: ShopCatalogProps = {}) {
  const productsList = initialProducts && initialProducts.length > 0 ? initialProducts : SHOP_PRODUCTS;

  // Build dynamic categories list from Supabase taxonomies or products
  const dynamicCategories = useMemo(() => {
    if (initialTaxonomies?.categories && initialTaxonomies.categories.length > 0) {
      return [
        { key: "all", label: "ALL CATEGORIES" },
        ...initialTaxonomies.categories.map((c) => ({ key: c.slug || c.key, label: c.label })),
      ];
    }
    // Extract unique categories from products if available
    const set = new Map<string, string>();
    productsList.forEach((p) => {
      const slug = p.category_slug || p.category;
      const name = p.category_name || (typeof p.category === "string" ? p.category.toUpperCase() : "");
      if (slug && name && !set.has(slug)) {
        set.set(slug, name.toUpperCase());
      }
    });
    if (set.size > 0) {
      return [
        { key: "all", label: "ALL CATEGORIES" },
        ...Array.from(set.entries()).map(([key, label]) => ({ key, label })),
      ];
    }
    return CATEGORIES;
  }, [initialTaxonomies, productsList]);

  // Build dynamic collections/sub-categories list from Supabase taxonomies or products
  const allCollections = useMemo(() => {
    const subList = initialTaxonomies?.subCategories || initialTaxonomies?.collections;
    if (subList && subList.length > 0) {
      return [
        { key: "all", label: "ALL PIECES", season: "ARCHIVE", parent_slug: null, parent_id: null, id: "all" },
        ...subList.map((c) => ({
          key: c.slug || c.key,
          label: c.label,
          season: "ATELIER",
          parent_slug: c.parent_slug || null,
          parent_id: c.parent_id || null,
          id: c.id,
        })),
      ];
    }
    // Extract unique collections from products tags
    const set = new Set<string>();
    productsList.forEach((p) => {
      if (p.collection) set.add(p.collection);
      (p.tags || []).forEach((t) => {
        const lower = t.toLowerCase();
        if (lower === "motion" || lower === "shift" || lower.includes("collection")) {
          set.add(t);
        }
      });
    });
    if (set.size > 0) {
      return [
        { key: "all", label: "ALL PIECES", season: "ARCHIVE", parent_slug: null, parent_id: null, id: "all" },
        ...Array.from(set).map((item) => ({
          key: item.toLowerCase(),
          label: item.toUpperCase(),
          season: "ATELIER",
          parent_slug: null,
          parent_id: null,
          id: item.toLowerCase(),
        })),
      ];
    }
    return COLLECTIONS.map((c) => ({ ...c, parent_slug: null, parent_id: null, id: c.key }));
  }, [initialTaxonomies, productsList]);

  // Build dynamic main categories list from Supabase taxonomies
  const dynamicDepartments = useMemo(() => {
    const mainList = initialTaxonomies?.mainCategories || initialTaxonomies?.departments;
    if (mainList && mainList.length > 0) {
      return mainList.map((d, i) => ({
        key: d.key,
        label: d.label,
        slug: d.slug || d.key,
        id: d.id || d.key,
        number: String(i).padStart(2, "0"),
      }));
    }
    return DEPARTMENTS.map((d, i) => ({
      ...d,
      slug: d.key,
      id: d.key,
      number: String(i).padStart(2, "0"),
    }));
  }, [initialTaxonomies]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial values from URL search params
  const initialDepartment = (searchParams.get("department") as DepartmentKey) || "all";
  const initialCategory = (searchParams.get("category") as CategoryKey) || "all";
  const initialCollection = (searchParams.get("collection") as CollectionKey) || "all";
  const initialSize = searchParams.get("size") || "all";
  const initialColor = searchParams.get("color") || "all";
  const initialPriceIndex = Number(searchParams.get("priceIndex") || 0);
  const initialSort = (searchParams.get("sort") as SortOption) || "curated";
  const initialQuery = searchParams.get("q") || "";

  const [department, setDepartment] = useState<DepartmentKey>(initialDepartment);
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [collection, setCollection] = useState<CollectionKey>(initialCollection);
  const [size, setSize] = useState<string>(initialSize);
  const [color, setColor] = useState<string>(initialColor);
  const [priceIndex, setPriceIndex] = useState<number>(initialPriceIndex);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [query, setQuery] = useState<string>(initialQuery);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Dynamically filter child sub-categories based on the selected main category!
  const availableCollections = useMemo(() => {
    // If all disciplines selected, show all available subcategories
    if (department === "all") {
      return allCollections;
    }

    // Find the active main category
    const activeMain = dynamicDepartments.find(
      (d) =>
        d.key.toLowerCase() === department.toLowerCase() ||
        (d.slug && d.slug.toLowerCase() === department.toLowerCase()) ||
        d.id === department
    );
    const activeMainId = activeMain?.id;
    const activeMainSlug = (activeMain?.slug || department).toLowerCase();

    // 1. Direct parent-child link from Supabase (where parent_id === activeMainId OR parent_slug === activeMainSlug)
    const directChildren = allCollections.filter((sub) => {
      if (sub.key === "all") return false;
      if (activeMainId && sub.parent_id === activeMainId) return true;
      if (sub.parent_slug && sub.parent_slug.toLowerCase() === activeMainSlug) return true;
      return false;
    });

    // 2. Sub-categories/collections present on products belonging to this main category
    const deptProducts = productsList.filter((p) => {
      return (
        (activeMainId && (p.category_id === activeMainId || p.category_parent_id === activeMainId)) ||
        p.category_slug?.toLowerCase() === activeMainSlug ||
        p.department?.toLowerCase() === activeMainSlug
      );
    });

    const productColKeys = new Set<string>();
    deptProducts.forEach((p) => {
      if (p.collection) productColKeys.add(p.collection.toLowerCase());
      if (p.category_slug && p.category_slug.toLowerCase() !== activeMainSlug) {
        productColKeys.add(p.category_slug.toLowerCase());
      }
      (p.tags || []).forEach((t) => productColKeys.add(t.toLowerCase()));
    });

    const matchedChildren = allCollections.filter((col) => {
      if (col.key === "all") return false;
      const keyLower = col.key.toLowerCase();
      return (
        directChildren.some((dc) => dc.key.toLowerCase() === keyLower) ||
        productColKeys.has(keyLower)
      );
    });

    // If there are specific subcategories for this main category, return them with "ALL"
    if (matchedChildren.length > 0) {
      return [
        { key: "all", label: `ALL ${activeMain?.label || "PIECES"}`, season: "ARCHIVE", parent_slug: null, parent_id: null, id: "all" },
        ...matchedChildren,
      ];
    }

    return [];
  }, [allCollections, department, dynamicDepartments, productsList]);

  // Sync state if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    const urlDept = (searchParams.get("department") as DepartmentKey) || "all";
    const urlCat = (searchParams.get("category") as CategoryKey) || "all";
    const urlCol = (searchParams.get("collection") as CollectionKey) || "all";
    const urlSize = searchParams.get("size") || "all";
    const urlColor = searchParams.get("color") || "all";
    const urlPriceIndex = Number(searchParams.get("priceIndex") || 0);
    const urlSort = (searchParams.get("sort") as SortOption) || "curated";
    const urlQuery = searchParams.get("q") || "";

    setDepartment(urlDept);
    setCategory(urlCat);
    setCollection(urlCol);
    setSize(urlSize);
    setColor(urlColor);
    setPriceIndex(urlPriceIndex);
    setSort(urlSort);
    setQuery(urlQuery);
  }, [searchParams]);

  // Update URL Search Parameters whenever state changes
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, val]) => {
          if (!val || val === "all" || val === "" || (key === "priceIndex" && val === "0") || (key === "sort" && val === "curated")) {
            params.delete(key);
          } else {
            params.set(key, val);
          }
        });
        const qs = params.toString();
        const targetUrl = qs ? `/shop?${qs}` : "/shop";
        router.replace(targetUrl, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const handleDepartmentChange = (dept: DepartmentKey) => {
    setDepartment(dept);

    // Reset sub-category to "all" when changing main category
    setCollection("all");

    updateUrlParams({
      department: dept,
      collection: null,
    });
  };

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    updateUrlParams({ category: cat });
  };

  const handleCollectionChange = (col: CollectionKey) => {
    setCollection(col);
    updateUrlParams({ collection: col });
  };

  const handleSizeChange = (s: string) => {
    const nextSize = size === s ? "all" : s;
    setSize(nextSize);
    updateUrlParams({ size: nextSize });
  };

  const handleColorChange = (c: string) => {
    const nextColor = color === c ? "all" : c;
    setColor(nextColor);
    updateUrlParams({ color: nextColor });
  };

  const handlePriceChange = (idx: number) => {
    setPriceIndex(idx);
    updateUrlParams({ priceIndex: idx.toString() });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    updateUrlParams({ sort: newSort });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrlParams({ q: val });
  };

  const resetAllFilters = () => {
    setDepartment("all");
    setCategory("all");
    setCollection("all");
    setSize("all");
    setColor("all");
    setPriceIndex(0);
    setSort("curated");
    setQuery("");
    router.replace("/shop", { scroll: false });
  };

  // Compute Active Filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (department !== "all") count++;
    if (category !== "all") count++;
    if (collection !== "all") count++;
    if (color !== "all") count++;
    if (priceIndex !== 0) count++;
    if (query.trim()) count++;
    return count;
  }, [department, category, collection, size, color, priceIndex, query]);

  // Main Filtering Engine
  const filteredProducts = useMemo(() => {
    const priceRange = PRICE_RANGES[priceIndex] || PRICE_RANGES[0];
    const cleanQ = query.trim().toLowerCase();

    return productsList.filter((product: ProductItem) => {
      // 1. Main Category match (الكاتيجوري الأساسي)
      if (department !== "all") {
        const activeMain = dynamicDepartments.find(
          (d) =>
            d.key.toLowerCase() === department.toLowerCase() ||
            (d.slug && d.slug.toLowerCase() === department.toLowerCase()) ||
            d.id === department
        );
        const mainId = activeMain?.id;
        const mainSlug = (activeMain?.slug || department).toLowerCase();

        const matchesMain =
          (mainId && (product.category_id === mainId || product.category_parent_id === mainId)) ||
          (product.category_slug && product.category_slug.toLowerCase() === mainSlug) ||
          (product.department && product.department.toLowerCase() === mainSlug);

        if (!matchesMain) return false;
      }

      // 2. Sub-Category match (الكاتيجوريهات الابن)
      if (collection !== "all") {
        const colKey = collection.toLowerCase();
        const matchesSubCategory =
          (product.category_id && product.category_id.toLowerCase() === colKey) ||
          (product.category_slug && product.category_slug.toLowerCase() === colKey) ||
          (product.category_name && product.category_name.toLowerCase() === colKey) ||
          (product.collection && product.collection.toLowerCase() === colKey) ||
          (product.tags || []).some((t) => t.toLowerCase() === colKey);

        if (!matchesSubCategory) return false;
      }

      // 4. Size match
      if (size !== "all" && !product.sizes.includes(size)) {
        return false;
      }

      // 5. Color match
      if (color !== "all" && (!product.colors || !product.colors.includes(color))) {
        return false;
      }

      // 6. Price range match
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      // 7. Text search query match
      if (cleanQ) {
        const haystack = `${product.name} ${product.code} ${product.material} ${product.silhouette} ${product.description}`.toLowerCase();
        if (!haystack.includes(cleanQ)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "code") return a.code.localeCompare(b.code);
      return 0; // "curated" preserves default atelier sequence
    });
  }, [productsList, department, category, collection, size, color, priceIndex, sort, query]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close search on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search results across all products, departments, collections
  const searchResults = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return [];
    return productsList.filter((product: ProductItem) => {
      const haystack = `${product.name} ${product.code} ${product.department} ${product.category} ${product.collection} ${product.material} ${product.silhouette} ${product.description} ${(product.colors || []).join(" ")}`.toLowerCase();
      return haystack.includes(cleanQ);
    });
  }, [query]);

  return (
    <div className="w-full bg-[#FBF9F6] text-near-black min-h-screen">
      {/* 1. QUIET EDITORIAL HEADER */}
      <header className="site-padding-x pt-24 sm:pt-32 pb-6 border-b border-near-black/10">
        <div className="site-container flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono tracking-[0.28em] text-brand-gray uppercase block mb-1">
              ARCHIVE // 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-light uppercase tracking-tight text-near-black">
              STOREFRONT &amp; EDITIONS
            </h1>
          </div>

          <div className="text-[10px] font-mono tracking-[0.2em] text-brand-gray uppercase">
            <span>
              {filteredProducts.length} {filteredProducts.length === 1 ? "PIECE" : "PIECES"} AVAILABLE
            </span>
          </div>
        </div>
      </header>

      {/* 2. REFINED MINIMALIST CONTROL BAR */}
      <div className="sticky top-0 z-30 bg-[#FBF9F6]/95 backdrop-blur-md border-b border-near-black/10 site-padding-x py-3 transition-all">
        <div className="site-container flex items-center justify-between gap-4">
          {/* Left: Department Tabs */}
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-1">
            {dynamicDepartments.map((dept) => {
              const isSelected = department === dept.key;
              return (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() => handleDepartmentChange(dept.key)}
                  className={`text-xs uppercase font-sans tracking-[0.2em] transition-colors cursor-pointer relative py-1 shrink-0 ${
                    isSelected
                      ? "text-near-black font-semibold"
                      : "text-brand-gray hover:text-near-black"
                  }`}
                >
                  <span>{dept.label}</span>
                  {isSelected && (
                    <span className="absolute left-0 right-0 -bottom-1 h-[1.5px] bg-near-black" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Search Trigger & Filter Drawer Trigger */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-xs uppercase font-sans tracking-[0.2em] text-near-black hover:opacity-75 transition-opacity cursor-pointer py-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEARCH</span>
              {query && (
                <span className="max-w-[100px] truncate text-brand-gray text-[10px] font-mono">
                  &quot;{query}&quot;
                </span>
              )}
            </button>

            <span className="w-px h-3.5 bg-near-black/20" />

            {/* Filter & Sort Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 text-xs uppercase font-sans tracking-[0.2em] text-near-black hover:opacity-75 transition-opacity cursor-pointer py-1 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTER</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-near-black text-off-white text-[9px] flex items-center justify-center font-mono font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Sub-Categories Row: Displays child categories belonging to the active Main Category */}
        {availableCollections.length > 1 && (
          <div className="site-container flex items-center gap-5 overflow-x-auto scrollbar-none pt-2.5 mt-1 border-t border-near-black/5 text-[10px] uppercase font-mono tracking-[0.2em]">
            <span className="text-brand-gray/50 shrink-0">SUB-CATEGORIES:</span>
            <div className="flex items-center gap-4 shrink-0">
              {availableCollections.map((col) => {
                const isSelected = collection === col.key;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => handleCollectionChange(col.key)}
                    className={`transition-colors cursor-pointer py-0.5 shrink-0 ${
                      isSelected
                        ? "text-near-black font-semibold border-b border-near-black"
                        : "text-brand-gray hover:text-near-black"
                    }`}
                  >
                    {col.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. DISCREET ACTIVE FILTERS */}
      {activeFiltersCount > 0 && (
        <div className="site-padding-x py-2 border-b border-near-black/5 bg-[#F6F4F0]">
          <div className="site-container flex items-center justify-between gap-4 text-[9px] font-mono tracking-[0.16em] uppercase">
            <div className="flex items-center flex-wrap gap-2 text-brand-gray">
              <span className="opacity-50">ACTIVE:</span>

              {department !== "all" && (
                <button
                  type="button"
                  onClick={() => handleDepartmentChange("all")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>
                    {dynamicDepartments.find((d) => d.key === department)?.label || department}
                  </span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}

              {category !== "all" && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("all")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>{category}</span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}

              {collection !== "all" && (
                <button
                  type="button"
                  onClick={() => handleCollectionChange("all")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>
                    {allCollections.find((c) => c.key === collection)?.label || collection}
                  </span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}

              {color !== "all" && (
                <button
                  type="button"
                  onClick={() => handleColorChange("all")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>{color}</span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}

              {priceIndex !== 0 && (
                <button
                  type="button"
                  onClick={() => handlePriceChange(0)}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>{PRICE_RANGES[priceIndex]?.label}</span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}

              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>&quot;{query}&quot;</span>
                  <X className="w-2.5 h-2.5 opacity-60" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-near-black hover:opacity-60 underline tracking-[0.2em] cursor-pointer shrink-0"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      {/* 4. FULL-SCREEN SEARCH TAKEOVER (PURE WHITE GALLERY CANVAS) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBF9F6] text-near-black flex flex-col overflow-y-auto animate-fadeIn">
          {/* Top Bar with ESC / Close */}
          <div className="site-padding-x py-6 border-b border-near-black/10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.24em] text-brand-gray uppercase">
              LÉVARO // SEARCH ENGINE
            </span>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center gap-2 text-xs uppercase font-sans tracking-[0.2em] text-near-black hover:opacity-60 transition-opacity cursor-pointer"
            >
              <span>CLOSE [ESC]</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Centered Large Search Input */}
          <div className="site-padding-x pt-12 sm:pt-20 pb-10 max-w-4xl mx-auto w-full">
            <div className="relative border-b-2 border-near-black pb-4">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="SEARCH PIECES, FABRICS, SILHOUETTES..."
                className="w-full bg-transparent text-xl sm:text-3xl md:text-4xl font-display font-light uppercase tracking-wide text-near-black placeholder:text-brand-gray/30 outline-none pr-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gray hover:text-near-black cursor-pointer p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Quick Suggestions / Result Count */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gray">
              <span>
                {query.trim()
                  ? `${searchResults.length} EDITIONS MATCHED`
                  : "TYPE TO SEARCH ACROSS ALL DEPARTMENTS & COLLECTIONS"}
              </span>
              {query && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-near-black underline hover:opacity-75 cursor-pointer"
                >
                  VIEW ON CATALOGUE
                </button>
              )}
            </div>
          </div>

          {/* Instant Search Results Grid */}
          <div className="site-padding-x pb-24 flex-1">
            <div className="site-container">
              {query.trim() ? (
                searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12">
                    {searchResults.map((product) => (
                      <div key={product.id} onClick={() => setIsSearchOpen(false)}>
                        <ProductCard product={product} theme="light" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center max-w-md mx-auto space-y-3">
                    <span className="text-[10px] font-mono tracking-[0.26em] text-brand-gray uppercase">
                      ZERO MATCHES FOUND
                    </span>
                    <h3 className="text-xl font-display font-light uppercase text-near-black">
                      NO PIECES FOUND FOR &quot;{query}&quot;
                    </h3>
                    <p className="text-xs uppercase font-sans tracking-[0.14em] text-brand-gray">
                      Try searching by generic terms like coat, wool, motion, or trousers.
                    </p>
                  </div>
                )
              ) : (
                /* Curated Quick Tags while search input is empty */
                <div className="max-w-2xl mx-auto py-8 text-center">
                  <span className="text-[10px] font-mono tracking-[0.24em] text-brand-gray uppercase block mb-4">
                    FREQUENT ATELIER INQUIRIES
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {dynamicCategories
                      .filter((c) => c.key !== "all")
                      .slice(0, 5)
                      .concat(allCollections.filter((c) => c.key !== "all").slice(0, 3))
                      .map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleQueryChange(item.label)}
                          className="px-3.5 py-1.5 border border-near-black/15 hover:border-near-black text-xs font-mono uppercase tracking-[0.18em] transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN PRODUCT EXHIBITION GRID (BORDERLESS LOOKBOOK) */}
      <div className="site-padding-x py-10 sm:py-16">
        <div className="site-container">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} theme="light" />
              ))}
            </div>
          ) : (
            /* 6. CLEAN EMPTY STATE */
            <div className="py-24 text-center flex flex-col items-center justify-center p-8 max-w-md mx-auto space-y-4">
              <span className="text-[10px] font-mono tracking-[0.26em] text-brand-gray uppercase">
                ZERO PIECES DISCOVERED
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-light uppercase text-near-black tracking-tight">
                NO EDITIONS MATCH CURRENT SELECTION
              </h2>
              <p className="text-xs uppercase font-sans tracking-[0.14em] text-brand-gray leading-relaxed">
                Adjust your category or color filters to explore the rest of the collection.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-3 px-6 py-2.5 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.22em] hover:bg-charcoal transition-all cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. SLIDE-OVER FILTER & SORT SHEET (FROM THE RIGHT) */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-near-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FBF9F6] text-near-black z-50 shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
            {/* Sheet Header */}
            <div className="p-6 border-b border-near-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.24em] uppercase text-near-black font-semibold">
                <SlidersHorizontal className="w-4 h-4" />
                <span>FILTER &amp; SORT</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 text-brand-gray hover:text-near-black transition-colors cursor-pointer"
                aria-label="Close filter drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Section 1: Sort Options */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                  SORT BY
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "curated", label: "CURATED ATELIER SEQUENCE" },
                    { key: "price-asc", label: "PRICE: LOW TO HIGH" },
                    { key: "price-desc", label: "PRICE: HIGH TO LOW" },
                    { key: "code", label: "EDITION NUMBER" },
                  ].map((s) => {
                    const isSelected = sort === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleSortChange(s.key as SortOption)}
                        className={`text-left text-xs uppercase font-sans tracking-[0.16em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-near-black text-off-white font-medium"
                            : "bg-near-black/[0.03] text-near-black hover:bg-near-black/[0.06]"
                        }`}
                      >
                        <span>{s.label}</span>
                        {isSelected && <span className="text-[9px] font-mono font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Main Disciplines & Sub-Categories */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                  DISCIPLINES (MAIN CATEGORY)
                </span>
                <div className="flex flex-col gap-2">
                  {dynamicDepartments.map((dept) => {
                    const isSelected = department === dept.key;
                    return (
                      <button
                        key={dept.key}
                        type="button"
                        onClick={() => handleDepartmentChange(dept.key)}
                        className={`text-left text-xs uppercase font-sans tracking-[0.16em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-near-black text-off-white font-medium"
                            : "bg-near-black/[0.03] text-near-black hover:bg-near-black/[0.06]"
                        }`}
                      >
                        <span>{dept.label}</span>
                        {isSelected && <span className="text-[9px] font-mono font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {availableCollections.length > 1 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                    SUB-CATEGORIES
                  </span>
                  <div className="flex flex-col gap-2">
                    {availableCollections.map((sub) => {
                      const isSelected = collection === sub.key;
                      return (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => handleCollectionChange(sub.key)}
                          className={`text-left text-xs uppercase font-sans tracking-[0.16em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-near-black text-off-white font-medium"
                              : "bg-near-black/[0.03] text-near-black hover:bg-near-black/[0.06]"
                          }`}
                        >
                          <span>{sub.label}</span>
                          {isSelected && <span className="text-[9px] font-mono font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Color Spectrum */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                  COLOR SPECTRUM
                </span>
                <div className="flex flex-col gap-2">
                  {ALL_COLORS.map((clr) => {
                    const isSelected = color === clr.name;
                    return (
                      <button
                        key={clr.name}
                        type="button"
                        onClick={() => handleColorChange(clr.name)}
                        className={`text-left text-xs uppercase font-sans tracking-[0.16em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-near-black text-off-white font-medium"
                            : "bg-near-black/[0.03] text-near-black hover:bg-near-black/[0.06]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 border border-near-black/20 shrink-0"
                            style={{ backgroundColor: clr.bg }}
                          />
                          <span>{clr.name}</span>
                        </div>
                        {isSelected && <span className="text-[9px] font-mono font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Price Range */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                  VALUATION
                </span>
                <div className="flex flex-col gap-2">
                  {PRICE_RANGES.map((rng, idx) => {
                    const isSelected = priceIndex === idx;
                    return (
                      <button
                        key={rng.label}
                        type="button"
                        onClick={() => handlePriceChange(idx)}
                        className={`text-left text-xs uppercase font-sans tracking-[0.16em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-near-black text-off-white font-medium"
                            : "bg-near-black/[0.03] text-near-black hover:bg-near-black/[0.06]"
                        }`}
                      >
                        <span>{rng.label}</span>
                        {isSelected && <span className="text-[9px] font-mono font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="p-6 border-t border-near-black/10 bg-[#FBF9F6] flex items-center gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-3 text-center border border-near-black/20 text-near-black text-xs uppercase font-sans tracking-[0.2em] hover:border-near-black transition-colors cursor-pointer"
              >
                RESET ALL
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 text-center bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.2em] font-semibold hover:bg-charcoal transition-colors cursor-pointer"
              >
                VIEW ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
