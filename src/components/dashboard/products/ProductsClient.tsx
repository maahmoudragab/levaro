"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Filter, RotateCcw } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured,
  type Product,
} from "@/app/services/admin/products";
import { TopHeader } from "@/components/shared/TopHeader";
import { ProductDetailsSheet } from "@/components/shared/ProductDetailsSheet";
import { DeleteProductDialog } from "@/components/shared/DeleteProductDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { ProductSearch } from "@/components/dashboard/products/ProductSearch";
import {
  ProductFilters,
  ProductFiltersButton,
} from "@/components/dashboard/products/ProductFilters";
import {
  ProductViewSwitcher,
  type ViewMode,
} from "@/components/dashboard/products/ProductViewSwitcher";
import { ProductsTable } from "@/components/dashboard/products/ProductsTable";
import { ProductsGrid } from "@/components/dashboard/products/ProductsGrid";
import {
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilterState,
  type CategoryOption,
  filterProducts,
  PRODUCTS_PER_PAGE,
} from "@/components/dashboard/products/product-utils";

interface ProductsClientProps {
  initialProducts: Product[];
  categoriesList?: CategoryOption[];
}

/**
 * Client coordinator for the admin products catalog dashboard.
 * Manages search state, advanced filters, active filter chips, pagination, and actions.
 */
export default function ProductsClient({
  initialProducts,
  categoriesList = [],
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlCollection = searchParams.get("collection");

  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);

  // Synchronize state when server props update
  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProductsList(initialProducts);
  }

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<ProductFilterState>(() => ({
    ...DEFAULT_PRODUCT_FILTERS,
    category: urlCategory || DEFAULT_PRODUCT_FILTERS.category,
    collection: urlCollection || DEFAULT_PRODUCT_FILTERS.collection,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Compute filtered & sorted product list with full Category/Collection hierarchy matching
  const filteredProducts = useMemo(
    () => filterProducts(productsList, search, filters, categoriesList),
    [productsList, search, filters, categoriesList],
  );

  // Active filter chips list for quick removal
  const activeFilterChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (search.trim()) {
      chips.push({
        id: "search",
        label: `Search: "${search}"`,
        onRemove: () => {
          setSearch("");
          setCurrentPage(1);
        },
      });
    }

    if (filters.category !== "All Categories") {
      chips.push({
        id: "category",
        label: `Category: ${filters.category}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, category: "All Categories" }));
          router.replace("/admin/products");
          setCurrentPage(1);
        },
      });
    }

    if (filters.collection !== "All Collections") {
      chips.push({
        id: "collection",
        label: `Collection: ${filters.collection}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, collection: "All Collections" }));
          router.replace("/admin/products");
          setCurrentPage(1);
        },
      });
    }

    if (filters.gender !== "All Genders") {
      chips.push({
        id: "gender",
        label: `Gender: ${filters.gender}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, gender: "All Genders" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.product_type !== "All Types") {
      chips.push({
        id: "product_type",
        label: `Type: ${filters.product_type}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, product_type: "All Types" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.fit !== "All Fits") {
      chips.push({
        id: "fit",
        label: `Fit: ${filters.fit}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, fit: "All Fits" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.color !== "All Colors") {
      chips.push({
        id: "color",
        label: `Color: ${filters.color}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, color: "All Colors" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.material !== "All Materials") {
      chips.push({
        id: "material",
        label: `Fabric: ${filters.material}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, material: "All Materials" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.brand !== "All Brands") {
      chips.push({
        id: "brand",
        label: `Brand: ${filters.brand}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, brand: "All Brands" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.stockStatus !== "All Stock") {
      chips.push({
        id: "stockStatus",
        label: `Stock: ${filters.stockStatus}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, stockStatus: "All Stock" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.activeFilter !== "All") {
      chips.push({
        id: "activeFilter",
        label: `Status: ${filters.activeFilter}`,
        onRemove: () => {
          setFilters((p) => ({ ...p, activeFilter: "All" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.featuredFilter === "Featured") {
      chips.push({
        id: "featuredFilter",
        label: "Featured Only",
        onRemove: () => {
          setFilters((p) => ({ ...p, featuredFilter: "All" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.newFilter === "New") {
      chips.push({
        id: "newFilter",
        label: "New Arrivals",
        onRemove: () => {
          setFilters((p) => ({ ...p, newFilter: "All" }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.saleOnly) {
      chips.push({
        id: "saleOnly",
        label: "Sale Items Only",
        onRemove: () => {
          setFilters((p) => ({ ...p, saleOnly: false }));
          setCurrentPage(1);
        },
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        id: "price",
        label: `Price: ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"} EGP`,
        onRemove: () => {
          setFilters((p) => ({ ...p, minPrice: "", maxPrice: "" }));
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [search, filters, router]);

  // Pagination computations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [safeCurrentPage, filteredProducts]);

  const deleteTarget = productsList.find(
    (product) => product.id === deleteProductId,
  );

  // Handlers: Update specific filter key / reset
  const updateFilter = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_PRODUCT_FILTERS);
    setCurrentPage(1);
    router.replace("/admin/products");
  };

  // Handler: Delete product permanently
  const handleDeleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteProduct(id);

      setProductsList((current) =>
        current.filter((product) => product.id !== id),
      );

      toast.success(
        "Product Deleted",
        "The product and its assets were removed from the catalog.",
      );
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(
        "Deletion Failed",
        "Could not delete this product. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setDeleteProductId(null);
      setSelectedProduct(null);
    }
  };

  // Handler: Toggle active visibility status
  const handleToggleActive = async (id: string) => {
    const product = productsList.find((item) => item.id === id);
    if (!product) return;

    const newValue = !product.is_active;

    try {
      setIsLoading(true);
      await toggleProductActive(id, newValue);

      setProductsList((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                is_active: newValue,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(
        newValue ? "Product Activated" : "Product Deactivated",
        newValue
          ? "Item is now active and visible to customers."
          : "Item is hidden from customer browsing.",
      );
    } catch (error) {
      console.error("Toggle product active error:", error);
      toast.error(
        "Status Update Failed",
        "Could not change the product visibility status.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Toggle featured highlight status
  const handleToggleFeatured = async (id: string) => {
    const product = productsList.find((item) => item.id === id);
    if (!product) return;

    const newValue = !product.is_featured;

    try {
      setIsLoading(true);
      await toggleProductFeatured(id, newValue);

      setProductsList((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                is_featured: newValue,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(
        newValue ? "Product Featured" : "Product Unfeatured",
        newValue
          ? "Item will be highlighted in featured collections."
          : "Item was removed from featured highlights.",
      );
    } catch (error) {
      console.error("Toggle product featured error:", error);
      toast.error(
        "Status Update Failed",
        "Could not update featured status.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 font-sans">
      {/* 1. Header Toolbar */}
      <TopHeader
        title="Products"
        description="Manage your luxury catalog, pricing, variants, and stock availability."
        buttonName="Add New Product"
        buttonHref="/admin/products/create"
      />

      {/* 2. Search & Advanced Filters Bar */}
      <section className="rounded-2xl border border-black/10 bg-white p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex-1">
            <ProductSearch
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearch("");
                setCurrentPage(1);
              }}
            />
          </div>

          <ProductFiltersButton
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((current) => !current)}
            activeCount={activeFilterChips.length}
          />
        </div>

        {/* Advanced Filters Expandable Drawer */}
        <ProductFilters
          showFilters={showFilters}
          filters={filters}
          categoriesList={categoriesList}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {/* 3. Active Filters Strip (Chips Bar) */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-black/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mr-1 shrink-0">
              <Filter className="size-3.5 text-primary" />
              <span>Active Filters ({activeFilterChips.length}):</span>
            </div>

            {activeFilterChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 text-xs font-semibold shadow-2xs"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full transition-colors shrink-0"
            >
              <RotateCcw className="size-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. Products List Container */}
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-3">
          <p className="text-xs sm:text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {paginatedProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {filteredProducts.length}
            </span>{" "}
            pieces
          </p>

          <ProductViewSwitcher
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>

        {/* View Layouts */}
        {viewMode === "table" ? (
          <ProductsTable
            products={paginatedProducts}
            categoriesList={categoriesList}
            currentPage={safeCurrentPage}
            onSelectProduct={setSelectedProduct}
          />
        ) : (
          <ProductsGrid
            products={paginatedProducts}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          pageSize={PRODUCTS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* 5. Product Quick Management Sheet Drawer */}
      <ProductDetailsSheet
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
          }
        }}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
        onDeleteProduct={(id) => setDeleteProductId(id)}
        isLoading={isLoading}
      />

      {/* 6. Delete Confirmation Alert Dialog */}
      <DeleteProductDialog
        product={deleteTarget ?? null}
        open={Boolean(deleteProductId)}
        onOpenChange={(open) => {
          if (!open) setDeleteProductId(null);
        }}
        onConfirm={async () => {
          if (deleteProductId) {
            await handleDeleteProduct(deleteProductId);
          }
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
