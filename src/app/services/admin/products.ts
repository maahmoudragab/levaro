"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/* -------------------------------------------------------------------------- */
/* Type Definitions                                                           */
/* -------------------------------------------------------------------------- */

export type StockItem = {
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  short_description: string | null;
  brand: string | null;
  material: string | null;
  gender: string | null;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  fit: string | null;
  country_of_origin: string | null;
  tags: string[] | null;
  product_type: string | null;
  sort_order: number;
  category_id: string | null;
  color: string | null;
  stock: StockItem[] | null;
  image: string | null;
  images?: string[];
  category_name: string | null;
  created_at: string;
  updated_at: string | null;
};

export type CreateProductInput = Partial<Product> & {
  name: string;
  slug: string;
  price: number;
  tags?: string[] | string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Normalizes raw JSON database stock value into structured StockItem array.
 */
function normalizeStock(value: unknown): StockItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const size = typeof row.size === "string" ? row.size.trim() : "";
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

/**
 * Extracts first available image URL/path string from database row object.
 */
function getImageValue(row: Record<string, unknown>): string | null {
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

/**
 * Resolves a storage path or remote URL into a valid public image URL.
 */
function getPublicImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  value: string | null,
): string | null {
  if (!value) return null;

  // Filter out invalid/local temporary blob references
  if (
    value.startsWith("blob:") ||
    value.includes("blob:http") ||
    value.includes("localhost:")
  ) {
    return null;
  }

  // Already an absolute HTTP(S) or base64 URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Generate public URL from Supabase Storage bucket
  return supabase.storage
    .from("product-images")
    .getPublicUrl(value)
    .data.publicUrl;
}

/**
 * Fetches primary product images for a list of product IDs in a single batch query.
 */
async function getProductImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIds: string[],
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  if (!productIds.length) return imageMap;

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Product images query error:", error.message);
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

/* -------------------------------------------------------------------------- */
/* Database Queries                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all products with category names and primary images for admin catalog management.
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
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

  const categoryMap = new Map((categories ?? []).map((c) => [c.id, c.name]));
  const productRows = (products ?? []) as Record<string, unknown>[];
  const productIds = productRows
    .map((p) => p.id)
    .filter((id): id is string => typeof id === "string");

  const imageMap = await getProductImages(supabase, productIds);

  return productRows.map((row): Product => {
    const id = row.id as string;
    const catId = (row.category_id as string | null) ?? null;

    return {
      id,
      name: (row.name as string) ?? "",
      slug: (row.slug as string) ?? "",
      price: Number(row.price ?? 0),
      sale_price: row.sale_price != null ? Number(row.sale_price) : null,
      description: (row.description as string | null) ?? null,
      short_description: (row.short_description as string | null) ?? null,
      brand: (row.brand as string | null) ?? null,
      material: (row.material as string | null) ?? null,
      gender: (row.gender as string | null) ?? null,
      sku: (row.sku as string | null) ?? null,
      is_active: Boolean(row.is_active),
      is_featured: Boolean(row.is_featured),
      is_new: Boolean(row.is_new),
      fit: (row.fit as string | null) ?? null,
      country_of_origin: (row.country_of_origin as string | null) ?? null,
      tags: Array.isArray(row.tags)
        ? (row.tags as string[])
        : typeof row.tags === "string" && row.tags.trim()
          ? row.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : null,
      product_type: (row.product_type as string | null) ?? null,
      sort_order: Number(row.sort_order ?? 0),
      category_id: catId,
      color: (row.color as string | null) ?? null,
      stock: normalizeStock(row.stock),
      created_at: row.created_at as string,
      updated_at: (row.updated_at as string | null) ?? null,
      image: imageMap.get(id) ?? null,
      category_name: catId ? categoryMap.get(catId) ?? null : null,
    };
  });
}

/**
 * Fetches a single product by its unique slug (or fallback UUID) along with its complete image gallery.
 * Supports multilingual / Arabic slugs and URI-encoded routes.
 */
export async function getProductById(
  idOrSlug: string,
): Promise<(Product & { images: string[] }) | null> {
  const supabase = await createClient();
  const cleanIdOrSlug = decodeURIComponent(idOrSlug);

  // Try finding product by decoded slug first
  let { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", cleanIdOrSlug)
    .maybeSingle();

  // If not found and slug differed from original, try raw parameter
  if (!product && cleanIdOrSlug !== idOrSlug) {
    const res = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("slug", idOrSlug)
      .maybeSingle();
    product = res.data;
  }

  // Fallback: match by UUID if slug lookup yields no record
  if (!product) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        cleanIdOrSlug,
      );
    if (isUuid) {
      const res = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", cleanIdOrSlug)
        .maybeSingle();
      product = res.data;
    }
  }

  if (!product) return null;

  // Retrieve associated gallery images in order
  const { data: imagesData } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const images = (imagesData ?? [])
    .map((img) => getPublicImageUrl(supabase, getImageValue(img)))
    .filter((img): img is string => Boolean(img));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price ?? 0),
    sale_price: product.sale_price != null ? Number(product.sale_price) : null,
    description: product.description ?? null,
    short_description: product.short_description ?? null,
    brand: product.brand ?? null,
    material: product.material ?? null,
    gender: product.gender ?? null,
    sku: product.sku ?? null,
    is_active: Boolean(product.is_active),
    is_featured: Boolean(product.is_featured),
    is_new: Boolean(product.is_new),
    fit: product.fit ?? null,
    country_of_origin: product.country_of_origin ?? null,
    tags: Array.isArray(product.tags)
      ? product.tags
      : typeof product.tags === "string" && product.tags.trim()
        ? product.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    product_type: product.product_type ?? null,
    sort_order: Number(product.sort_order ?? 0),
    category_id: product.category_id ?? null,
    color: product.color ?? null,
    stock: normalizeStock(product.stock),
    created_at: product.created_at,
    updated_at: product.updated_at ?? null,
    image: images[0] ?? null,
    images,
    category_name: product.categories?.name ?? null,
  };
}

export const getProductBySlug = getProductById;

/* -------------------------------------------------------------------------- */
/* Database Mutations (Server Actions)                                       */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new product record and saves associated gallery images.
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Record<string, unknown>> {
  const supabase = await createClient();

  // Validate unique slug constraint
  if (input.slug) {
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", input.slug.trim())
      .maybeSingle();

    if (existingSlug) {
      throw new Error(`A product with the slug "${input.slug}" already exists.`);
    }
  }

  const formattedTags: string[] | null = Array.isArray(input.tags)
    ? input.tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
    : typeof input.tags === "string" && (input.tags as string).trim()
      ? (input.tags as string)
          .split(",")
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean)
      : null;

  const productId = input.id || crypto.randomUUID();

  const productData = {
    id: productId,
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    short_description: input.short_description ?? null,
    brand: input.brand ?? null,
    material: input.material ?? null,
    gender: input.gender ?? null,
    price: input.price,
    sale_price: input.sale_price ?? null,
    sku: input.sku ?? null,
    is_active: input.is_active ?? true,
    is_featured: input.is_featured ?? false,
    is_new: input.is_new ?? false,
    fit: input.fit ?? null,
    country_of_origin: input.country_of_origin ?? null,
    tags: formattedTags,
    product_type: input.product_type ?? null,
    sort_order: input.sort_order ?? 0,
    category_id: input.category_id || null,
    color: input.color ?? null,
    stock: normalizeStock(input.stock),
  };

  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (productError || !newProduct) {
    throw new Error(
      `Failed to create product: ${productError?.message ?? "Unknown database error"}`,
    );
  }

  // Insert image gallery entries
  if (input.images && input.images.length > 0) {
    const imageRows = input.images.map((imgUrl, index) => ({
      product_id: productId,
      image_url: imgUrl,
      alt_text: input.name,
      is_primary: index === 0,
      sort_order: index,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(imageRows);

    if (imagesError) {
      console.error("Failed to insert product images:", imagesError.message);
    }
  }

  return newProduct;
}

/**
 * Updates an existing product record and synchronizes gallery images.
 */
export async function updateProduct(
  id: string,
  values: UpdateProductInput,
): Promise<Record<string, unknown>> {
  const supabase = createAdminClient();

  // Validate unique slug if modified
  if (values.slug !== undefined && values.slug.trim()) {
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", values.slug.trim())
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      throw new Error(
        `The slug "${values.slug}" is already in use by another product.`,
      );
    }
  }

  const updateData: Record<string, unknown> = {};

  if (values.name !== undefined) updateData.name = values.name;
  if (values.slug !== undefined) updateData.slug = values.slug;
  if (values.description !== undefined) updateData.description = values.description;
  if (values.short_description !== undefined)
    updateData.short_description = values.short_description;
  if (values.brand !== undefined) updateData.brand = values.brand;
  if (values.material !== undefined) updateData.material = values.material;
  if (values.gender !== undefined) updateData.gender = values.gender;
  if (values.price !== undefined) updateData.price = values.price;
  if (values.sale_price !== undefined) updateData.sale_price = values.sale_price;
  if (values.sku !== undefined) updateData.sku = values.sku;
  if (values.is_active !== undefined) updateData.is_active = values.is_active;
  if (values.is_featured !== undefined) updateData.is_featured = values.is_featured;
  if (values.is_new !== undefined) updateData.is_new = values.is_new;
  if (values.fit !== undefined) updateData.fit = values.fit;
  if (values.country_of_origin !== undefined)
    updateData.country_of_origin = values.country_of_origin;
  if (values.tags !== undefined) {
    updateData.tags = Array.isArray(values.tags)
      ? values.tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
      : typeof values.tags === "string" && (values.tags as string).trim()
        ? (values.tags as string)
            .split(",")
            .map((t: string) => t.trim().toLowerCase())
            .filter(Boolean)
        : null;
  }
  if (values.product_type !== undefined)
    updateData.product_type = values.product_type;
  if (values.color !== undefined) updateData.color = values.color;
  if (values.category_id !== undefined)
    updateData.category_id = values.category_id;
  if (values.stock !== undefined) updateData.stock = normalizeStock(values.stock);

  updateData.updated_at = new Date().toISOString();

  const { data: updatedProduct, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !updatedProduct) {
    throw new Error(error?.message ?? "Failed to update product");
  }

  // Update gallery images if provided
  if (values.images !== undefined) {
    await supabase.from("product_images").delete().eq("product_id", id);

    if (values.images.length > 0) {
      const imageRows = values.images.map((imgUrl, index) => ({
        product_id: id,
        image_url: imgUrl,
        alt_text: values.name ?? updatedProduct.name,
        is_primary: index === 0,
        sort_order: index,
      }));

      await supabase.from("product_images").insert(imageRows);
    }
  }

  return updatedProduct;
}

/**
 * Toggles product active visibility status.
 */
export async function toggleProductActive(id: string, value: boolean) {
  return updateProduct(id, { is_active: value });
}

/**
 * Toggles product featured highlight status.
 */
export async function toggleProductFeatured(id: string, value: boolean) {
  return updateProduct(id, { is_featured: value });
}

/**
 * Deletes a product, its database records, and all uploaded images in storage.
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // Delete image relations
  const { error: imagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (imagesError) {
    console.error("Failed to delete product images records:", imagesError.message);
  }

  // Delete image files in Supabase Storage
  try {
    const { data: fileList } = await supabase.storage
      .from("product-images")
      .list(id);

    if (fileList && fileList.length > 0) {
      const pathsToDelete = fileList.map((f) => `${id}/${f.name}`);
      await supabase.storage.from("product-images").remove(pathsToDelete);
    }
  } catch (storageErr) {
    console.error("Storage delete error:", storageErr);
  }

  // Delete main product entry
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

/* -------------------------------------------------------------------------- */
/* Storage Upload Operations                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Uploads a product photo to the `product-images` bucket in Supabase Storage.
 */
export async function uploadProductImage(
  formData: FormData,
): Promise<{ url: string; path: string }> {
  const supabase = createAdminClient();
  const file = formData.get("file") as File | null;
  const productId = (formData.get("productId") as string) || "general";
  const index = (formData.get("index") as string) || "0";

  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const fileName = `${index}-${Date.now()}-${cleanBaseName}.${ext}`;
  const filePath = `${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, path: filePath };
}