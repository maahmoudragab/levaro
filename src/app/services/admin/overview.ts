import { createClient } from "@/lib/supabase/server";

export async function getOverviewStats() {
  const supabase = await createClient();

  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const formatChange = (change: number, period: string) => {
    const sign = change > 0 ? "+" : "";

    return `${sign}${change}% ${period}`;
  };

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: featuredCount },

    { count: productsThisMonth },
    { count: productsLastMonth },

    { count: categoriesThisMonth },
    { count: categoriesLastMonth },

    { count: featuredThisMonth },
    { count: featuredLastMonth },

    { count: newProducts },
    { count: previousNewProducts },
  ] = await Promise.all([
    // Total products
    supabase.from("products").select("*", { count: "exact", head: true }),

    // Total categories
    supabase.from("categories").select("*", { count: "exact", head: true }),

    // Total featured products
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),

    // Products created this month
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .gte("created_at", currentMonthStart.toISOString()),

    // Products created last month
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString()),

    // Categories created this month
    supabase
      .from("categories")
      .select("*", { count: "exact", head: true })
      .gte("created_at", currentMonthStart.toISOString()),

    // Categories created last month
    supabase
      .from("categories")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString()),

    // Featured products created this month
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true)
      .gte("created_at", currentMonthStart.toISOString()),

    // Featured products created last month
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true)
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString()),

    // New products from the last 7 days
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last7Days.toISOString()),

    // New products from the previous 7 days
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previous7Days.toISOString())
      .lt("created_at", last7Days.toISOString()),
  ]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    productsCount: productsCount ?? 0,
    categoriesCount: categoriesCount ?? 0,
    featuredCount: featuredCount ?? 0,
    newProductsCount: newProducts ?? 0,

    productsChange: formatChange(
      calculateChange(productsThisMonth ?? 0, productsLastMonth ?? 0),
      "this month",
    ),

    categoriesChange: formatChange(
      calculateChange(categoriesThisMonth ?? 0, categoriesLastMonth ?? 0),
      "this month",
    ),

    featuredChange: formatChange(
      calculateChange(featuredThisMonth ?? 0, featuredLastMonth ?? 0),
      "this month",
    ),

    newProductsChange: formatChange(
      calculateChange(newProducts ?? 0, previousNewProducts ?? 0),
      "this week",
    ),
  };
}
