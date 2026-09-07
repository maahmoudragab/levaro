import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCategoriesHierarchy } from "@/app/services/admin/categories";

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
