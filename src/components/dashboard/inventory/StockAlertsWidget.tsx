import { useMemo } from "react";
import { Eye } from "lucide-react";
import type { Product } from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductThumbnail } from "@/components/dashboard/categories/shared/ProductThumbnail";
import { getTotalStock } from "@/components/dashboard/products/product-utils";

interface StockAlertsWidgetProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

/**
 * Lists products that have reached critically low stock (<= 10) or zero units.
 */
export function StockAlertsWidget({
  products,
  onSelectProduct,
}: StockAlertsWidgetProps) {
  const alertProducts = useMemo(() => {
    return products
      .map((product) => ({
        product,
        stock: getTotalStock(product),
      }))
      .filter(({ stock }) => stock <= 10)
      .sort((a, b) => a.stock - b.stock);
  }, [products]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xs">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5">
        <div>
          <h4 className="text-sm font-bold text-zinc-900">Stock alerts</h4>
          <p className="mt-0.5 text-xs text-zinc-500">
            Products requiring immediate restock
          </p>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              alertProducts.length > 0 ? "text-amber-800" : "text-zinc-900",
            )}
          >
            {alertProducts.length} alerts
          </span>
          <span className="block text-[11px] text-zinc-500">
            {alertProducts.length > 0 ? "requires action" : "healthy stock"}
          </span>
        </div>
      </div>

      {/* Alert Item List */}
      <div className="flex-1 overflow-y-auto p-4 max-h-56">
        {alertProducts.length > 0 ? (
          <div className="space-y-2.5">
            {alertProducts.map(({ product, stock }) => (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-2.5 transition-colors",
                  stock === 0
                    ? "border-rose-200/70 bg-rose-50/40"
                    : "border-amber-200/70 bg-amber-50/40",
                )}
              >
                <ProductThumbnail
                  src={product.image}
                  alt={product.name}
                  className="h-11 w-11"
                  sizes="44px"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-xs font-semibold",
                      stock === 0 ? "text-rose-950" : "text-amber-950",
                    )}
                  >
                    {product.name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge
                      variant={
                        stock === 0
                          ? "outOfStock"
                          : stock <= 10
                            ? "lowStock"
                            : "inStock"
                      }
                    >
                      {stock === 0 ? "Out of stock" : `${stock} in stock`}
                    </Badge>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectProduct(product)}
                  className="h-8 rounded-xl border-zinc-200 bg-white px-3 text-xs font-medium text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  Manage
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border py-6 text-center">
            <p className="text-xs font-semibold text-zinc-800">
              Inventory looks healthy
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              No low-stock or out-of-stock products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockAlertsWidget;
