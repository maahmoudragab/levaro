"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/services/admin/products";
import {
  compareSizes,
  formatRelativeDate,
  getTotalStock,
} from "@/components/dashboard/ProductsComponents/product-utils";
import { PriceTag } from "@/components/dashboard/ProductsComponents/PriceTag";

/* -------------------------------------------------------------------------- */
/* Sub-Component: Stock By Size Breakdown Widget                              */
/* -------------------------------------------------------------------------- */

/**
 * Visualizes total inventory stock aggregated across all available sizes.
 */
export function StockBySize({ products }: { products: Product[] }) {
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
          <p className="text-[11px] text-zinc-500">
            All sizes aggregated across inventory
          </p>
        </div>
        <div className="text-right">
          <span className=" text-xs  text-zinc-500">
            {total} units
          </span>
          <span className="block text-[10px] text-zinc-500">
            {sizes.length} sizes
          </span>
        </div>
      </div>

      {/* Size Progress Bars List */}
      <div className="flex-1 overflow-y-auto p-4 max-h-55">
        {sizes.length > 0 ? (
          <div className="space-y-3">
            {sizes.map(([size, quantity]) => {
              const percentage =
                total > 0 ? Math.round((quantity / total) * 100) : 0;

              return (
                <div key={size} className="flex items-center gap-2">
                  <span
                    className="w-20 shrink-0 truncate   text-xs font-semibold text-zinc-800"
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

                  <span className="w-24 shrink-0 text-right   text-[11px] font-medium text-zinc-600">
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

/* -------------------------------------------------------------------------- */
/* Sub-Component: Low Stock & Out of Stock Alerts                             */
/* -------------------------------------------------------------------------- */

/**
 * Lists products that have reached critically low stock (<= 10) or zero units.
 */
export function StockAlerts({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
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
          <p className="text-[11px] text-zinc-400">
            Products that require immediate restock
          </p>
        </div>
        <span className=" px-2.5 py-0.5 text-[11px] text-zinc-5 00">
          {alertProducts.length} alerts
        </span>
      </div>

      {/* Alert Item List */}
      <div className="flex-1 overflow-y-auto p-4 max-h-55">
        {alertProducts.length > 0 ? (
          <div className="space-y-2.5">
            {alertProducts.map(({ product, stock }) => (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-2 transition-colors",
                  stock === 0
                    ? "border-rose-200/70 bg-rose-50/40"
                    : "border-amber-200/70 bg-amber-50/40",
                )}
              >
                <div
                  className={cn(
                    "relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/5",
                    stock === 0 ? "bg-rose-100/60" : "bg-amber-100/60",
                  )}
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Package className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-black/20" />
                  )}
                </div>

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
                  className="h-7 rounded-lg border-black/10 px-2.5 text-[11px] font-medium text-primary hover:bg-white"
                >
                  <Eye className="mr-1 size-3" />
                  Manage
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border py-6 text-center">
            <p className="text-xs font-semibold">
              Inventory looks healthy
            </p>
            <p className="mt-0.5 text-[11px]">
              No low-stock or out-of-stock products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-Component: Recently Added Products Feed                                */
/* -------------------------------------------------------------------------- */

/**
 * Displays latest added pieces with category badges and price information.
 */
export function RecentlyAddedProducts({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xs">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">
            Recently Added Products
          </h3>
          <p className="text-[11px] text-zinc-500">
            The latest pieces added to your catalog
          </p>
        </div>

        <span className="rounded-full px-2.5 py-0.5 text-[11px] t ext-zinc-500">
          {recentProducts.length} latest
        </span>
      </div>

      {/* Feed List */}
      {recentProducts.length > 0 ? (
        <div className="flex-1 divide-y divide-black/5 overflow-y-auto max-h-125">
          {recentProducts.map((product) => {
            const stock = getTotalStock(product);

            return (
              <div
                key={product.id}
                className="flex items-center gap-2 px-4 py-3 transition-colors "
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Package className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-black/20" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-zinc-900">
                    {product.name}
                  </p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {product.sku && (
                      <span className=" text-[11px] text-zinc-400">
                        {product.sku}
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-500">
                      {product.category_name ?? "Uncategorized"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
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
                    className="h-7 rounded-lg border-black/10 px-2.5 text-[11px] font-medium text-primary hover:bg-primary/5"
                  >
                    <Eye className="mr-1 size-3" />
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <Package className="h-7 w-7 text-black/20" />
          <p className="mt-2 text-xs font-semibold text-black/60">
            No products added yet
          </p>
          <p className="mt-0.5 text-[11px] text-black/40">
            New catalog products will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component: Unified Inventory Overview Section                         */
/* -------------------------------------------------------------------------- */

/**
 * Top dashboard inventory widget displaying total KPI metric cards, stock distribution,
 * critical low-stock alerts, and recent catalog updates.
 */
export function InventoryOverview({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  const stats = useMemo(() => {
    const lowStock = products.filter((p) => {
      const s = getTotalStock(p);
      return s > 0 && s <= 10;
    }).length;

    const outOfStock = products.filter((p) => getTotalStock(p) === 0).length;
    const active = products.filter((p) => p.is_active).length;
    const featured = products.filter((p) => p.is_featured).length;

    return {
      total: products.length,
      active,
      featured,
      lowStock,
      outOfStock,
    };
  }, [products]);

  return (
    <section className="space-y-3">
      {/* 1. Top KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-black/10 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-zinc-500">Total Products</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-zinc-500">Active Products</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
            {stats.active}
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-zinc-500">Featured Products</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
            {stats.featured}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-800">Low Stock</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-amber-900">
            {stats.lowStock}
          </p>
          <p className="mt-0.5 text-[10px] text-amber-700/70">1–10 units left</p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-rose-800">Out of Stock</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-rose-900">
            {stats.outOfStock}
          </p>
          <p className="mt-0.5 text-[10px] text-rose-700/70">Needs restock</p>
        </div>
      </div>

      {/* 2. Side-by-Side Widgets Grid */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 items-stretch">
        {/* Column 1: Stock by size + Stock alerts */}
        <div className="flex flex-col gap-2 h-full">
          <StockBySize products={products} />
          <StockAlerts products={products} onSelectProduct={onSelectProduct} />
        </div>

        {/* Column 2: Recently Added Products */}
        <div className="h-full">
          <RecentlyAddedProducts
            products={products}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </section>
  );
}
