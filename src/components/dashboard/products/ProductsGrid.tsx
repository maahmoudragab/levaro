"use client";

import { Eye } from "lucide-react";
import type { Product } from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PriceTag } from "@/components/dashboard/categories/shared/PriceTag";
import { ProductThumbnail } from "@/components/dashboard/categories/shared/ProductThumbnail";
import { EmptyState } from "@/components/dashboard/categories/shared/EmptyState";
import { getStockInfo } from "@/components/dashboard/products/product-utils";

interface ProductsGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

/**
 * Visual grid card layout emphasizing product photography and quick manage actions.
 */
export function ProductsGrid({
  products,
  onSelectProduct,
}: ProductsGridProps) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => {
        const stockInfo = getStockInfo(product);

        return (
          <Card
            key={product.id}
            className="group cursor-pointer gap-0 rounded-2xl border-zinc-200/80 bg-white p-3 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-xs"
            onClick={() => onSelectProduct(product)}
          >
            <div className="relative">
              <ProductThumbnail
                src={product.image}
                alt={product.name}
                className="aspect-square w-full rounded-xl"
                imageClassName="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              <div className="absolute left-2.5 top-2.5">
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
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <h3 className="truncate text-xs sm:text-sm font-semibold text-zinc-900">
                {product.name}
              </h3>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs text-zinc-500">
                  {product.category_name ?? "Uncategorized"}
                </p>
                <PriceTag product={product} size="sm" />
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                <Badge variant={product.is_active ? "active" : "inactive"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  variant={product.is_featured ? "featured" : "notFeatured"}
                >
                  {product.is_featured ? "Featured" : "Not Featured"}
                </Badge>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onSelectProduct(product);
              }}
              className="mt-3 h-8.5 w-full rounded-xl border-zinc-200 bg-white text-xs font-medium text-primary hover:border-primary/40 hover:bg-primary/5"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Manage
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
