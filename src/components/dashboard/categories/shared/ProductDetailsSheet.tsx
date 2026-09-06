"use client";

import Link from "next/link";
import { ExternalLink, Pencil, ShieldCheck, Star, Trash2 } from "lucide-react";
import type { Product } from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/dashboard/categories/shared/PriceTag";
import { ProductThumbnail } from "@/components/dashboard/categories/shared/ProductThumbnail";

interface ProductDetailsSheetProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleActive: (id: string) => Promise<void>;
  onToggleFeatured: (id: string) => Promise<void>;
  onDeleteProduct: (id: string) => void;
  isLoading: boolean;
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

function compareSizes(a: string, b: string): number {
  const normA = a.toUpperCase().trim();
  const normB = b.toUpperCase().trim();
  const indexA = SIZE_ORDER.indexOf(normA);
  const indexB = SIZE_ORDER.indexOf(normB);

  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  const numA = parseFloat(normA);
  const numB = parseFloat(normB);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

  return normA.localeCompare(normB);
}

/**
 * Slide-out drawer displaying comprehensive product details, stock breakdown by size,
 * quick activation toggle, edit link, and delete action.
 */
export function ProductDetailsSheet({
  product,
  open,
  onOpenChange,
  onToggleActive,
  onToggleFeatured,
  onDeleteProduct,
  isLoading,
}: ProductDetailsSheetProps) {
  if (!product) return null;

  const stock = product.stock ?? [];
  const stockBySizeMap = new Map<string, number>();

  stock.forEach((item) => {
    const size = String(item.size ?? "").trim();
    if (!size) return;

    stockBySizeMap.set(
      size,
      (stockBySizeMap.get(size) ?? 0) + Number(item.stock || 0),
    );
  });

  const stockBySize = Array.from(stockBySizeMap.entries()).sort(([a], [b]) =>
    compareSizes(a, b),
  );

  const totalStock = stockBySize.reduce(
    (total, [, quantity]) => total + quantity,
    0,
  );

  const details = [
    ["Category", product.category_name],
    ["Brand", product.brand],
    ["Gender", product.gender],
    ["Color", product.color],
    ["Fit", product.fit],
    ["Material", product.material],
    ["Type", product.product_type],
    ["Origin", product.country_of_origin],
    ["SKU", product.sku],
    ["Regular price", `$${product.price}`],
    [
      "Sale price",
      product.sale_price != null ? `$${product.sale_price}` : null,
    ],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-none flex-col gap-0 overflow-hidden bg-white p-0 sm:max-w-md"
      >
        {/* Sheet Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 p-4 pr-12">
          <div>
            <SheetTitle className="text-base font-semibold text-zinc-900">
              Product Details
            </SheetTitle>
            <p className="mt-0.5 text-xs text-zinc-400 font-mono">
              {product.sku ?? product.id}
            </p>
          </div>

          <Badge variant={product.is_active ? "active" : "inactive"}>
            {product.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Sheet Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-5 space-y-6">
            {/* Overview Summary */}
            <div className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3">
              <ProductThumbnail
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-xl"
                sizes="80px"
              />

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs text-zinc-500">
                  {product.category_name ?? "Uncategorized"}
                </p>
                <h2 className="text-sm font-semibold leading-tight text-zinc-900">
                  {product.name}
                </h2>
                <div className="mt-1">
                  <PriceTag product={product} />
                </div>

                {product.short_description && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {product.short_description}
                  </p>
                )}
              </div>
            </div>

            {/* Live Storefront Link */}
            <Link
              href={`/shop/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-primary shadow-2xs transition-colors hover:bg-primary/5 hover:border-primary/30"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View live product
            </Link>

            {/* Inventory Breakdown by Size */}
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-xs sm:text-sm font-semibold text-zinc-900">Inventory by Size</p>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {totalStock} total units
                </span>
              </div>

              {stockBySize.length > 0 ? (
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                  {stockBySize.map(([size, quantity]) => (
                    <div
                      key={size}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white px-3 py-2.5 shadow-2xs"
                    >
                      <span className="min-w-10 text-xs font-semibold text-zinc-800">
                        {size}
                      </span>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            quantity > 0 ? "bg-primary" : "bg-rose-400",
                          )}
                          style={{
                            width:
                              totalStock > 0
                                ? `${Math.min(
                                    100,
                                    Math.max(0, (quantity / totalStock) * 100),
                                  )}%`
                                : "0%",
                          }}
                        />
                      </div>

                      <span
                        className={cn(
                          "min-w-20 text-right text-xs font-medium tabular-nums",
                          quantity > 0 ? "text-primary font-semibold" : "text-rose-600",
                        )}
                      >
                        {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-zinc-400">
                  No inventory configured.
                </p>
              )}
            </div>

            {/* Attribute Details List */}
            {details.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-900">Product Attributes</p>

                <div className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-zinc-50/40 px-3.5">
                  {details.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-xs text-zinc-500">{label}</span>
                      <span className="truncate text-right text-xs font-medium text-zinc-800">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {(product.tags ?? []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-900">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div>
                <p className="text-xs font-semibold text-zinc-900">Description</p>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-zinc-600">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sheet Footer Action Controls */}
        <div className="shrink-0 space-y-2 border-t border-zinc-100 bg-white p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onToggleActive(product.id)}
              className="h-9 rounded-xl border-zinc-200 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {product.is_active ? "Deactivate" : "Activate"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onToggleFeatured(product.id)}
              className="h-9 rounded-xl border-zinc-200 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
            >
              <Star
                className={cn(
                  "mr-1.5 h-3.5 w-3.5",
                  product.is_featured
                    ? "fill-primary text-primary"
                    : "text-zinc-400",
                )}
              />
              {product.is_featured ? "Unfeature" : "Feature"}
            </Button>
          </div>

          <Button
            asChild
            className="h-10 w-full rounded-xl bg-primary text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Link href={`/admin/products/edit/${product.slug || product.id}`}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit product
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={() => onDeleteProduct(product.id)}
            className="h-9 w-full rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete product
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ProductDetailsSheet;
