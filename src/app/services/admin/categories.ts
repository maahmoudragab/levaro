"use server";

import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/* -------------------------------------------------------------------------- */
/* Type Definitions                                                           */
/* -------------------------------------------------------------------------- */

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  product_count?: number;
  total_stock?: number;
  collections?: CategoryItem[];
};

export type CategoryHierarchy = CategoryItem & {
  collections: CategoryItem[];
};

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  parent_id?: string | null;
  description?: string | null;
  image?: string | null;
  is_active?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

/* -------------------------------------------------------------------------- */
/* Utility Helpers                                                            */
/* -------------------------------------------------------------------------- */

const slugify = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function purgeCategoriesCache() {
  try {
    revalidateTag("categories", { expire: 0 });
    revalidateTag("products", { expire: 0 });
  } catch {
    // Fallback if called outside request lifecycle
  }
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/create");
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  revalidatePath("/shop");
}

/* -------------------------------------------------------------------------- */
/* Cached Queries (High Performance SSR with On-Demand Revalidation)          */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all categories organized into a parent-child hierarchy with product and stock counts.
 * Instant response (1-5ms), invalidated immediately on mutation via revalidateTag('categories').
 */
export const getCategoriesHierarchy = unstable_cache(
  async (): Promise<CategoryHierarchy[]> => {
    const supabase = createAdminClient();

    const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] =
      await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true }),

        supabase
          .from("products")
          .select("id, category_id, stock"),
      ]);

    if (catError) throw new Error(catError.message);
    if (prodError) throw new Error(prodError.message);

    // Compute metrics per category ID
    const productCountMap = new Map<string, number>();
    const stockCountMap = new Map<string, number>();

    (productsData ?? []).forEach((product) => {
      const catId = product.category_id as string | null;
      if (!catId) return;

      productCountMap.set(catId, (productCountMap.get(catId) ?? 0) + 1);

      const stockItems = Array.isArray(product.stock) ? product.stock : [];
      const units = stockItems.reduce((sum: number, item: Record<string, unknown>) => {
        const q =
          typeof item.stock === "number"
            ? item.stock
            : typeof item.quantity === "number"
              ? item.quantity
              : 0;
        return sum + q;
      }, 0);

      stockCountMap.set(catId, (stockCountMap.get(catId) ?? 0) + units);
    });

    const rawCategories = (categoriesData ?? []) as CategoryItem[];

    // Separate parent categories from child collections
    const parents: CategoryHierarchy[] = [];
    const childrenMap = new Map<string, CategoryItem[]>();

    rawCategories.forEach((cat) => {
      const pCount = productCountMap.get(cat.id) ?? 0;
      const sCount = stockCountMap.get(cat.id) ?? 0;
      const itemWithStats: CategoryItem = {
        ...cat,
        product_count: pCount,
        total_stock: sCount,
      };

      if (!cat.parent_id) {
        parents.push({
          ...itemWithStats,
          collections: [],
        });
      } else {
        const list = childrenMap.get(cat.parent_id) ?? [];
        list.push(itemWithStats);
        childrenMap.set(cat.parent_id, list);
      }
    });

    // Attach collections and aggregate metrics to parents
    return parents.map((parent) => {
      const collections = childrenMap.get(parent.id) ?? [];

      // Sort collections alphabetically by name
      collections.sort((a, b) => a.name.localeCompare(b.name));

      // Aggregate counts from sub-collections + direct parent assignments
      const totalChildProducts = collections.reduce(
        (sum, c) => sum + (c.product_count ?? 0),
        0,
      );
      const totalChildStock = collections.reduce(
        (sum, c) => sum + (c.total_stock ?? 0),
        0,
      );

      return {
        ...parent,
        product_count: (parent.product_count ?? 0) + totalChildProducts,
        total_stock: (parent.total_stock ?? 0) + totalChildStock,
        collections,
      };
    });
  },
  ["admin-categories-hierarchy"],
  { tags: ["categories"] },
);

/**
 * Fetches flat list of all active categories (Parent & Child) for dropdown selectors.
 */
export const getActiveCategoriesList = unstable_cache(
  async () => {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id, is_active")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["admin-categories-list"],
  { tags: ["categories"] },
);

/* -------------------------------------------------------------------------- */
/* Mutations (Server Actions with Immediate On-Demand Cache Purge)            */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new category or collection.
 */
export async function createCategory(input: CreateCategoryInput) {
  const supabase = createAdminClient();

  const cleanName = input.name.trim();
  if (!cleanName) throw new Error("Category name is required.");

  let finalSlug = input.slug?.trim() || slugify(cleanName);
  if (!finalSlug) finalSlug = `cat-${Date.now().toString(36)}`;

  // Validate slug uniqueness
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", finalSlug)
    .maybeSingle();

  if (existing) {
    finalSlug = `${finalSlug}-${Date.now().toString(36).slice(-4)}`;
  }

  // Collections with 0 products must start as inactive
  const isChildCollection = Boolean(input.parent_id);
  const initialActive = isChildCollection ? false : (input.is_active ?? true);

  const insertData = {
    id: crypto.randomUUID(),
    name: cleanName,
    slug: finalSlug,
    parent_id: input.parent_id || null,
    description: input.description?.trim() || null,
    image: input.image?.trim() || null,
    is_active: initialActive,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(insertData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  purgeCategoriesCache();
  return data;
}

/**
 * Updates an existing category or collection.
 * Enforces rule: Collections with 0 products cannot be activated.
 */
export async function updateCategory(id: string, values: UpdateCategoryInput) {
  const supabase = createAdminClient();

  // If attempting to activate, check if this is a collection and if it has products
  if (values.is_active === true) {
    const { data: currentCat } = await supabase
      .from("categories")
      .select("parent_id, name")
      .eq("id", id)
      .maybeSingle();

    if (currentCat?.parent_id) {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", id);

      if (!count || count === 0) {
        throw new Error(
          `Cannot activate "${currentCat.name}" because it has 0 products. Please add products to this collection first.`,
        );
      }
    }
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (values.name !== undefined) updateData.name = values.name.trim();
  if (values.slug !== undefined && values.slug.trim()) {
    updateData.slug = values.slug.trim();
  }
  if (values.parent_id !== undefined) updateData.parent_id = values.parent_id;
  if (values.description !== undefined)
    updateData.description = values.description?.trim() || null;
  if (values.image !== undefined)
    updateData.image = values.image?.trim() || null;
  if (values.is_active !== undefined) updateData.is_active = values.is_active;

  const { data, error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  purgeCategoriesCache();
  return data;
}

/**
 * Toggles active status of a category or collection.
 */
export async function toggleCategoryActive(id: string, isActive: boolean) {
  return updateCategory(id, { is_active: isActive });
}

/**
 * Deletes a category or collection safely.
 */
export async function deleteCategory(id: string) {
  const supabase = createAdminClient();

  // 1. Unlink any products currently referencing this category to prevent foreign key errors
  await supabase
    .from("products")
    .update({ category_id: null })
    .eq("category_id", id);

  // 2. If this is a parent category, unlink or update child collections parent_id
  await supabase
    .from("categories")
    .update({ parent_id: null })
    .eq("parent_id", id);

  // 3. Delete the category record
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  purgeCategoriesCache();
  return { success: true };
}
