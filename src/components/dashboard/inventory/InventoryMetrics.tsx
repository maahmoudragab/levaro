import type { Product } from "@/app/services/admin/products";
import { getTotalStock } from "@/components/dashboard/products/product-utils";

interface InventoryMetricsProps {
  products: Product[];
}

/**
 * Top KPI Summary Cards for Inventory Dashboard.
 * Default Server/Presentation component.
 */
export function InventoryMetrics({ products }: InventoryMetricsProps) {
  const lowStock = products.filter((p) => {
    const s = getTotalStock(p);
    return s > 0 && s <= 10;
  }).length;

  const outOfStock = products.filter((p) => getTotalStock(p) === 0).length;
  const active = products.filter((p) => p.is_active).length;
  const featured = products.filter((p) => p.is_featured).length;

  const stats = {
    total: products.length,
    active,
    featured,
    lowStock,
    outOfStock,
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Total Products
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
          {stats.total}
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Active Products
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
          {stats.active}
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Featured Products
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
          {stats.featured}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-2xs">
        <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
          Low Stock
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-amber-900 tabular-nums">
          {stats.lowStock}
        </p>
        <p className="mt-0.5 text-xs text-amber-700/80">1–10 units left</p>
      </div>

      <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 shadow-2xs">
        <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
          Out of Stock
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-rose-900 tabular-nums">
          {stats.outOfStock}
        </p>
        <p className="mt-0.5 text-xs text-rose-700/80">Needs restock</p>
      </div>
    </div>
  );
}

export default InventoryMetrics;
