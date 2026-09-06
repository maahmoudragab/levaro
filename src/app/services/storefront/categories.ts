import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

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
}

export interface StorefrontTaxonomies {
  mainCategories: StorefrontTaxonomyItem[];
  subCategories: StorefrontTaxonomyItem[];
  departments: StorefrontTaxonomyItem[];
  categories: StorefrontTaxonomyItem[];
  collections: StorefrontTaxonomyItem[];
}

/**
 * Fetches all active storefront categories.
 * Cached for 1 hour with on-demand tag revalidation.
 */
export const getStorefrontCategories = unstable_cache(
  async (): Promise<StorefrontCategory[]> => {
    try {
      const supabase = createAdminClient();

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id, description, is_active")
        .eq("is_active", true)
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
 * Fetches structured taxonomies from Supabase categories.
 * Parents (parent_id is null) are main categories (الكاتيجوري الأساسي).
 * Children (parent_id is not null) are sub-categories/collections (الكاتيجوريهات الابن).
 */
export const getStorefrontTaxonomies = unstable_cache(
  async (): Promise<StorefrontTaxonomies> => {
    try {
      const allCategories = await getStorefrontCategories();

      const parents = allCategories.filter((c) => !c.parent_id);
      const children = allCategories.filter((c) => Boolean(c.parent_id));

      const parentMap = new Map<string, StorefrontCategory>();
      parents.forEach((p) => parentMap.set(p.id, p));

      // Build main categories directly from Supabase parent categories
      const dynamicMainCategories: StorefrontTaxonomyItem[] = parents.map((p) => ({
        key: p.slug,
        label: p.name.toUpperCase(),
        slug: p.slug,
        id: p.id,
      }));

      // Combined main categories with "ALL DISCIPLINES"
      const mainCategoriesList: StorefrontTaxonomyItem[] = [
        { key: "all", label: "ALL DISCIPLINES", slug: "all", id: "all" },
      ];

      dynamicMainCategories.forEach((m) => {
        if (!mainCategoriesList.some((item) => item.key.toLowerCase() === m.key.toLowerCase())) {
          mainCategoriesList.push(m);
        }
      });

      // Ensure foundational disciplines exist as fallbacks if not yet in database
      const fallbackDisciplines = ["men", "women", "accessories"];
      fallbackDisciplines.forEach((deptKey) => {
        if (!mainCategoriesList.some((m) => m.key.toLowerCase() === deptKey)) {
          mainCategoriesList.push({
            key: deptKey,
            label: deptKey.toUpperCase(),
            slug: deptKey,
            id: deptKey,
          });
        }
      });

      // Build child sub-categories directly linked to their parent category
      const subCategoriesList: StorefrontTaxonomyItem[] = children.map((c) => {
        const parent = c.parent_id ? parentMap.get(c.parent_id) : null;
        return {
          key: c.slug,
          label: c.name.toUpperCase(),
          slug: c.slug,
          id: c.id,
          parent_id: c.parent_id,
          parent_slug: parent?.slug || null,
          parent_name: parent?.name ? parent.name.toUpperCase() : null,
        };
      });

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
    tags: ["storefront-categories", "categories"],
  },
);
