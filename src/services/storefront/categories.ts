import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCategoriesHierarchy } from "@/services/admin/categories";
import type { DepartmentChapter, ProductItem } from "@/types/storefront";
import { getStorefrontProducts } from "@/services/storefront/products";

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  is_active: boolean;
}

export interface StorefrontTaxonomyItem {
  key: string;
  label: string;
  slug: string;
  id: string;
  parent_id?: string | null;
  parent_slug?: string | null;
  parent_name?: string | null;
  is_active?: boolean;
  product_count?: number;
}

export interface StorefrontTaxonomies {
  mainCategories: StorefrontTaxonomyItem[];
  subCategories: StorefrontTaxonomyItem[];
  departments: StorefrontTaxonomyItem[];
  categories: StorefrontTaxonomyItem[];
  collections: StorefrontTaxonomyItem[];
}

/**
 * Resolves public image URL from Supabase storage or external URL.
 */
export function getPublicCategoryImageUrl(
  supabase: ReturnType<typeof createAdminClient>,
  value: string | null,
): string | null {
  if (!value) return null;
  if (
    value.startsWith("blob:") ||
    value.includes("blob:http") ||
    value.includes("localhost:")
  ) {
    return null;
  }
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }
  return supabase.storage
    .from("product-images")
    .getPublicUrl(value)
    .data.publicUrl;
}

/**
 * Fetches all storefront categories directly from Supabase.
 */
export const getStorefrontCategories = unstable_cache(
  async (): Promise<StorefrontCategory[]> => {
    try {
      const supabase = createAdminClient();

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id, description, is_active")
        .order("name", { ascending: true });

      if (error || !data) {
        return [];
      }

      return data as StorefrontCategory[];
    } catch (err) {
      console.error("Error in getStorefrontCategories:", err);
      return [];
    }
  },
  ["storefront-categories"],
  {
    revalidate: 3600,
    tags: ["storefront-categories", "categories"],
  },
);

/**
 * Fetches structured taxonomies from Supabase categories hierarchy.
 * Uses the exact same hierarchy as the admin dashboard (Categories & Collections).
 */
export const getStorefrontTaxonomies = unstable_cache(
  async (): Promise<StorefrontTaxonomies> => {
    try {
      const hierarchy = await getCategoriesHierarchy();

      // Parent categories are Disciplines / Main Categories
      const dynamicMainCategories: StorefrontTaxonomyItem[] = hierarchy.map((parent) => ({
        key: parent.slug,
        label: parent.name.toUpperCase(),
        slug: parent.slug,
        id: parent.id,
      }));

      // Child collections directly under each parent from the database
      const subCategoriesList: StorefrontTaxonomyItem[] = [];
      hierarchy.forEach((parent) => {
        (parent.collections || []).forEach((col) => {
          if (col.is_active === false) return;
          subCategoriesList.push({
            key: col.slug,
            label: col.name.toUpperCase(),
            slug: col.slug,
            id: col.id,
            parent_id: parent.id,
            parent_slug: parent.slug,
            parent_name: parent.name.toUpperCase(),
            is_active: col.is_active,
            product_count: col.product_count ?? 0,
          });
        });
      });

      const mainCategoriesList: StorefrontTaxonomyItem[] =
        dynamicMainCategories.length > 0
          ? [
              { key: "all", label: "ALL DISCIPLINES", slug: "all", id: "all" },
              ...dynamicMainCategories,
            ]
          : [
              { key: "all", label: "ALL DISCIPLINES", slug: "all", id: "all" },
            ];

      return {
        mainCategories: mainCategoriesList,
        subCategories: subCategoriesList,
        departments: mainCategoriesList,
        categories: dynamicMainCategories,
        collections: subCategoriesList,
      };
    } catch (err) {
      console.error("Error in getStorefrontTaxonomies:", err);
      const defaultDepts: StorefrontTaxonomyItem[] = [
        { key: "all", label: "ALL DISCIPLINES", slug: "all", id: "all" },
      ];
      return {
        mainCategories: defaultDepts,
        subCategories: [],
        departments: defaultDepts,
        categories: [],
        collections: [],
      };
    }
  },
  ["storefront-taxonomies"],
  {
    revalidate: 3600,
    tags: ["categories", "storefront-categories"],
  },
);

/**
 * Fetches real active departments from Supabase (categories where parent_id is null)
 * with their real image, description, and product counts from Supabase.
 */
export const getStorefrontDepartments = unstable_cache(
  async (): Promise<DepartmentChapter[]> => {
    try {
      const supabase = createAdminClient();
      const hierarchy = await getCategoriesHierarchy();
      const activeParents = hierarchy.filter((p) => p.is_active !== false);

      if (!activeParents || activeParents.length === 0) {
        return [];
      }

      return activeParents.map((parent, index) => {
        const number = String(index + 1).padStart(2, "0");
        const resolvedImage = getPublicCategoryImageUrl(supabase, parent.image);
        const image = resolvedImage || "";
        const count = parent.product_count ?? 0;
        const editionText = `${count} ${count === 1 ? "EDITION" : "EDITIONS"}`;

        return {
          id: parent.slug || parent.id,
          number,
          phase: `${number} — ${parent.name.toUpperCase()}`,
          title: parent.name.toUpperCase(),
          tagline:
            parent.description ||
            "Essential disciplines shaped for daily movement.",
          edition: editionText,
          narrative:
            parent.description ||
            "Structured silhouettes, clean drape, and modern essentials designed to wear your own way.",
          materialSpec: "BESPOKE TEXTILES & TAILORING",
          silhouette: "ARCHITECTURAL FORM",
          href: `/shop?department=${encodeURIComponent(
            parent.slug || parent.name.toLowerCase(),
          )}`,
          image,
        };
      });
    } catch (err) {
      console.error("Error in getStorefrontDepartments:", err);
      return [];
    }
  },
  ["storefront-departments"],
  {
    revalidate: 3600,
    tags: ["categories", "storefront-categories", "products"],
  },
);

export interface CuratedCollectionCard {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imagePrimary: string;
  season?: string;
}

/**
 * Fetches the Curated Collections for the homepage strictly from Supabase:
 * 1. NEW ARRIVALS: latest product with is_new=true from Supabase.
 * 2. LATEST COLLECTION: newest collection created in /admin/categories from Supabase.
 */
export const getStorefrontCuratedCollections = unstable_cache(
  async (): Promise<CuratedCollectionCard[]> => {
    try {
      const supabase = createAdminClient();
      const [products, hierarchy] = await Promise.all([
        getStorefrontProducts(),
        getCategoriesHierarchy(),
      ]);

      if (!products || products.length === 0) {
        return [];
      }

      const cards: CuratedCollectionCard[] = [];

      // 1. CARD 1: NEW ARRIVALS (from live Supabase products)
      const newArrivals = products.filter((p) => p.is_new === true);
      const latestNewArrivalProduct = newArrivals[0] || products[0];

      if (latestNewArrivalProduct) {
        const latestNewArrivalImage =
          latestNewArrivalProduct.images?.[0] || "";
        const newArrivalsCount = newArrivals.length;

        cards.push({
          id: "new-arrivals",
          title: "NEW ARRIVALS",
          subtitle:
            newArrivalsCount > 0
              ? `${newArrivalsCount} EDITIONS AVAILABLE • RECENT SILHOUETTES`
              : "RECENT EDITIONS & SILHOUETTES",
          href: "/new-arrivals",
          imagePrimary: latestNewArrivalImage,
          season: "SEASONAL CAPSULE",
        });
      }

      // 2. CARD 2: LATEST COLLECTION IN SUPABASE
      const allCollections: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
        description: string | null;
        created_at?: string;
        product_count?: number;
      }[] = [];

      hierarchy.forEach((parent) => {
        (parent.collections || []).forEach((c) => {
          if (c.is_active !== false) {
            allCollections.push(c);
          }
        });
      });

      // Sort by created_at descending (latest added first)
      allCollections.sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeB - timeA;
      });

      const latestCol = allCollections[0];

      if (latestCol) {
        const resolvedColImage = getPublicCategoryImageUrl(
          supabase,
          latestCol.image,
        );

        const colProduct = products.find(
          (p) =>
            p.category_id === latestCol.id ||
            p.category_slug?.toLowerCase() === latestCol.slug?.toLowerCase() ||
            p.collection?.toLowerCase() === latestCol.slug?.toLowerCase(),
        );

        const colImage =
          resolvedColImage ||
          colProduct?.images?.[0] ||
          "";

        const colCount = latestCol.product_count ?? 0;
        const colSubtitle =
          latestCol.description ||
          (colCount > 0
            ? `${colCount} EDITIONS AVAILABLE • ATELIER CAPSULE`
            : "CURATED ATELIER CAPSULE");

        cards.push({
          id: latestCol.slug || latestCol.id,
          title: latestCol.name.toUpperCase(),
          subtitle: colSubtitle,
          href: `/shop?collection=${encodeURIComponent(latestCol.slug)}`,
          imagePrimary: colImage,
          season: "ATELIER CAPSULE",
        });
      }

      return cards;
    } catch (err) {
      console.error("Error in getStorefrontCuratedCollections:", err);
      return [];
    }
  },
  ["storefront-curated-collections"],
  {
    revalidate: 3600,
    tags: ["categories", "storefront-categories", "products", "storefront-products"],
  },
);

export interface StorefrontSubCategoryCard {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  parent_name: string;
  parent_slug: string;
  description: string;
  image: string;
  product_count: number;
  href: string;
}

/**
 * Fetches all active sub-categories (collections) organized under parent departments
 * strictly from Supabase.
 */
export const getAllStorefrontSubCategories = unstable_cache(
  async (): Promise<StorefrontSubCategoryCard[]> => {
    try {
      const supabase = createAdminClient();
      const [hierarchy, products] = await Promise.all([
        getCategoriesHierarchy(),
        getStorefrontProducts(),
      ]);

      const subCategories: StorefrontSubCategoryCard[] = [];

      hierarchy.forEach((parent) => {
        const parentName = parent.name.toUpperCase();
        const parentSlug = parent.slug.toLowerCase();

        (parent.collections || []).forEach((col) => {
          if (col.is_active === false) return;

          const resolvedImg = getPublicCategoryImageUrl(supabase, col.image);
          const matchingProduct = products.find(
            (p) =>
              p.category_id === col.id ||
              p.category_slug?.toLowerCase() === col.slug.toLowerCase() ||
              p.collection?.toLowerCase() === col.slug.toLowerCase(),
          );

          const image =
            resolvedImg ||
            matchingProduct?.images?.[0] ||
            "";

          const count = col.product_count ?? 0;

          subCategories.push({
            id: col.id,
            name: col.name.toUpperCase(),
            slug: col.slug,
            parent_id: parent.id,
            parent_name: parentName,
            parent_slug: parentSlug,
            description:
              col.description ||
              `Curated ${col.name} editions tailored for modern movement.`,
            image,
            product_count: count,
            href: `/shop?department=${encodeURIComponent(parentSlug)}&collection=${encodeURIComponent(col.slug)}`,
          });
        });
      });

      return subCategories;
    } catch (err) {
      console.error("Error in getAllStorefrontSubCategories:", err);
      return [];
    }
  },
  ["storefront-all-subcategories"],
  {
    revalidate: 3600,
    tags: ["categories", "storefront-categories", "products"],
  },
);

/* -------------------------------------------------------------------------- */
/* Dynamic Supabase Category Resolution & SEO Helpers                          */
/* -------------------------------------------------------------------------- */

export interface ResolvedCategory {
  id: string;
  key: string;
  slug: string;
  name: string;
  arabicName: string;
  description: string;
  image: string;
  parentSlug?: string | null;
  parentName?: string | null;
}

/**
 * Resolves a category dynamically from Supabase categories table by slug or ID.
 * Returns null if category does not exist in Supabase.
 */
export async function getStorefrontCategoryBySlug(
  slug: string
): Promise<ResolvedCategory | null> {
  const clean = decodeURIComponent(slug).toLowerCase().trim();

  try {
    const supabase = createAdminClient();

    // 1. Fetch category directly from Supabase
    const { data: cat, error } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id, description, image, is_active")
      .or(`slug.ilike.${clean},id.eq.${clean}`)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !cat) {
      return null;
    }

    // 2. If it has a parent_id, resolve parent info from Supabase
    let parentSlug: string | null = null;
    let parentName: string | null = null;
    if (cat.parent_id) {
      const { data: parentCat } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("id", cat.parent_id)
        .maybeSingle();
      if (parentCat) {
        parentSlug = parentCat.slug;
        parentName = parentCat.name.toUpperCase();
      }
    }

    // 3. Resolve category image
    let resolvedImage = getPublicCategoryImageUrl(supabase, cat.image);

    // If category has no image attached, find image of newest product in that category
    if (!resolvedImage) {
      const { data: productInCat } = await supabase
        .from("products")
        .select(`
          id,
          product_images (
            image_url,
            is_primary,
            sort_order
          )
        `)
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (
        productInCat &&
        Array.isArray(productInCat.product_images) &&
        productInCat.product_images.length > 0
      ) {
        const sorted = [...productInCat.product_images].sort(
          (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
        );
        resolvedImage = getPublicCategoryImageUrl(
          supabase,
          sorted[0]?.image_url ?? null
        );
      }
    }

    const fallbackDescription = `تشكيلة ${cat.name} الفاخرة — تصميم وأقمشة حصرية من دار ليفارو LÉVARO للأزياء في مصر.`;

    return {
      id: cat.id,
      key: cat.slug,
      slug: cat.slug,
      name: cat.name,
      arabicName: `قسم ${cat.name} — دار ليفارو`,
      description: cat.description?.trim() || fallbackDescription,
      image: resolvedImage || "",
      parentSlug,
      parentName,
    };
  } catch (err) {
    console.error(`Error in getStorefrontCategoryBySlug(${slug}):`, err);
    return null;
  }
}

/**
 * Returns all active category slugs directly from Supabase for sitemap and static params.
 */
export async function getStorefrontCategorySlugs(): Promise<{ slug: string }[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug")
      .eq("is_active", true);

    if (error || !data) return [];
    return data
      .filter((c) => Boolean(c.slug))
      .map((c) => ({ slug: c.slug }));
  } catch (err) {
    console.error("Error in getStorefrontCategorySlugs:", err);
    return [];
  }
}

/**
 * Filters storefront products belonging to a resolved category dynamically based on Supabase relations.
 */
export function filterProductsByCategory(
  products: ProductItem[],
  category: ResolvedCategory
): ProductItem[] {
  const targetSlug = category.slug.toLowerCase().trim();
  const targetId = category.id;

  return products.filter((p: ProductItem) => {
    // 1. Match direct category ID in Supabase
    if (p.category_id && p.category_id === targetId) return true;

    // 2. Match parent category ID (if category is a parent department, match child products)
    if (p.category_parent_id && p.category_parent_id === targetId) return true;

    // 3. Match category slug or department slug
    if (p.category_slug && p.category_slug.toLowerCase() === targetSlug) return true;
    if (p.department && p.department.toLowerCase() === targetSlug) return true;
    if (p.collection && p.collection.toLowerCase() === targetSlug) return true;
    if (p.category && p.category.toLowerCase() === targetSlug) return true;

    // 4. Match tags from Supabase
    const tagsList: string[] = Array.isArray(p.tags) ? (p.tags as string[]) : [];
    if (
      tagsList.some(
        (t: string) =>
          t.toLowerCase() === targetSlug ||
          t.toLowerCase() === category.name.toLowerCase()
      )
    ) {
      return true;
    }

    return false;
  });
}
