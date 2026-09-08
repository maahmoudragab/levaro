"use client";

import { useState, useMemo, useEffect, useCallback, useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { fetchStorefrontProductsAction } from "@/services/storefront/actions";
import { SHOP_PRODUCTS } from "@/data/storefront";
import type {
  DepartmentKey,
  CategoryKey,
  CollectionKey,
  SortOption,
  ProductItem,
} from "@/types/storefront";
import type { StorefrontTaxonomies } from "@/services/storefront/categories";
import { COLORS as DASHBOARD_COLORS } from "@/components/admin/products/product-utils";

const FALLBACK_COLOR_MAP: Record<string, { bg: string; border: string; textDark?: boolean }> = {
  black: { bg: "#0A0A0A", border: "#333333" },
  "obsidian black": { bg: "#0A0A0A", border: "#333333" },
  charcoal: { bg: "#1C1C1C", border: "#444444" },
  "raw indigo": { bg: "#18233C", border: "#2E3F66" },
  "chalk white": { bg: "#F5F3EF", border: "#D5D3CF", textDark: true },
  "bone gray": { bg: "#8C8A85", border: "#A5A39E" },
};

function resolveColorSwatch(name: string): { bg: string; border: string; textDark?: boolean } {
  const clean = name.toLowerCase().trim();

  // Check exact or partial match in dashboard colors first
  const dbMatch = DASHBOARD_COLORS.find(
    (c: { name: string; hex: string }) => c.name.toLowerCase() === clean || clean.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(clean)
  );
  if (dbMatch) {
    const isLight = ["#ffffff", "#f5f5f0", "#fffdd0", "#e5e7eb", "#bae6fd", "#98ff98", "#e6e6fa"].includes(dbMatch.hex.toLowerCase());
    return {
      bg: dbMatch.hex,
      border: isLight ? "#D5D3CF" : "#333333",
      textDark: isLight,
    };
  }

  // Check fallback dictionary
  if (FALLBACK_COLOR_MAP[clean]) return FALLBACK_COLOR_MAP[clean];
  for (const [k, v] of Object.entries(FALLBACK_COLOR_MAP)) {
    if (clean.includes(k) || k.includes(clean)) return v;
  }

  // Default elegant neutral swatch
  return { bg: "#1C1C1C", border: "#333333" };
}

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

const PRODUCTS_PER_PAGE = 9;

interface ShopCatalogProps {
  initialProducts?: ProductItem[];
  initialTaxonomies?: StorefrontTaxonomies;
}

export function ShopCatalog({ initialProducts, initialTaxonomies }: ShopCatalogProps = {}) {
  const productsList = initialProducts && initialProducts.length > 0 ? initialProducts : SHOP_PRODUCTS;

  // Build dynamic categories list from Supabase taxonomies or products
  const dynamicCategories = useMemo(() => {
    if (initialTaxonomies?.categories && initialTaxonomies.categories.length > 0) {
      const seen = new Set<string>();
      const uniqueCats: { key: string; label: string }[] = [];
      initialTaxonomies.categories.forEach((c) => {
        const k = (c.slug || c.key || "").toLowerCase();
        if (k && !seen.has(k)) {
          seen.add(k);
          uniqueCats.push({ key: c.slug || c.key, label: c.label });
        }
      });
      return [
        { key: "all", label: "ALL CATEGORIES" },
        ...uniqueCats,
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
      const activeSubs = subList.filter((c) => c.is_active !== false);
      const seen = new Set<string>();
      const uniqueSubs: typeof activeSubs = [];
      activeSubs.forEach((c) => {
        const k = (c.slug || c.key || "").toLowerCase();
        if (k && !seen.has(k)) {
          seen.add(k);
          uniqueSubs.push(c);
        }
      });

      return [
        { key: "all", label: "ALL COLLECTIONS", season: "ARCHIVE", parent_slug: null, parent_id: null, id: "all" },
        ...uniqueSubs.map((c) => ({
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
        { key: "all", label: "ALL COLLECTIONS", season: "ARCHIVE", parent_slug: null, parent_id: null, id: "all" },
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

  // Dynamic colors extracted directly from actual products in database
  const dynamicColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; bg: string; border: string; textDark?: boolean }>();

    productsList.forEach((p) => {
      const candidates: string[] = [];
      if (Array.isArray(p.colors)) {
        candidates.push(...p.colors);
      }
      if (typeof p.color === "string" && p.color.trim()) {
        candidates.push(p.color.trim());
      }
      candidates.forEach((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;
        const normalizedKey = trimmed.toLowerCase();
        if (!colorMap.has(normalizedKey)) {
          const swatch = resolveColorSwatch(trimmed);
          colorMap.set(normalizedKey, {
            name: trimmed,
            bg: swatch.bg,
            border: swatch.border,
            textDark: swatch.textDark,
          });
        }
      });
    });

    if (colorMap.size > 0) {
      return Array.from(colorMap.values());
    }

    return [
      { name: "Obsidian Black", bg: "#0A0A0A", border: "#333333" },
      { name: "Charcoal", bg: "#1C1C1C", border: "#444444" },
      { name: "Raw Indigo", bg: "#18233C", border: "#2E3F66" },
      { name: "Chalk White", bg: "#F5F3EF", border: "#D5D3CF", textDark: true },
      { name: "Bone Gray", bg: "#8C8A85", border: "#A5A39E" },
    ];
  }, [productsList]);

  // Dynamic fits extracted directly from actual products in database
  const dynamicFits = useMemo(() => {
    const fitMap = new Map<string, { key: string; label: string }>();

    productsList.forEach((p) => {
      const candidates: string[] = [];
      if (typeof p.fit === "string" && p.fit.trim()) {
        candidates.push(p.fit.trim());
      }
      if (typeof p.silhouette === "string" && p.silhouette.trim()) {
        candidates.push(p.silhouette.trim());
      }
      candidates.forEach((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase();
        if (!fitMap.has(key)) {
          fitMap.set(key, {
            key,
            label: trimmed.toUpperCase(),
          });
        }
      });
    });

    if (fitMap.size > 0) {
      return Array.from(fitMap.values());
    }

    return [
      { key: "oversized fit", label: "OVERSIZED FIT" },
      { key: "relaxed fit", label: "RELAXED FIT" },
      { key: "boxy fit", label: "BOXY FIT" },
      { key: "tailored fit", label: "TAILORED FIT" },
      { key: "regular fit", label: "REGULAR FIT" },
      { key: "slim fit", label: "SLIM FIT" },
      { key: "wide leg", label: "WIDE LEG" },
    ];
  }, [productsList]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial values from URL search params
  const initialDepartment = (searchParams.get("department") as DepartmentKey) || "all";
  const initialCategory = (searchParams.get("category") as CategoryKey) || "all";
  const initialCollection = (searchParams.get("collection") as CollectionKey) || "all";
  const initialFit = searchParams.get("fit") || "all";
  const initialColor = searchParams.get("color") || "all";
  const initialPriceIndex = Number(searchParams.get("priceIndex") || 0);
  const initialSort = (searchParams.get("sort") as SortOption) || "curated";
  const initialQuery = searchParams.get("q") || "";

  const [department, setDepartment] = useState<DepartmentKey>(initialDepartment);
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [collection, setCollection] = useState<CollectionKey>(initialCollection);
  const [fit, setFit] = useState<string>(initialFit);
  const [color, setColor] = useState<string>(initialColor);
  const [priceIndex, setPriceIndex] = useState<number>(initialPriceIndex);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [query, setQuery] = useState<string>(initialQuery);

  // Synchronous pre-filter on initial render based on searchParams (zero flicker on direct links)
  const initialFilteredProducts = useMemo(() => {
    const hasActiveParam =
      (initialDepartment && initialDepartment !== "all") ||
      (initialCategory && initialCategory !== "all") ||
      (initialCollection && initialCollection !== "all") ||
      (initialFit && initialFit !== "all") ||
      (initialColor && initialColor !== "all") ||
      initialPriceIndex !== 0 ||
      (initialSort && initialSort !== "curated") ||
      (initialQuery && initialQuery.trim() !== "");

    if (!hasActiveParam) {
      return productsList;
    }

    const priceRange = PRICE_RANGES[initialPriceIndex] || PRICE_RANGES[0];
    const qLower = initialQuery.trim().toLowerCase();

    const filtered = productsList.filter((product) => {
      if (product.is_active === false) return false;

      // Department filter
      if (initialDepartment !== "all") {
        const dLower = initialDepartment.toLowerCase();
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
      if (initialCategory !== "all") {
        const catLower = initialCategory.toLowerCase();
        const matchesCat =
          (product.category && product.category.toLowerCase() === catLower) ||
          (product.category_slug && product.category_slug.toLowerCase() === catLower) ||
          (product.category_id && product.category_id.toLowerCase() === catLower) ||
          (product.category_name && product.category_name.toLowerCase() === catLower);
        if (!matchesCat) return false;
      }

      // Collection filter
      if (initialCollection !== "all") {
        const colLower = initialCollection.toLowerCase();
        const matchesCol =
          (product.collection && product.collection.toLowerCase() === colLower) ||
          (product.category_slug && product.category_slug.toLowerCase() === colLower) ||
          (product.category_id && product.category_id.toLowerCase() === colLower) ||
          (product.category_name && product.category_name.toLowerCase() === colLower) ||
          (product.tags || []).some((t) => t.toLowerCase() === colLower);
        if (!matchesCol) return false;
      }

      // Fit filter
      if (initialFit !== "all") {
        const fLower = initialFit.toLowerCase();
        const matchesFit =
          (product.fit && (product.fit.toLowerCase().includes(fLower) || fLower.includes(product.fit.toLowerCase()))) ||
          (product.silhouette && (product.silhouette.toLowerCase().includes(fLower) || fLower.includes(product.silhouette.toLowerCase()))) ||
          (product.tags || []).some((t) => t.toLowerCase().includes(fLower) || fLower.includes(t.toLowerCase()));
        if (!matchesFit) return false;
      }

      // Color filter
      if (initialColor !== "all") {
        const cLower = initialColor.toLowerCase();
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
      if (qLower) {
        const haystack = `${product.name} ${product.code} ${product.material} ${product.silhouette} ${product.description}`.toLowerCase();
        if (!haystack.includes(qLower)) return false;
      }

      return true;
    });

    if (initialSort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (initialSort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    else if (initialSort === "code") filtered.sort((a, b) => a.code.localeCompare(b.code));

    return filtered;
  }, [
    productsList,
    initialDepartment,
    initialCategory,
    initialCollection,
    initialFit,
    initialColor,
    initialPriceIndex,
    initialSort,
    initialQuery,
  ]);

  const [displayedProducts, setDisplayedProducts] = useState<ProductItem[]>(() => {
    return initialFilteredProducts.slice(0, PRODUCTS_PER_PAGE);
  });
  const [totalCount, setTotalCount] = useState<number>(initialFilteredProducts.length);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialFilteredProducts.length > PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({
    sort: false,
    price: false,
    color: false,
    fit: false,
  });

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isFirstRender = useRef(true);
  const pageRef = useRef(1);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(initialFilteredProducts.length > PRODUCTS_PER_PAGE);

  useEffect(() => {
    pageRef.current = page;
    hasMoreRef.current = hasMore;
  }, [page, hasMore]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Dynamically filter child collections: ONLY display active collections that contain at least 1 product!
  const availableCollections = useMemo(() => {
    // 1. Filter active products for the current department (or all departments if 'all')
    const deptProducts = productsList.filter((p) => {
      if (p.is_active === false) return false;
      if (department === "all") return true;

      const activeMain = dynamicDepartments.find(
        (d) =>
          d.key.toLowerCase() === department.toLowerCase() ||
          (d.slug && d.slug.toLowerCase() === department.toLowerCase()) ||
          d.id === department
      );
      const mainId = activeMain?.id;
      const mainSlug = (activeMain?.slug || department).toLowerCase();

      return (
        (mainId && (p.category_id === mainId || p.category_parent_id === mainId)) ||
        (p.category_parent_slug && p.category_parent_slug.toLowerCase() === mainSlug) ||
        (p.category_parent_name && p.category_parent_name.toLowerCase() === mainSlug) ||
        p.category_slug?.toLowerCase() === mainSlug ||
        p.department?.toLowerCase() === mainSlug
      );
    });

    // 2. Identify candidate collections
    let candidateCollections: typeof allCollections = [];

    if (department === "all") {
      candidateCollections = allCollections.filter((c) => c.key !== "all");
    } else {
      const activeMain = dynamicDepartments.find(
        (d) =>
          d.key.toLowerCase() === department.toLowerCase() ||
          (d.slug && d.slug.toLowerCase() === department.toLowerCase()) ||
          d.id === department
      );
      const activeMainId = activeMain?.id;
      const activeMainSlug = (activeMain?.slug || department).toLowerCase();

      // Collections that belong to this main department
      candidateCollections = allCollections.filter((sub) => {
        if (sub.key === "all") return false;
        if (activeMainId && sub.parent_id === activeMainId) return true;
        if (sub.parent_slug && sub.parent_slug.toLowerCase() === activeMainSlug) return true;
        return false;
      });

      // Fallback: match any collections present on products belonging to this department
      if (candidateCollections.length === 0) {
        const productColKeys = new Set<string>();
        deptProducts.forEach((p) => {
          if (p.collection) productColKeys.add(p.collection.toLowerCase());
          if (p.category_slug && p.category_slug.toLowerCase() !== activeMainSlug) {
            productColKeys.add(p.category_slug.toLowerCase());
          }
          (p.tags || []).forEach((t) => productColKeys.add(t.toLowerCase()));
        });

        candidateCollections = allCollections.filter((col) => {
          if (col.key === "all") return false;
          return productColKeys.has(col.key.toLowerCase());
        });
      }
    }

    // 3. Filter strictly: ONLY keep collections that have at least 1 matching product in deptProducts!
    const activeCollectionsWithProducts = candidateCollections.filter((col) => {
      const colId = col.id;
      const colSlug = col.key.toLowerCase().trim();

      const hasProducts = deptProducts.some((product) => {
        return (
          (colId && (product.category_id === colId || product.category_parent_id === colId)) ||
          (product.category_slug && product.category_slug.toLowerCase() === colSlug) ||
          (product.category_name && product.category_name.toLowerCase() === colSlug) ||
          (product.collection && product.collection.toLowerCase() === colSlug) ||
          (product.tags || []).some((t) => t.toLowerCase() === colSlug)
        );
      });

      return hasProducts;
    });

    if (activeCollectionsWithProducts.length > 0) {
      const seenKeys = new Set<string>();
      const uniqueActive: typeof activeCollectionsWithProducts = [];

      activeCollectionsWithProducts.forEach((col) => {
        const normKey = (col.key || "").toLowerCase().trim();
        if (normKey && !seenKeys.has(normKey)) {
          seenKeys.add(normKey);
          uniqueActive.push(col);
        }
      });

      return [
        {
          key: "all",
          label: "ALL COLLECTIONS",
          season: "ARCHIVE",
          parent_slug: null,
          parent_id: null,
          id: "all",
        },
        ...uniqueActive,
      ];
    }

    return [];
  }, [allCollections, department, dynamicDepartments, productsList]);

  // Sync state and fetch Page 1 whenever URL search parameters change
  useEffect(() => {
    // On initial mount, synchronous initialFilteredProducts already populated page 1 seamlessly
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const urlDept = (searchParams.get("department") as DepartmentKey) || "all";
    const urlCat = (searchParams.get("category") as CategoryKey) || "all";
    const urlCol = (searchParams.get("collection") as CollectionKey) || "all";
    const urlFit = searchParams.get("fit") || "all";
    const urlColor = searchParams.get("color") || "all";
    const urlPriceIndex = Number(searchParams.get("priceIndex") || 0);
    const urlSort = (searchParams.get("sort") as SortOption) || "curated";
    const urlQuery = searchParams.get("q") || "";

    // Server-side fetch for Page 1 on filter/search change
    let isCancelled = false;
    setIsFiltering(true);

    fetchStorefrontProductsAction({
      page: 1,
      limit: PRODUCTS_PER_PAGE,
      department: urlDept,
      category: urlCat,
      collection: urlCol,
      fit: urlFit,
      color: urlColor,
      priceIndex: urlPriceIndex,
      sort: urlSort,
      query: urlQuery,
    })
      .then((result) => {
        if (!isCancelled) {
          setDepartment(urlDept);
          setCategory(urlCat);
          setCollection(urlCol);
          setFit(urlFit);
          setColor(urlColor);
          setPriceIndex(urlPriceIndex);
          setSort(urlSort);
          setQuery(urlQuery);
          setDisplayedProducts(result.products);
          setTotalCount(result.totalCount);
          setPage(1);
          setHasMore(result.hasMore);
          setIsFiltering(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching filtered products:", err);
        if (!isCancelled) {
          setIsFiltering(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  // Update URL Search Parameters whenever state changes
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, val]) => {
          if (
            !val ||
            val === "all" ||
            val === "" ||
            (key === "priceIndex" && val === "0") ||
            (key === "sort" && val === "curated")
          ) {
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

  const handleFitChange = (f: string) => {
    const nextFit = fit === f ? "all" : f;
    setFit(nextFit);
    updateUrlParams({ fit: nextFit });
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
    setFit("all");
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
    if (fit !== "all") count++;
    if (color !== "all") count++;
    if (priceIndex !== 0) count++;
    if (query.trim()) count++;
    return count;
  }, [department, category, collection, fit, color, priceIndex, query]);

  // Server-Side Paginated Infinite Scroll: fetch next batch of 9 products directly from server
  const loadNextBatch = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    const nextPage = pageRef.current + 1;

    try {
      const result = await fetchStorefrontProductsAction({
        page: nextPage,
        limit: PRODUCTS_PER_PAGE,
        department,
        category,
        collection,
        fit,
        color,
        priceIndex,
        sort,
        query,
      });

      setDisplayedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = result.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
      setPage(result.page);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [department, category, collection, fit, color, priceIndex, sort, query]);

  // Synchronize Lenis scroll limits immediately whenever displayedProducts changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__lenis?.resize();
      const rAf = requestAnimationFrame(() => {
        window.__lenis?.resize();
      });
      return () => cancelAnimationFrame(rAf);
    }
  }, [displayedProducts]);

  // Synchronize Lenis scroll limits whenever filter drawer opens/closes or mobile accordions toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__lenis?.resize();
      const t1 = setTimeout(() => {
        window.__lenis?.resize();
      }, 150);
      const t2 = setTimeout(() => {
        window.__lenis?.resize();
      }, 550);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isFilterDrawerOpen, openMobileSections]);

  // Dual-trigger Infinite Scroll: IntersectionObserver + Window/Lenis Scroll Listener
  useEffect(() => {
    if (!hasMore) return;

    // 1. IntersectionObserver on the sentinel element
    const sentinel = sentinelRef.current;
    let observer: IntersectionObserver | null = null;

    if (sentinel && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadNextBatch();
          }
        },
        { rootMargin: "600px 0px", threshold: 0 }
      );
      observer.observe(sentinel);
    }

    // 2. Active Window & Lenis Scroll Listener (continuous triggers during momentum scrolling)
    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (hasMoreRef.current && !isLoadingMoreRef.current) {
            const currentScroll = window.__lenis?.scroll ?? window.scrollY;
            if (currentScroll > 50) {
              const scrollBottom = window.innerHeight + currentScroll;
              const threshold = document.documentElement.scrollHeight - 700;
              if (scrollBottom >= threshold) {
                loadNextBatch();
              }
            }
          }
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.__lenis?.on("scroll", handleScroll);

    return () => {
      if (observer && sentinel) observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.__lenis?.off("scroll", handleScroll);
    };
  }, [hasMore, loadNextBatch, displayedProducts.length]);

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
      if (product.is_active === false) return false;
      const haystack = `${product.name} ${product.code} ${product.department} ${product.category} ${product.collection} ${product.material} ${product.silhouette} ${product.description} ${(product.colors || []).join(" ")}`.toLowerCase();
      return haystack.includes(cleanQ);
    });
  }, [query, productsList]);


  return (
    <div className="w-full bg-[#FBF9F6] text-near-black min-h-screen pt-20 sm:pt-28">
      {/* 1. REFINED MINIMALIST CONTROL BAR */}
      <div className="sticky top-0 z-30 bg-[#FBF9F6]/95 backdrop-blur-md border-b border-near-black/10 site-padding-x py-2 sm:py-3 transition-all">
        <div className="site-container">
          {/* Top Row: Department Tabs + Search & Filter Triggers */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4">
            {/* Department Tabs: Full width horizontal scroll with edge-to-edge padding on mobile */}
            <nav className="flex items-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none py-1 shrink-0">
              {dynamicDepartments.map((dept) => {
                const isSelected = department === dept.key;
                return (
                  <button
                    key={dept.key}
                    type="button"
                    onClick={() => handleDepartmentChange(dept.key)}
                    className={`text-[11px] sm:text-xs uppercase font-sans tracking-[0.16em] sm:tracking-[0.2em] transition-colors cursor-pointer relative py-1 shrink-0 ${
                      isSelected
                        ? "text-near-black font-semibold"
                        : "text-brand-gray hover:text-near-black"
                    }`}
                  >
                    <span>{dept.label}</span>
                    {isSelected && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-near-black" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right on Desktop / Bottom Row on Mobile: Search & Filter Triggers */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 shrink-0 pt-1.5 md:pt-0 border-t border-near-black/5 md:border-t-0">
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-[11px] sm:text-xs uppercase font-sans tracking-[0.16em] sm:tracking-[0.2em] text-near-black hover:opacity-75 transition-opacity cursor-pointer py-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{query ? `"${query}"` : "SEARCH CATALOGUE"}</span>
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="w-px h-3.5 bg-near-black/20" />

                {/* Filter Dropdown Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase font-sans tracking-[0.16em] sm:tracking-[0.2em] transition-all cursor-pointer py-1 sm:py-1.5 px-2.5 sm:px-3 border shrink-0 ${
                    isFilterDrawerOpen
                      ? "bg-near-black text-off-white border-near-black"
                      : "text-near-black border-near-black/20 hover:border-near-black bg-transparent"
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>FILTER</span>
                  {activeFiltersCount > 0 && (
                    <span
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[8px] sm:text-[9px] flex items-center justify-center font-mono font-bold ${
                        isFilterDrawerOpen ? "bg-off-white text-near-black" : "bg-near-black text-off-white"
                      }`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-500 ease-signature ${
                      isFilterDrawerOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Collections Row: Displays child collections belonging to the active Main Category */}
          {availableCollections.length > 1 && (
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pt-2 mt-1 border-t border-near-black/5 text-[9.5px] sm:text-[10px] uppercase font-mono tracking-[0.18em] sm:tracking-[0.2em]">
              <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
                {availableCollections.map((col, colIndex) => {
                  const isSelected = collection === col.key;
                  return (
                    <button
                      key={`${col.key}-${col.id || colIndex}`}
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

          {/* Dynamic Inline Filter Dropdown Panel with signature transition */}
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-signature border border-near-black/10 bg-[#F4F2ED] ${
              isFilterDrawerOpen
                ? "max-h-[950px] opacity-100 p-4 sm:p-6 mt-3"
                : "max-h-0 opacity-0 py-0 border-0 pointer-events-none mt-0"
            }`}
          >
            <div className="space-y-6">
            {/* Filter Panel Top Meta Bar */}
            <div className="flex items-center justify-between border-b border-near-black/10 pb-4 text-[10px] font-mono tracking-[0.22em] uppercase text-brand-gray">
              <div className="flex items-center gap-2 text-near-black font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>FILTER &amp; SORT CRITERIA</span>
              </div>
              <div className="flex items-center gap-4">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 text-near-black hover:opacity-60 transition-opacity underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RESET ALL ({activeFiltersCount})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="text-near-black hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1"
                >
                  <span>CLOSE</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4-Column Filter Grid (Collapsible Accordions on Mobile, Grid on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {/* Column 1: Sort Options */}
              <div className="border border-near-black/10 sm:border-0 p-3 sm:p-0 bg-white/40 sm:bg-transparent">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("sort")}
                  className="w-full flex items-center justify-between py-1 sm:py-0 cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase font-semibold">
                      01 // SORT SEQUENCE
                    </span>
                    {sort !== "curated" && (
                      <span className="sm:hidden text-[8px] font-mono uppercase bg-near-black text-off-white px-1.5 py-0.5">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-near-black transition-transform duration-300 sm:hidden ${
                      openMobileSections.sort ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  data-lenis-prevent
                  className={`overscroll-contain transition-all duration-300 ${
                    openMobileSections.sort
                      ? "max-h-[200px] overflow-y-auto scrollbar-none mt-2.5"
                      : "max-h-0 sm:max-h-[200px] overflow-hidden sm:overflow-y-auto sm:scrollbar-none sm:mt-2.5"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 pr-1">
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
                          className={`text-left text-xs uppercase font-sans tracking-[0.14em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-near-black text-off-white font-medium"
                              : "bg-near-black/[0.04] text-near-black hover:bg-near-black/[0.08]"
                          }`}
                        >
                          <span>{s.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-off-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 2: Price Brackets */}
              <div className="border border-near-black/10 sm:border-0 p-3 sm:p-0 bg-white/40 sm:bg-transparent">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("price")}
                  className="w-full flex items-center justify-between py-1 sm:py-0 cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase font-semibold">
                      02 // PRICE BRACKET
                    </span>
                    {priceIndex !== 0 && (
                      <span className="sm:hidden text-[8px] font-mono uppercase bg-near-black text-off-white px-1.5 py-0.5">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-near-black transition-transform duration-300 sm:hidden ${
                      openMobileSections.price ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  data-lenis-prevent
                  className={`overscroll-contain transition-all duration-300 ${
                    openMobileSections.price
                      ? "max-h-[200px] overflow-y-auto scrollbar-none mt-2.5"
                      : "max-h-0 sm:max-h-[200px] overflow-hidden sm:overflow-y-auto sm:scrollbar-none sm:mt-2.5"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 pr-1">
                    {PRICE_RANGES.map((rng, idx) => {
                      const isSelected = priceIndex === idx;
                      return (
                        <button
                          key={rng.label}
                          type="button"
                          onClick={() => handlePriceChange(idx)}
                          className={`text-left text-xs uppercase font-sans tracking-[0.14em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-near-black text-off-white font-medium"
                              : "bg-near-black/[0.04] text-near-black hover:bg-near-black/[0.08]"
                          }`}
                        >
                          <span>{rng.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-off-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 3: Color Spectrum */}
              <div className="border border-near-black/10 sm:border-0 p-3 sm:p-0 bg-white/40 sm:bg-transparent">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("color")}
                  className="w-full flex items-center justify-between py-1 sm:py-0 cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                      03 // COLOR SPECTRUM
                    </span>
                    {color !== "all" && (
                      <span className="sm:hidden text-[8px] font-mono uppercase bg-near-black text-off-white px-1.5 py-0.5">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-near-black transition-transform duration-300 sm:hidden ${
                      openMobileSections.color ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  data-lenis-prevent
                  className={`overscroll-contain transition-all duration-300 ${
                    openMobileSections.color
                      ? "max-h-[200px] overflow-y-auto scrollbar-none mt-2.5"
                      : "max-h-0 sm:max-h-[200px] overflow-hidden sm:overflow-y-auto sm:scrollbar-none sm:mt-2.5"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 pr-1">
                    {dynamicColors.map((clr) => {
                      const isSelected = color.toLowerCase() === clr.name.toLowerCase();
                      return (
                        <button
                          key={clr.name}
                          type="button"
                          onClick={() => handleColorChange(clr.name)}
                          className={`text-left text-xs uppercase font-sans tracking-[0.14em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-near-black text-off-white font-medium"
                              : "bg-near-black/[0.04] text-near-black hover:bg-near-black/[0.08]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border"
                              style={{
                                backgroundColor: clr.bg,
                                borderColor: clr.border,
                              }}
                            />
                            <span>{clr.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-off-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 4: Fit & Silhouette */}
              <div className="border border-near-black/10 sm:border-0 p-3 sm:p-0 bg-white/40 sm:bg-transparent">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("fit")}
                  className="w-full flex items-center justify-between py-1 sm:py-0 cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gray uppercase block font-semibold">
                      04 // FIT &amp; SILHOUETTE
                    </span>
                    {fit !== "all" && (
                      <span className="sm:hidden text-[8px] font-mono uppercase bg-near-black text-off-white px-1.5 py-0.5">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-near-black transition-transform duration-300 sm:hidden ${
                      openMobileSections.fit ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  data-lenis-prevent
                  className={`overscroll-contain transition-all duration-300 ${
                    openMobileSections.fit
                      ? "max-h-[200px] overflow-y-auto scrollbar-none mt-2.5"
                      : "max-h-0 sm:max-h-[200px] overflow-hidden sm:overflow-y-auto sm:scrollbar-none sm:mt-2.5"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 pr-1">
                    {dynamicFits.map((f) => {
                      const isSelected = fit.toLowerCase() === f.key.toLowerCase();
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => handleFitChange(f.key)}
                          className={`text-left text-xs uppercase font-sans tracking-[0.14em] py-2 px-3 transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-near-black text-off-white font-medium"
                              : "bg-near-black/[0.04] text-near-black hover:bg-near-black/[0.08]"
                          }`}
                        >
                          <span>{f.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-off-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Strip inside Dropdown */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="px-6 py-2 w-full bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.2em] hover:bg-charcoal transition-colors cursor-pointer"
              >
                APPLY &amp; VIEW
              </button>
            </div>
          </div>
        </div>
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

              {fit !== "all" && (
                <button
                  type="button"
                  onClick={() => handleFitChange("all")}
                  className="inline-flex items-center gap-1.5 text-near-black bg-white px-2 py-0.5 border border-near-black/10 hover:border-near-black cursor-pointer transition-colors"
                >
                  <span>
                    {dynamicFits.find((f) => f.key.toLowerCase() === fit.toLowerCase())?.label || fit.toUpperCase()}
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
                  <span>
                    {dynamicColors.find((c) => c.name.toLowerCase() === color.toLowerCase())?.name || color}
                  </span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-12">
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
                    {(() => {
                      const tags = dynamicCategories
                        .filter((c) => c.key !== "all")
                        .slice(0, 5)
                        .concat(allCollections.filter((c) => c.key !== "all").slice(0, 3));
                      const seen = new Set<string>();
                      const unique = tags.filter((t) => {
                        const k = (t.key || "").toLowerCase();
                        if (seen.has(k)) return false;
                        seen.add(k);
                        return true;
                      });

                      return unique.map((item, itemIdx) => (
                        <button
                          key={`${item.key}-${itemIdx}`}
                          type="button"
                          onClick={() => handleQueryChange(item.label)}
                          className="px-3.5 py-1.5 border border-near-black/15 hover:border-near-black text-xs font-mono uppercase tracking-[0.18em] transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN PRODUCT EXHIBITION GRID (BORDERLESS LOOKBOOK) */}
      <div className="site-padding-x pt-4 pb-16 sm:pt-8 sm:pb-24">
        <div className="site-container">
          {totalCount > 0 ? (
            <>
              {/* Responsive Product Grid: 2 columns on mobile, 2 on tablet, 3 on desktop to maximize screen space */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3.5 sm:gap-x-8 gap-y-8 sm:gap-y-16 transition-opacity duration-200 ${
                  isFiltering ? "opacity-40" : "opacity-100"
                }`}
              >
                {displayedProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} theme="light" />
                ))}
              </div>

              {/* Infinite Scroll Sentinel & Subtle Luxury Loading Indicator */}
              {hasMore && (
                <div ref={sentinelRef} className="mt-16 sm:mt-24 py-8 min-h-[100px] flex flex-col items-center justify-center gap-3">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.24em] uppercase text-near-black py-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-near-black" />
                      <span>UNVEILING NEXT EDITIONS...</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={loadNextBatch}
                      className="px-6 py-2.5 border border-near-black/15 text-[11px] font-mono uppercase tracking-[0.2em] text-near-black hover:border-near-black hover:bg-near-black hover:text-off-white transition-colors cursor-pointer"
                    >
                      SCROLL OR CLICK TO LOAD MORE ({Math.max(0, totalCount - displayedProducts.length)} REMAINING)
                    </button>
                  )}
                </div>
              )}

              {/* End of Catalogue Seal */}
              {!hasMore && totalCount > PRODUCTS_PER_PAGE && (
                <div className="mt-20 pt-8 border-t border-near-black/10 text-center">
                  <span className="text-[10px] font-mono tracking-[0.26em] text-brand-gray uppercase">
                    ALL {totalCount} EDITIONS PRESENTED // END OF CATALOGUE
                  </span>
                </div>
              )}
            </>
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
    </div>
  );
}
