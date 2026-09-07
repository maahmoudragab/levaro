import { useMemo } from "react";
import { Eye, Package } from "lucide-react";
import type { Product } from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/shared/PriceTag";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import {
  formatRelativeDate,
  getTotalStock,
} from "@/components/dashboard/products/product-utils";

interface RecentlyAddedProductsWidgetProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

/**
 * Displays latest added pieces with category badges and price information.
 */
export function RecentlyAddedProductsWidget({
  products,
  onSelectProduct,
}: RecentlyAddedProductsWidgetProps) {
  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 8),
    [products],
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xs">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">
            Recently Added Products
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            The latest pieces added to your catalog
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-zinc-900 tabular-nums">
            {recentProducts.length} latest
          </span>
          <span className="block text-[11px] text-zinc-500">
            new catalog items
          </span>
        </div>
      </div>

      {/* Feed List */}
      {recentProducts.length > 0 ? (
        <div className="divide-y divide-black/5 overflow-y-auto max-h-125 px-2">
          {recentProducts.map((product) => {
            const stock = getTotalStock(product);

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-zinc-50/60 rounded-xl my-0.5"
              >
                <ProductThumbnail
                  src={product.image}
                  alt={product.name}
                  className="h-11 w-11"
                  sizes="44px"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-zinc-900">
                    {product.name}
                  </p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    {product.sku && (
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {product.sku}
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-500">
                      {product.category_name ?? "Uncategorized"}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      • {formatRelativeDate(product.created_at)}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>

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

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <PriceTag product={product} size="sm" />

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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <Package className="h-7 w-7 text-zinc-300" />
          <p className="mt-2 text-xs font-semibold text-zinc-600">
            No products added yet
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            New catalog products will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}

export default RecentlyAddedProductsWidget;
