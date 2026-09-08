"use client";

import { Eye } from "lucide-react";
import type { Product } from "@/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/shared/PriceTag";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { EmptyState } from "@/components/shared/EmptyState";
import type { CategoryOption } from "@/components/admin/products/product-utils";
import {
  getStockInfo,
  PRODUCTS_PER_PAGE,
} from "@/components/admin/products/product-utils";

interface ProductsTableProps {
  products: Product[];
  categoriesList?: CategoryOption[];
  currentPage: number;
  onSelectProduct: (product: Product) => void;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium",
        active ? "text-emerald-700" : "text-zinc-500",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          active ? "bg-emerald-500" : "bg-zinc-300",
        )}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

/**
 * High-density tabular layout for products with responsive mobile card fallback.
 */
export function ProductsTable({
  products,
  categoriesList = [],
  currentPage,
  onSelectProduct,
}: ProductsTableProps) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Mobile Card List */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {products.map((product, index) => (
          <Button
            key={product.id}
            type="button"
            variant="ghost"
            onClick={() => onSelectProduct(product)}
            className="h-auto w-full justify-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 text-left shadow-2xs transition-all hover:border-zinc-300"
          >
            <span className="w-4 shrink-0 text-xs font-medium text-zinc-400 tabular-nums">
              {(currentPage - 1) * PRODUCTS_PER_PAGE + index + 1}
            </span>

            <ProductThumbnail
              src={product.image}
              alt={product.name}
              className="h-12 w-12"
              sizes="48px"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {product.name}
                </p>
                <PriceTag product={product} size="sm" />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs text-zinc-500">
                  {product.category_name ?? "Uncategorized"}
                </p>
              </div>

              <StatusDot active={product.is_active} />
            </div>
          </Button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-2xs sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-100 hover:bg-transparent">
              <TableHead className="w-12 px-3 text-center text-xs font-semibold text-zinc-500">
                #
              </TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Product</TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Category</TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Price</TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Stock</TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Status</TableHead>
              <TableHead className="px-4 text-xs font-semibold text-zinc-500">Featured</TableHead>
              <TableHead className="px-4 text-right text-xs font-semibold text-zinc-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product, index) => {
              const rowIndex =
                (currentPage - 1) * PRODUCTS_PER_PAGE + index + 1;
              const stockInfo = getStockInfo(product);

              return (
                <TableRow key={product.id} className="border-b border-zinc-100/80 transition-colors hover:bg-zinc-50/60">
                  <TableCell className="px-3 py-3 text-center">
                    <span className="text-xs font-medium text-zinc-400 tabular-nums">
                      {rowIndex}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductThumbnail
                        src={product.image}
                        alt={product.name}
                        className="h-11 w-11"
                        sizes="44px"
                      />

                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate text-xs sm:text-sm font-semibold text-zinc-900">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-zinc-400 tabular-nums">
                          {product.sku ?? "No SKU"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-xs">
                    {(() => {
                      const prodCat = categoriesList.find(
                        (c) => c.id === product.category_id,
                      );
                      const parentCat = prodCat?.parent_id
                        ? categoriesList.find((c) => c.id === prodCat.parent_id)
                        : null;

                      if (parentCat) {
                        return (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-zinc-400">
                              {parentCat.name}
                            </span>
                            <span className="text-zinc-300">/</span>
                            <span className="font-semibold text-zinc-800">
                              {prodCat?.name}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <span className="font-medium text-zinc-700">
                          {prodCat?.name ?? product.category_name ?? "Uncategorized"}
                        </span>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <PriceTag product={product} />
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={
                        stockInfo.label === "Out of stock"
                          ? "outOfStock"
                          : stockInfo.label.includes("Low stock")
                            ? "lowStock"
                            : "inStock"
                      }
                    >
                      {stockInfo.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={product.is_featured ? "featured" : "notFeatured"}
                    >
                      {product.is_featured ? "Featured" : "Not Featured"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectProduct(product)}
                      className="h-8 rounded-lg border-zinc-200 bg-white px-3 text-xs font-medium text-primary hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ProductsTable;
