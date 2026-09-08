import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-Demand Cache Revalidation API endpoint.
 * Allows external triggers (e.g. Supabase Webhooks) or manual pings to purge server cache instantly.
 *
 * Usage:
 *   GET /api/revalidate?tag=products
 *   GET /api/revalidate?tag=categories
 *   GET /api/revalidate?path=/admin/products
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: "Invalid revalidation secret token" },
      { status: 401 },
    );
  }

  if (!tag && !path) {
    return NextResponse.json(
      { message: "Missing required 'tag' or 'path' query parameter" },
      { status: 400 },
    );
  }

  if (tag) {
    revalidateTag(tag, { expire: 0 });
  }

  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    tag: tag || null,
    path: path || null,
    now: Date.now(),
  });
}
