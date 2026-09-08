import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCategoriesHierarchy } from "@/services/admin/categories";
import { DEPARTMENTS, FEATURED_COLLECTIONS } from "@/data/storefront";
import type { DepartmentChapter } from "@/types/storefront";
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
              { key: "men", label: "MEN", slug: "men", id: "men" },
              { key: "women", label: "WOMEN", slug: "women", id: "women" },
              { key: "accessories", label: "ACCESSORIES", slug: "accessories", id: "accessories" },
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
        { key: "men", label: "MEN", slug: "men", id: "men" },
        { key: "women", label: "WOMEN", slug: "women", id: "women" },
        { key: "accessories", label: "ACCESSORIES", slug: "accessories", id: "accessories" },
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

function getPublicCategoryImageUrl(
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
 * Fetches real active departments from Supabase (categories where parent_id is null)
 * with their real image, description, and product counts from /admin/categories.
 */
export const getStorefrontDepartments = unstable_cache(
  async (): Promise<DepartmentChapter[]> => {
    try {
      const supabase = createAdminClient();
      const hierarchy = await getCategoriesHierarchy();
      const activeParents = hierarchy.filter((p) => p.is_active !== false);

      if (!activeParents || activeParents.length === 0) {
        return DEPARTMENTS;
      }

      return activeParents.map((parent, index) => {
        const number = String(index + 1).padStart(2, "0");
        const matchingFallback = DEPARTMENTS.find(
          (d) =>
            d.id.toLowerCase() === parent.slug?.toLowerCase() ||
            d.title.toLowerCase() === parent.name?.toLowerCase(),
        );

        const resolvedImage = getPublicCategoryImageUrl(supabase, parent.image);
        const image =
          resolvedImage ||
          matchingFallback?.image ||
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1400&auto=format&fit=crop";

        const count = parent.product_count ?? 0;
        const editionText =
          count > 0
            ? `${count} EDITIONS`
            : matchingFallback?.edition || "CURATED EDITIONS";

        return {
          id: parent.slug || parent.id,
          number,
          phase: `${number} — ${parent.name.toUpperCase()}`,
          title: parent.name.toUpperCase(),
          tagline:
            parent.description ||
            matchingFallback?.tagline ||
            "Essential disciplines shaped for daily movement.",
          edition: editionText,
          narrative:
            parent.description ||
            matchingFallback?.narrative ||
            "Structured silhouettes, clean drape, and modern essentials designed to wear your own way.",
          materialSpec:
            matchingFallback?.materialSpec || "BESPOKE TEXTILES & TAILORING",
          silhouette: matchingFallback?.silhouette || "ARCHITECTURAL FORM",
          href: `/shop?department=${encodeURIComponent(
            parent.slug || parent.name.toLowerCase(),
          )}`,
          image,
        };
      });
    } catch (err) {
      console.error("Error in getStorefrontDepartments:", err);
      return DEPARTMENTS;
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
 * Fetches the 2 Curated Collections for the homepage:
 * 1. NEW ARRIVALS: latest product with is_new=true, linking to /new-arrivals.
 * 2. LATEST MEN'S COLLECTION: newest collection created under the "men" department in /admin/categories,
 *    using its uploaded image and description, linking to its dedicated page or shop.
 */
export const getStorefrontCuratedCollections = unstable_cache(
  async (): Promise<CuratedCollectionCard[]> => {
    try {
      const supabase = createAdminClient();
      const [products, hierarchy] = await Promise.all([
        getStorefrontProducts(),
        getCategoriesHierarchy(),
      ]);

      // 1. CARD 1: NEW ARRIVALS
      // "وطبعا صورة ال NEW ARRIVALS هتكون اخر منتج اضاف علية علامه ال isnew"
      const newArrivals = (products || []).filter((p) => p.is_new === true);
      const latestNewArrivalProduct = newArrivals[0] || (products || [])[0];
      const latestNewArrivalImage =
        latestNewArrivalProduct?.images?.[0] ||
        FEATURED_COLLECTIONS[0]?.imagePrimary ||
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1400&auto=format&fit=crop";

      const newArrivalsCount = newArrivals.length;
      const card1: CuratedCollectionCard = {
        id: "new-arrivals",
        title: "NEW ARRIVALS",
        subtitle:
          newArrivalsCount > 0
            ? `${newArrivalsCount} EDITIONS AVAILABLE • RECENT SILHOUETTES`
            : "RECENT EDITIONS & SILHOUETTES",
        href: "/new-arrivals",
        imagePrimary: latestNewArrivalImage,
        season: "AUTUMN / WINTER 2026",
      };

      // 2. CARD 2: LATEST COLLECTION UNDER DEPARTMENTS MEN
      // "اخر سكشن تم اضافته تحت Departments men ... وكل كوليكشن له صورة ووصف هنسخدمها برضو"
      const menDepartment = hierarchy.find((p) => {
        const s = (p.slug || "").toLowerCase();
        const n = (p.name || "").toLowerCase();
        return s === "men" || s.includes("men") || n === "men" || n.includes("men");
      });

      const menCollections = [...(menDepartment?.collections || [])].filter(
        (c) => c.is_active !== false,
      );

      // Sort by created_at descending (latest added first)
      menCollections.sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return (b.id || "").localeCompare(a.id || "");
      });

      const latestMenCol = menCollections[0];

      let card2: CuratedCollectionCard;

      if (latestMenCol) {
        // Resolve collection image from Supabase storage or external URL
        const resolvedColImage = getPublicCategoryImageUrl(
          supabase,
          latestMenCol.image,
        );

        // If no image on collection directly, find newest product in that collection
        const colProduct = products.find(
          (p) =>
            p.category_id === latestMenCol.id ||
            p.category_slug?.toLowerCase() === latestMenCol.slug?.toLowerCase() ||
            p.collection?.toLowerCase() === latestMenCol.slug?.toLowerCase(),
        );

        const colImage =
          resolvedColImage ||
          colProduct?.images?.[0] ||
          FEATURED_COLLECTIONS[1]?.imagePrimary ||
          "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop";

        const colCount = latestMenCol.product_count ?? 0;
        const colSubtitle =
          latestMenCol.description ||
          (colCount > 0
            ? `${colCount} EDITIONS AVAILABLE • MEN'S ATELIER`
            : "OBSIDIAN TAILORING & DARK FORM");

        const colHref =
          latestMenCol.slug === "men-noir" || latestMenCol.slug === "noir"
            ? "/shop?department=men&collection=men-noir"
            : `/shop?collection=${encodeURIComponent(latestMenCol.slug)}`;

        card2 = {
          id: latestMenCol.slug || latestMenCol.id,
          title: latestMenCol.name.toUpperCase(),
          subtitle: colSubtitle,
          href: colHref,
          imagePrimary: colImage,
          season: "MEN'S CAPSULE",
        };
      } else {
        // Fallback to MEN NOIR
        const noirProduct = products.find(
          (p) =>
            p.department === "men" &&
            (p.color?.toLowerCase().includes("black") ||
              p.tags?.some((t) => t.toLowerCase().includes("noir"))),
        );

        card2 = {
          id: "men-noir",
          title: "MEN NOIR",
          subtitle: "OBSIDIAN TAILORING & DARK FORM",
          href: "/shop?department=men&collection=men-noir",
          imagePrimary:
            noirProduct?.images?.[0] ||
            FEATURED_COLLECTIONS[1]?.imagePrimary ||
            "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop",
          season: "SPECIAL CAPSULE",
        };
      }

      return [card1, card2];
    } catch (err) {
      console.error("Error in getStorefrontCuratedCollections:", err);
      return [
        {
          id: "new-arrivals",
          title: "NEW ARRIVALS",
          subtitle: "RECENT EDITIONS & SILHOUETTES",
          href: "/new-arrivals",
          imagePrimary:
            FEATURED_COLLECTIONS[0]?.imagePrimary ||
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1400&auto=format&fit=crop",
        },
        {
          id: "men-noir",
          title: "MEN NOIR",
          subtitle: "OBSIDIAN TAILORING & DARK FORM",
          href: "/men-noir-collection",
          imagePrimary:
            FEATURED_COLLECTIONS[1]?.imagePrimary ||
            "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop",
        },
      ];
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
 * with their images, descriptions, product counts, and filtered shop URLs.
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

          // Resolve image: direct category image -> product image in this collection -> fallback
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
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200&auto=format&fit=crop";

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

      // If database has no sub-categories yet, provide clean atelier fallback
      if (subCategories.length === 0) {
        return [
          {
            id: "sub-men-noir",
            name: "MEN NOIR",
            slug: "men-noir",
            parent_id: "men",
            parent_name: "MEN",
            parent_slug: "men",
            description: "Monochromatic tailoring, raw obsidian textures, and dark form.",
            image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1200&auto=format&fit=crop",
            product_count: products.filter((p) => p.department === "men").length,
            href: "/shop?department=men&collection=men-noir",
          },
          {
            id: "sub-raw-denim",
            name: "RAW SELVEDGE",
            slug: "raw-denim",
            parent_id: "men",
            parent_name: "MEN",
            parent_slug: "men",
            description: "14.5oz Japanese shuttle loom raw denim engineered for permanence.",
            image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1200&auto=format&fit=crop",
            product_count: 8,
            href: "/shop?department=men&collection=raw-denim",
          },
          {
            id: "sub-tailoring",
            name: "ARCHITECTURAL TAILORING",
            slug: "tailoring",
            parent_id: "men",
            parent_name: "MEN",
            parent_slug: "men",
            description: "Sculpted wool overcoats and sharp columnar silhouettes.",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=85&w=1200&auto=format&fit=crop",
            product_count: 12,
            href: "/shop?department=men&collection=tailoring",
          },
          {
            id: "sub-fluid-poplin",
            name: "FLUID DRAPE",
            slug: "fluid-drape",
            parent_id: "women",
            parent_name: "WOMEN",
            parent_slug: "women",
            description: "High-twist poplin and flowing pleats shaped for kinetic movement.",
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200&auto=format&fit=crop",
            product_count: products.filter((p) => p.department === "women").length,
            href: "/shop?department=women&collection=fluid-drape",
          },
          {
            id: "sub-acetate-shades",
            name: "HAND-CUT ACETATE",
            slug: "acetate-shades",
            parent_id: "accessories",
            parent_name: "ACCESSORIES",
            parent_slug: "accessories",
            description: "Custom hand-finished eyewear and architectural lenses.",
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=1200&auto=format&fit=crop",
            product_count: 6,
            href: "/shop?department=accessories&collection=acetate-shades",
          },
        ];
      }

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
