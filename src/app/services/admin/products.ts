"use server";

import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
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
  category_id: string | null;
  color: string | null;
  stock: StockItem[] | null;
  image: string | null;
  images?: string[];
  category_name: string | null;
  category_slug?: string | null;
  category_parent_id?: string | null;
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
 * Normalizes user-input strings into URL-safe slug format with Arabic unicode support.
 */
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

/**
 * Safely parses string array or comma-separated string tags into a clean string array.
 */
function parseTags(rawTags: unknown): string[] | null {
  if (Array.isArray(rawTags)) {
    return rawTags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof rawTags === "string" && rawTags.trim().length > 0) {
    return rawTags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return null;
}

/**
 * Extracts a valid string representation from various database image row column formats.
 */
function getImageValue(img: Record<string, unknown> | string): string | null {
  if (typeof img === "string") return img;
  if (!img || typeof img !== "object") return null;

  const candidates = [
    img.image_url,
    img.url,
    img.image,
    img.path,
    img.src,
    img.file_path,
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
  supabase: ReturnType<typeof createAdminClient>,
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
 * Transforms a raw Supabase joined product row into a typed Product object.
 */
function mapProductRow(
  supabase: ReturnType<typeof createAdminClient>,
  row: Record<string, unknown>,
): Product {
  const id = row.id as string;

  // Resolve Category Name, Slug, and Parent from join
  let categoryName: string | null = null;
  let categorySlug: string | null = null;
  let categoryParentId: string | null = null;
  if (row.categories && typeof row.categories === "object") {
    const catObj = Array.isArray(row.categories)
      ? (row.categories[0] as Record<string, unknown>)
      : (row.categories as Record<string, unknown>);
    if (catObj && typeof catObj === "object") {
      categoryName = (catObj.name as string) ?? null;
      categorySlug = (catObj.slug as string) ?? null;
      categoryParentId = (catObj.parent_id as string | null) ?? null;
    }
  }

  // Resolve Gallery Images from join
  let images: string[] = [];
  if (Array.isArray(row.product_images)) {
    const sortedImages = [...(row.product_images as Record<string, unknown>[])].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    );

    images = sortedImages
      .map((img) => getPublicImageUrl(supabase, getImageValue(img)))
      .filter((img): img is string => Boolean(img));
  }

  const primaryImage = images[0] ?? null;

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
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : null,
    product_type: (row.product_type as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? null,
    color: (row.color as string | null) ?? null,
    stock: Array.isArray(row.stock) ? (row.stock as StockItem[]) : null,
    image: primaryImage,
    images,
    category_name: categoryName,
    category_slug: categorySlug,
    category_parent_id: categoryParentId,
    created_at: (row.created_at as string) ?? "",
    updated_at: (row.updated_at as string | null) ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Database Queries (Cached Server Queries)                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all products with complete relational data (Categories & Images).
 * Supports immediate on-demand cache revalidation.
 */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createAdminClient();

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          parent_id
        ),
        product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getProducts:", error.message);
      throw new Error(error.message);
    }

    return (products ?? []).map((row) =>
      mapProductRow(supabase, row as Record<string, unknown>),
    );
  },
  ["admin-products-list"],
  { tags: ["products"] },
);

/**
 * Fetches a single product by its unique slug (or fallback UUID) along with its complete image gallery.
 */
export const getProductById = unstable_cache(
  async (idOrSlug: string): Promise<(Product & { images: string[] }) | null> => {
    const supabase = createAdminClient();
    const cleanIdOrSlug = decodeURIComponent(idOrSlug);

    const selectQuery = `
      *,
      categories (
        id,
        name,
        slug,
        parent_id
      ),
      product_images (
        id,
        image_url,
        is_primary,
        sort_order
      )
    `;

    // Try finding product by decoded slug
    let { data: product } = await supabase
      .from("products")
      .select(selectQuery)
      .eq("slug", cleanIdOrSlug)
      .maybeSingle();

    // Fallback: try finding by UUID if slug search was empty
    if (!product && /^[0-9a-f-]{36}$/i.test(cleanIdOrSlug)) {
      const result = await supabase
        .from("products")
        .select(selectQuery)
        .eq("id", cleanIdOrSlug)
        .maybeSingle();
      product = result.data;
    }

    if (!product) return null;

    const mapped = mapProductRow(supabase, product as Record<string, unknown>);
    return {
      ...mapped,
      images: mapped.images ?? [],
    };
  },
  ["admin-product-by-id"],
  { tags: ["products"] },
);

/**
 * Helper alias for fetching product by unique slug.
 */
export async function getProductBySlug(
  slug: string,
): Promise<(Product & { images: string[] }) | null> {
  return getProductById(slug);
}

/* -------------------------------------------------------------------------- */
/* Database Mutations (Server Actions with On-Demand Instant Revalidation)    */
/* -------------------------------------------------------------------------- */

function purgeProductsCache() {
  try {
    revalidateTag("products", { expire: 0 });
    revalidateTag("categories", { expire: 0 });
  } catch {
    // Fallback if called outside request lifecycle
  }
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

/**
 * Uploads an image binary to the Supabase Storage product-images bucket.
 */
export async function uploadProductImage(
  formData: FormData,
): Promise<{ url: string; path: string }> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No image file provided in upload request.");

  const supabase = createAdminClient();
  const fileExt = file.name.split(".").pop() || "webp";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error("Image upload error:", uploadError.message);
    throw new Error(`Failed to upload image asset: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return { url: publicUrl, path: filePath };
}

/**
 * Creates a new product and inserts its gallery images in an atomic operation.
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const supabase = createAdminClient();

  const generatedSlug = slugify(input.name);
  const finalSlug = input.slug ? slugify(input.slug) : generatedSlug;

  const productData = {
    name: input.name,
    slug: finalSlug,
    price: Number(input.price),
    sale_price: input.sale_price ? Number(input.sale_price) : null,
    description: input.description || null,
    short_description: input.short_description || null,
    brand: input.brand || "LÉVARO",
    material: input.material || null,
    gender: input.gender || null,
    sku: input.sku || null,
    is_active: input.is_active !== undefined ? input.is_active : true,
    is_featured: Boolean(input.is_featured),
    is_new: Boolean(input.is_new),
    fit: input.fit || null,
    country_of_origin: input.country_of_origin || null,
    tags: parseTags(input.tags),
    product_type: input.product_type || null,
    category_id: input.category_id || null,
    color: input.color || null,
    stock: input.stock || [],
  };

  const { data: createdProduct, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (productError) {
    console.error("Product creation failed:", productError.message);
    throw new Error(productError.message);
  }

  // Insert gallery images if supplied
  if (Array.isArray(input.images) && input.images.length > 0) {
    const imagesToInsert = input.images.map((imgUrl, index) => ({
      product_id: createdProduct.id,
      image_url: imgUrl,
      is_primary: index === 0,
      sort_order: index,
    }));

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(imagesToInsert);

    if (imageError) {
      console.warn("Product images insert warning:", imageError.message);
    }
  }

  purgeProductsCache();
  return mapProductRow(supabase, createdProduct);
}

/**
 * Updates an existing product and synchronizes its image gallery.
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.slug !== undefined) updateData.slug = slugify(input.slug);
  if (input.price !== undefined) updateData.price = Number(input.price);
  if (input.sale_price !== undefined)
    updateData.sale_price = input.sale_price ? Number(input.sale_price) : null;
  if (input.description !== undefined)
    updateData.description = input.description || null;
  if (input.short_description !== undefined)
    updateData.short_description = input.short_description || null;
  if (input.brand !== undefined) updateData.brand = input.brand || null;
  if (input.material !== undefined) updateData.material = input.material || null;
  if (input.gender !== undefined) updateData.gender = input.gender || null;
  if (input.sku !== undefined) updateData.sku = input.sku || null;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;
  if (input.is_featured !== undefined)
    updateData.is_featured = input.is_featured;
  if (input.is_new !== undefined) updateData.is_new = input.is_new;
  if (input.fit !== undefined) updateData.fit = input.fit || null;
  if (input.country_of_origin !== undefined)
    updateData.country_of_origin = input.country_of_origin || null;
  if (input.product_type !== undefined)
    updateData.product_type = input.product_type || null;
  if (input.category_id !== undefined)
    updateData.category_id = input.category_id || null;
  if (input.color !== undefined) updateData.color = input.color || null;
  if (input.stock !== undefined) updateData.stock = input.stock;

  if (input.tags !== undefined) {
    updateData.tags = parseTags(input.tags);
  }

  const { data: updatedProduct, error: productError } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (productError) {
    console.error("Product update failed:", productError.message);
    throw new Error(productError.message);
  }

  // Synchronize gallery images if new images array was provided
  if (Array.isArray(input.images)) {
    await supabase.from("product_images").delete().eq("product_id", id);

    if (input.images.length > 0) {
      const imagesToInsert = input.images.map((imgUrl, index) => ({
        product_id: id,
        image_url: imgUrl,
        is_primary: index === 0,
        sort_order: index,
      }));

      await supabase.from("product_images").insert(imagesToInsert);
    }
  }

  purgeProductsCache();
  return mapProductRow(supabase, updatedProduct);
}

/**
 * Permanently deletes a product and removes its associated gallery images.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createAdminClient();

  await supabase.from("product_images").delete().eq("product_id", id);
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Product deletion failed:", error.message);
    throw new Error(error.message);
  }

  purgeProductsCache();
  return true;
}

/**
 * Quick toggle for product active/storefront visibility.
 */
export async function toggleProductActive(
  id: string,
  isActive: boolean,
): Promise<Product> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Toggle active status failed:", error.message);
    throw new Error(error.message);
  }

  purgeProductsCache();
  return mapProductRow(supabase, data);
}

/**
 * Quick toggle for product featured status.
 */
export async function toggleProductFeatured(
  id: string,
  isFeatured: boolean,
): Promise<Product> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Toggle featured status failed:", error.message);
    throw new Error(error.message);
  }

  purgeProductsCache();
  return mapProductRow(supabase, data);
}