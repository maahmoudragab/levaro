import TopHeader from "@/components/dashboard/TopHeader";
import { getProducts } from "@/app/services/admin/products";
import { Tags, Package, Layers } from "lucide-react";

export const metadata = {
  title: "Categories | LÉVARO Admin",
};

/**
 * Admin Categories Management Page (Server Component).
 * Displays category overview and collections following the Apple design system.
 */
export default async function CategoriesPage() {
  const products = await getProducts();

  // Aggregate category metrics
  const categoryStats = new Map<
    string,
    { count: number; active: number; totalStock: number }
  >();

  products.forEach((product) => {
    const cat = product.category_name || "Uncategorized";
    const current = categoryStats.get(cat) ?? { count: 0, active: 0, totalStock: 0 };
    const stock = (product.stock ?? []).reduce(
      (sum, item) => sum + Number(item.stock ?? 0),
      0,
    );

    categoryStats.set(cat, {
      count: current.count + 1,
      active: current.active + (product.is_active ? 1 : 0),
      totalStock: current.totalStock + stock,
    });
  });

  const categories = Array.from(categoryStats.entries()).sort(
    (a, b) => b[1].count - a[1].count,
  );

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 font-sans">
      {/* Top Header */}
      <TopHeader
        title="Categories"
        description="Organize your luxury collections, categories, and catalog hierarchy."
        buttonName="Add Category"
        buttonHref="#"
      />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map(([category, stats]) => (
          <div
            key={category}
            className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-4 shadow-2xs transition-all hover:border-primary/30 hover:shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Tags className="size-4" />
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                {stats.active} Active
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-zinc-900">{category}</h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                {stats.count} {stats.count === 1 ? "Product" : "Products"} in collection
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <Package className="size-3.5 text-zinc-400" />
                <span className="font-medium tabular-nums">{stats.totalStock} units</span>
              </div>
              <span className="text-[11px] font-medium text-primary">
                View Collection →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
