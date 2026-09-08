import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Extracts a valid string representation from various database image row column formats.
 */
export function getImageValue(
  img: Record<string, unknown> | string | null | undefined,
): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (typeof img !== "object") return null;

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
export function getPublicImageUrl(
  supabase: SupabaseClient,
  value: string | null | undefined,
  bucketName: string = "product-images",
): string | null {
  if (!value) return null;

  // Filter out invalid or local temporary blob references
  if (
    value.startsWith("blob:") ||
    value.includes("blob:http") ||
    value.includes("localhost:")
  ) {
    return null;
  }

  // Already an absolute HTTP(S) or data URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Generate public URL from the specified Supabase Storage bucket
  return supabase.storage
    .from(bucketName)
    .getPublicUrl(value)
    .data.publicUrl;
}
