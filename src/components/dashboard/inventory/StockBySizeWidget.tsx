import { useMemo } from "react";
import type { Product } from "@/app/services/admin/products";
import { compareSizes } from "@/components/dashboard/products/product-utils";

interface StockBySizeWidgetProps {
  products: Product[];
}

/**
 * Visualizes total inventory stock aggregated across all available sizes.
 */
export function StockBySizeWidget({ products }: StockBySizeWidgetProps) {
  const { sizes, total } = useMemo(() => {
    const bySize = new Map<string, number>();

    products.forEach((product) => {
      (product.stock ?? []).forEach((item) => {
        const size = String(item.size ?? "").trim();
        if (!size) return;
        bySize.set(size, (bySize.get(size) ?? 0) + Number(item.stock ?? 0));
      });
    });

    const sortedSizes = Array.from(bySize.entries()).sort((a, b) =>
      compareSizes(a[0], b[0]),
    );

    const totalUnits = sortedSizes.reduce(
      (sum, [, quantity]) => sum + quantity,
      0,
    );

    return { sizes: sortedSizes, total: totalUnits };
  }, [products]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xs">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5">
        <div>
          <h4 className="text-sm font-bold text-zinc-900">Stock by size</h4>
          <p className="mt-0.5 text-xs text-zinc-500">
            All sizes aggregated across inventory
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-zinc-900 tabular-nums">
            {total} units
          </span>
          <span className="block text-[11px] text-zinc-500">
            {sizes.length} sizes
          </span>
        </div>
      </div>

      {/* Size Progress Bars List */}
      <div className="flex-1 overflow-y-auto p-4 max-h-56">
        {sizes.length > 0 ? (
          <div className="space-y-3">
            {sizes.map(([size, quantity]) => {
              const percentage =
                total > 0 ? Math.round((quantity / total) * 100) : 0;

              return (
                <div key={size} className="flex items-center gap-3">
                  <span
                    className="w-16 shrink-0 truncate text-xs font-semibold text-zinc-800"
                    title={size}
                  >
                    {size}
                  </span>

                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-24 shrink-0 text-right text-xs font-medium text-zinc-600 tabular-nums">
                    {quantity}{" "}
                    <span className="font-normal text-zinc-400">
                      ({percentage}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center py-6 text-center text-xs text-zinc-400">
            No stock sizes configured yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default StockBySizeWidget;
