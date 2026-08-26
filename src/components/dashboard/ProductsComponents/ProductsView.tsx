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
        "inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium",
        active ? "text-black/65" : "text-black/35",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-primary" : "bg-black/20",
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
 * Toggle button group allowing the user to switch between Table and Grid catalog layouts.
 */
function ViewSwitcher({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-black/10 bg-white p-1">
      <Button
        type="button"
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("table")}
        className={cn(
          "h-7 rounded-md px-2 text-[11px]",
          viewMode === "table"
            ? "bg-primary text-white hover:bg-primary/90"
            : "text-black/45 hover:text-black",
        )}
      >
        <Table2 className="h-3 w-3" />
        <span className="hidden sm:inline">Table</span>
      </Button>

      <Button
        type="button"
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("grid")}
        className={cn(
          "h-7 rounded-md px-2 text-[11px]",
          viewMode === "grid"
            ? "bg-primary text-white hover:bg-primary/90"
            : "text-black/45 hover:text-black",
        )}
      >
        <Grid2X2 className="h-3 w-3" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
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
    <div className="rounded-xl border border-black/10 bg-white py-14 text-center text-sm text-black/40">
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
      <div className="flex flex-col gap-2 sm:hidden">
        {products.map((product, index) => (
          <Button
            key={product.id}
            type="button"
            variant="ghost"
            onClick={() => onSelectProduct(product)}
            className="h-auto w-full justify-start gap-2 rounded-xl border border-black/10 bg-white p-3 text-left"
          >
            <span className="w-4 shrink-0   text-[11px] text-black/30">
              {(currentPage - 1) * PRODUCTS_PER_PAGE + index + 1}
            </span>

            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-black/10">
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

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-base font-semibold text-black">
                  {product.name}
                </p>
                <PriceTag product={product} />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-black/45">
                  {product.category_name ?? "Uncategorized"}
                </p>
              </div>

              <StatusDot active={product.is_active} />
            </div>
          </Button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-xl border border-black/10 bg-white sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-2 text-center text-[11px]">
                #
              </TableHead>
              <TableHead className="px-4 text-[11px]">Product</TableHead>
              <TableHead className="px-4 text-[11px]">Category</TableHead>
              <TableHead className="px-4 text-[11px]">Price</TableHead>
              <TableHead className="px-4 text-[11px]">Stock</TableHead>
              <TableHead className="px-4 text-[11px]">Status</TableHead>
              <TableHead className="px-4 text-[11px]">Featured</TableHead>
              <TableHead className="px-4 text-right text-[11px]">
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
                <TableRow key={product.id} className="border-black/10">
                  <TableCell className="px-2 py-2 text-center">
                    <span className="  text-[11px] text-black/30">
                      {rowIndex}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-black/10">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-black">
                          {product.name}
                        </p>
                        <p className="mt-0.5   text-[11px] text-black/40">
                          {product.sku ?? "No SKU"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-2.5 text-[11px] text-black/55">
                    {product.category_name ?? "Uncategorized"}
                  </TableCell>

                  <TableCell className="px-4 py-2.5 text-[11px]">
                    <PriceTag product={product} />
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
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

                  <TableCell className="px-4 py-2.5">
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
                    <Badge
                      variant={product.is_featured ? "featured" : "notFeatured"}
                    >
                      {product.is_featured ? "Featured" : "Not Featured"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-2.5 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectProduct(product)}
                      className="h-7 rounded-md border-black/10 px-2.5 text-[11px] font-medium text-primary hover:border-primary/30 hover:bg-primary/5"
                    >
                      <Eye className="h-3 w-3" />
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => {
        const stockInfo = getStockInfo(product);

        return (
          <Card
            key={product.id}
            className="group cursor-pointer gap-0 rounded-xl border-black/10 bg-white p-2 shadow-none transition hover:border-primary/30"
            onClick={() => onSelectProduct(product)}
          >
            <div className="relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-black/10">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className="absolute left-2 top-2">
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

            <div className="mt-2.5 space-y-1.5">
              <h3 className="truncate text-base font-semibold text-black">
                {product.name}
              </h3>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-black/40">
                  {product.category_name ?? "Uncategorized"}
                </p>
                <PriceTag product={product} />
              </div>

              <div className="flex items-center gap-1">
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
              className="mt-2 h-8 w-full rounded-lg border-black/10 text-[11px] font-semibold text-primary hover:border-primary/40 hover:bg-primary/5"
            >
              <Eye className="h-3.5 w-3.5" />
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
function ProductDetailsSheet({
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
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.07] p-2 pr-12">
          <div>
            <SheetTitle className="text-base font-semibold text-black">
              Product details
            </SheetTitle>
            <p className="mt-0.5   text-[11px] text-black/30">
              {product.sku ?? product.id}
            </p>
          </div>

          <Badge variant={product.is_active ? "active" : "inactive"}>
            {product.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Sheet Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Overview Summary */}
            <div className="flex gap-2">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-black/25">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-black/35">
                  {product.category_name ?? "Uncategorized"}
                </p>
                <h2 className="mt-1 text-base font-semibold leading-5 text-black">
                  {product.name}
                </h2>
                <div className="mt-2">
                  <PriceTag product={product} />
                </div>

                {product.short_description && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-black/45">
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
              className="mt-4 flex h-8 w-full items-center justify-center gap-2 rounded-md border border-primary/20 text-[11px] font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <ExternalLink className="h-3 w-3" />
              View live product
            </Link>

            {/* Inventory Breakdown by Size */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="text-base font-semibold text-black">Inventory</p>
                <span className="text-[11px] text-black/35">
                  {totalStock} total
                </span>
              </div>

              {stockBySize.length > 0 ? (
                <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                  {stockBySize.map(([size, quantity]) => (
                    <div
                      key={size}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2"
                    >
                      <span className="min-w-10 text-[11px] font-semibold text-black/70">
                        {size}
                      </span>

                      <div className="h-1.5 flex-1 overflow-hidden rounded-full">
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
                          "min-w-20 text-right text-[11px] font-semibold",
                          quantity > 0 ? "text-primary" : "text-rose-500",
                        )}
                      >
                        {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-black/35">
                  No inventory configured.
                </p>
              )}
            </div>

            {/* Attribute Details List */}
            {details.length > 0 && (
              <div className="mt-6">
                <p className="text-base font-semibold text-black">Details</p>

                <div className="mt-3 divide-y">
                  {details.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <span className="text-[11px] text-black/35">{label}</span>
                      <span className="truncate text-right text-[11px] font-medium text-black">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {(product.tags ?? []).length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] text-black/35">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-primary/5 px-2 py-1 text-[11px] text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div className="mt-6">
                <p className="text-[11px] text-black/35">Description</p>
                <p className="mt-2 whitespace-pre-line text-[11px] leading-5 text-black/50">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sheet Footer Action Controls */}
        <div className="shrink-0 border-t bg-white p-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onToggleActive(product.id)}
              className="h-8 rounded-md border-primary/20 text-[11px] text-primary hover:bg-primary/5"
            >
              <ShieldCheck className="h-3 w-3" />
              {product.is_active ? "Deactivate" : "Activate"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onToggleFeatured(product.id)}
              className="h-8 rounded-md border-primary/20 text-[11px] text-primary hover:bg-primary/5"
            >
              <Star
                className={cn("h-3 w-3", product.is_featured && "fill-current")}
              />
              {product.is_featured ? "Unfeature" : "Feature"}
            </Button>
          </div>

          <Button
            asChild
            className="mt-2 h-8 w-full rounded-md bg-primary text-[11px] font-medium text-white hover:bg-primary/90"
          >
            <Link href={`/admin/products/edit/${product.slug || product.id}`}>
              <Pencil className="h-3 w-3" />
              Edit product
            </Link>
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={() => onDeleteProduct(product.id)}
            className="mt-1 h-8 w-full text-white text-[11px] font-medium bg-rose-800 hover:bg-rose-700"
          >
            <Trash2 className="h-3 w-3" />
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
      <section className="rounded-xl border bg-[#f7f8f9] p-2.5 sm:p-3">
        {/* 1. Header Toolbar */}
        <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
          <p className="text-[11px] text-black/45">
            Showing{" "}
            <span className="font-semibold text-black/75">
              {paginatedProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-black/75">
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
        <div className="flex-col flex items-center justify-between border-t border-black/10 pt-2.5">
          <Pagination className="mx-0 w-auto">
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
                    "flex h-8 items-center rounded-xl border border-black/10 bg-white px-3 text-[10px] text-black/60 transition-colors hover:bg-black/5 hover:text-black",
                    safeCurrentPage === 1 && "pointer-events-none opacity-30",
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
                      "flex items-center justify-center rounded-xl border text-[10px] transition-colors",
                      safeCurrentPage === page
                        ? "border-black/20  text-black font-semibold"
                        : "border-transparent bg-transparent text-black/60 hover:bg-black/5 hover:text-black",
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
                    "flex h-8 items-center rounded-xl border border-black/10 bg-white px-3 text-[10px] text-black/60 transition-colors hover:bg-black/5 hover:text-black",
                    safeCurrentPage === totalPages &&
                      "pointer-events-none opacity-30",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-[11px] text-black/45">
            Page{" "}
            <span className="font-semibold text-black/70">
              {safeCurrentPage}
            </span>{" "}
            of <span className="font-semibold text-black/70">{totalPages}</span>
          </p>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently delete "${deleteTarget.name}" and its product images.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              className="bg-rose-700 hover:bg-rose-800"
            >
              {isLoading ? "Deleting..." : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
