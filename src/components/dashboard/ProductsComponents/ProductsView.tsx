"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Eye,
  ExternalLink,
  Grid2X2,
  Pencil,
  ShieldCheck,
  Star,
  Table2,
  Trash2,
} from "lucide-react";
import type { Product } from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  compareSizes,
  getStockInfo,
  PRODUCTS_PER_PAGE,
} from "@/components/dashboard/ProductsComponents/product-utils";
import { PriceTag } from "@/components/dashboard/ProductsComponents/PriceTag";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ViewMode = "table" | "grid";

type ProductViewProps = {
  products?: Product[];
  onToggleActive: (id: string) => Promise<void>;
  onToggleFeatured: (id: string) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  isLoading?: boolean;
  selectedProduct?: Product | null;
  onSelectedProductChange?: (product: Product | null) => void;
};

/* -------------------------------------------------------------------------- */
/* Sub-Component: Status Indicator Dot                                        */
/* -------------------------------------------------------------------------- */

/**
 * Visual green/gray active status indicator with label.
 */
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

/* -------------------------------------------------------------------------- */
/* Sub-Component: Table / Grid View Switcher                                  */
/* -------------------------------------------------------------------------- */

/**
 * Apple HIG Segmented Control for switching between Table and Grid catalog layouts.
 * Styled with Lévaro luxury brand aesthetics.
 */
function ViewSwitcher({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-zinc-100/90 p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-label="Table view"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-200 active:scale-[0.97]",
          viewMode === "table"
            ? "bg-primary text-white font-semibold shadow-xs"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50",
        )}
      >
        <Table2
          className={cn(
            "size-3.5 transition-colors",
            viewMode === "table" ? "text-white" : "text-zinc-400",
          )}
        />
        <span className="hidden sm:inline">Table</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-200 active:scale-[0.97]",
          viewMode === "grid"
            ? "bg-primary text-white font-semibold shadow-xs"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50",
        )}
      >
        <Grid2X2
          className={cn(
            "size-3.5 transition-colors",
            viewMode === "grid" ? "text-white" : "text-zinc-400",
          )}
        />
        <span className="hidden sm:inline">Grid</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-Component: Empty Results State                                         */
/* -------------------------------------------------------------------------- */

/**
 * Displayed when no catalog products match the active filters or search terms.
 */
function EmptyProducts() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center text-xs sm:text-sm font-medium text-zinc-500">
      No products match your search or filters.
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-Component: Product Table Layout                                        */
/* -------------------------------------------------------------------------- */

/**
 * High-density tabular layout for products with responsive mobile card fallback.
 */
function ProductTable({
  products,
  currentPage,
  onSelectProduct,
}: {
  products: Product[];
  currentPage: number;
  onSelectProduct: (product: Product) => void;
}) {
  if (products.length === 0) {
    return <EmptyProducts />;
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

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-zinc-100">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

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
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-zinc-100">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>

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

                  <TableCell className="px-4 py-3 text-xs font-medium text-zinc-600">
                    {product.category_name ?? "Uncategorized"}
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

/* -------------------------------------------------------------------------- */
/* Sub-Component: Product Grid Layout                                         */
/* -------------------------------------------------------------------------- */

/**
 * Visual grid card layout emphasizing product photography.
 */
function ProductGrid({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  if (products.length === 0) {
    return <EmptyProducts />;
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
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-black/5 bg-zinc-100">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                )}
              </div>

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

/* -------------------------------------------------------------------------- */
/* Sub-Component: Product Quick Manage Sheet                                  */
/* -------------------------------------------------------------------------- */

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
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleActive: (id: string) => Promise<void>;
  onToggleFeatured: (id: string) => Promise<void>;
  onDeleteProduct: (id: string) => void;
  isLoading: boolean;
}) {
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
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-black/5">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No image
                  </div>
                )}
              </div>

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
              href={`/products/${product.slug}`}
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

/* -------------------------------------------------------------------------- */
/* Main Component: Products View Container                                    */
/* -------------------------------------------------------------------------- */

/**
 * Main products catalog presentation layer with Table/Grid switcher,
 * client-side pagination, details drawer, and delete dialog.
 */
export default function ProductView({
  products,
  onToggleActive,
  onToggleFeatured,
  onDeleteProduct,
  isLoading = false,
  selectedProduct: controlledSelectedProduct,
  onSelectedProductChange,
}: ProductViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedProduct, setInternalSelectedProduct] =
    useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const selectedProduct =
    controlledSelectedProduct !== undefined
      ? controlledSelectedProduct
      : internalSelectedProduct;

  const setSelectedProduct = (product: Product | null) => {
    if (onSelectedProductChange) {
      onSelectedProductChange(product);
    } else {
      setInternalSelectedProduct(product);
    }
  };

  const safeProducts = useMemo(() => products ?? [], [products]);

  const totalPages = Math.max(
    1,
    Math.ceil(safeProducts.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return safeProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [safeCurrentPage, safeProducts]);

  const deleteTarget = safeProducts.find(
    (product) => product.id === deleteProductId,
  );

  const requestDelete = (id: string) => {
    setDeleteProductId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;

    await onDeleteProduct(deleteProductId);
    setDeleteProductId(null);
    setSelectedProduct(null);
  };

  const getVisiblePages = (current: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2)
      return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
  };

  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  return (
    <>
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* 1. Header Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {paginatedProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {safeProducts.length}
            </span>{" "}
            products
          </p>

          <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* 2. Products List (Table or Grid) */}
        {viewMode === "table" ? (
          <ProductTable
            products={paginatedProducts}
            currentPage={safeCurrentPage}
            onSelectProduct={setSelectedProduct}
          />
        ) : (
          <ProductGrid
            products={paginatedProducts}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* 3. Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 pt-4">
          <p className="text-xs text-zinc-500 order-2 sm:order-1">
            Page{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {safeCurrentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {totalPages}
            </span>
          </p>

          <Pagination className="mx-0 w-auto order-1 sm:order-2">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={safeCurrentPage === 1}
                  onClick={(event) => {
                    event.preventDefault();
                    if (safeCurrentPage > 1) {
                      setCurrentPage((page) => page - 1);
                    }
                  }}
                  className={cn(
                    "flex h-8.5 items-center rounded-xl border border-zinc-200/90 bg-white px-3 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900",
                    safeCurrentPage === 1 && "pointer-events-none opacity-40",
                  )}
                />
              </PaginationItem>

              {visiblePages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={safeCurrentPage === page}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage(page);
                    }}
                    size="icon"
                    className={cn(
                      "flex h-8.5 w-8.5 items-center justify-center rounded-xl border text-xs font-medium tabular-nums transition-colors shadow-2xs",
                      safeCurrentPage === page
                        ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                        : "border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={safeCurrentPage === totalPages}
                  onClick={(event) => {
                    event.preventDefault();
                    if (safeCurrentPage < totalPages) {
                      setCurrentPage((page) => page + 1);
                    }
                  }}
                  className={cn(
                    "flex h-8.5 items-center rounded-xl border border-zinc-200/90 bg-white px-3 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900",
                    safeCurrentPage === totalPages &&
                      "pointer-events-none opacity-40",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* 4. Product Details Drawer */}
      <ProductDetailsSheet
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
          }
        }}
        onToggleActive={onToggleActive}
        onToggleFeatured={onToggleFeatured}
        onDeleteProduct={requestDelete}
        isLoading={isLoading}
      />

      {/* 5. Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteProductId)}
        onOpenChange={(open) => {
          if (!open && !isLoading) {
            setDeleteProductId(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-zinc-200 p-5 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-zinc-900">
              Delete product?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-zinc-500">
              {deleteTarget
                ? `This will permanently delete "${deleteTarget.name}" and its product images from the catalog.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={isLoading}
              className="h-9 rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              className="h-9 rounded-xl bg-rose-600 text-xs font-medium text-white shadow-xs hover:bg-rose-700"
            >
              {isLoading ? "Deleting..." : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
