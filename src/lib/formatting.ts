/**
 * Shared string formatting, slugification, and parser utilities.
 */

/**
 * Normalizes user-input strings into URL-safe slug format with Arabic unicode support.
 */
export function slugify(text: string): string {
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
}

/**
 * Safely parses string array or comma-separated string tags into a clean string array.
 */
export function parseTags(rawTags: unknown): string[] | null {
  if (Array.isArray(rawTags)) {
    const cleaned = rawTags.map((t) => String(t).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : null;
  }
  if (typeof rawTags === "string" && rawTags.trim().length > 0) {
    const cleaned = rawTags.split(",").map((t) => t.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : null;
  }
  return null;
}

/**
 * Formats a numeric price into the standard Egyptian Pound luxury currency format.
 */
export function formatEgpPrice(amount: number): string {
  return `EGP ${amount.toLocaleString("en-US")}`;
}
