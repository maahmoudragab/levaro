"use server";

import { createClient } from "@/lib/supabase/server";

export type StockItem = {
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  brand: string | null;
  material: string | null;
  gender: string | null;
  price: number;
  sale_price: number | null;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  updated_at: string | null;
  fit: string | null;
  country_of_origin: string | null;
  tags: string[] | null;
  is_new: boolean;
  product_type: string | null;
  sort_order: number;
  category_id: string | null;
  color: string | null;
  stock: StockItem[] | null;
  image: string | null;
  category_name: string | null;
};

function normalizeStock(value: unknown): StockItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const row = item as Record<string, unknown>;
      const size = typeof row.size === "string" ? row.size : "";
      const stock =
        typeof row.stock === "number"
          ? row.stock
          : typeof row.quantity === "number"
            ? row.quantity
            : 0;

      return size ? { size, stock } : null;
    })
    .filter(Boolean) as StockItem[];
}

function getImageValue(row: Record<string, unknown>) {
  const candidates = [
    row.image_url,
    row.url,
    row.path,
    row.image,
    row.file_path,
    row.storage_path,
  ];

  const value = candidates.find(
    (item) => typeof item === "string" && item.trim(),
  );

  return typeof value === "string" ? value : null;
}

function getPublicImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  value: string | null,
) {
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  return supabase.storage
    .from("products")
    .getPublicUrl(value).data.publicUrl;
}

async function getProductImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIds: string[],
) {
  const imageMap = new Map<string, string>();

  if (!productIds.length) return imageMap;

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Product images:", error.message);
    return imageMap;
  }

  for (const row of data ?? []) {
    const productId = row.product_id as string | undefined;

    if (!productId || imageMap.has(productId)) continue;

    const rawValue = getImageValue(row);
    const url = getPublicImageUrl(supabase, rawValue);

    if (url) imageMap.set(productId, url);
  }

  return imageMap;
}

export async function getProducts() {
  const supabase = await createClient();

  const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),

      supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

  if (productsError) throw new Error(productsError.message);
  if (categoriesError) throw new Error(categoriesError.message);

  const categoryMap = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );

  const productRows = (products ?? []) as Record<string, unknown>[];

  const imageMap = await getProductImages(
    supabase,
    productRows
      .map((product) => product.id)
      .filter((id): id is string => typeof id === "string"),
  );

  return productRows.map(
    (product): Product => {
      const id = product.id as string;

      return {
        id,
        created_at: product.created_at as string,
        name: (product.name as string) ?? "",
        slug: (product.slug as string) ?? "",
        description: (product.description as string | null) ?? null,
        short_description:
          (product.short_description as string | null) ?? null,
        brand: (product.brand as string | null) ?? null,
        material: (product.material as string | null) ?? null,
        gender: (product.gender as string | null) ?? null,
        price: Number(product.price ?? 0),
        sale_price:
          product.sale_price == null
            ? null
            : Number(product.sale_price),
        sku: (product.sku as string | null) ?? null,
        is_active: Boolean(product.is_active),
        is_featured: Boolean(product.is_featured),
        updated_at: (product.updated_at as string | null) ?? null,
        fit: (product.fit as string | null) ?? null,
        country_of_origin:
          (product.country_of_origin as string | null) ?? null,
        tags: Array.isArray(product.tags)
          ? (product.tags as string[])
          : null,
        is_new: Boolean(product.is_new),
        product_type:
          (product.product_type as string | null) ?? null,
        sort_order: Number(product.sort_order ?? 0),
        category_id:
          (product.category_id as string | null) ?? null,
        color: (product.color as string | null) ?? null,
        stock: normalizeStock(product.stock),
        image: imageMap.get(id) ?? null,
        category_name:
          categoryMap.get(product.category_id as string) ?? null,
      };
    },
  );
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error: imagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (imagesError) throw new Error(imagesError.message);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function toggleProductActive(id: string, value: boolean) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: value,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, is_active")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function toggleProductFeatured(id: string, value: boolean) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      is_featured: value,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, is_featured")
    .single();

  if (error) throw new Error(error.message);

  return data;
}
