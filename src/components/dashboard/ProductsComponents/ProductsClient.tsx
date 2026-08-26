"use client";

import { useMemo, useState } from "react";
import { toast } from "@/lib/toast";
import { InventoryOverview } from "@/components/dashboard/ProductsComponents/InventoryProducts";
import {
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured,
  type Product,
} from "@/app/services/admin/products";
import ProductSearch from "@/components/dashboard/ProductsComponents/ProductSearch";
import ProductFilters, {
  ProductFiltersButton,
} from "@/components/dashboard/ProductsComponents/ProductFilters";
import ProductView from "@/components/dashboard/ProductsComponents/ProductsView";
import {
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilterState,
  getFilterOptions,
  filterProducts,
} from "@/components/dashboard/ProductsComponents/product-utils";
import TopHeader from "@/components/dashboard/TopHeader";

/* -------------------------------------------------------------------------- */
/* Main Component: Products Client State Manager                              */
/* -------------------------------------------------------------------------- */

/**
 * Client coordinator for the admin products dashboard.
 * Manages search state, filters, optimistic updates, and CRUD action handlers.
 */
export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);

  // Synchronize state when server props update
  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProductsList(initialProducts);
  }

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilterState>(
    DEFAULT_PRODUCT_FILTERS,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Compute available filter dropdown options dynamically from dataset
  const filterOptions = useMemo(
    () => getFilterOptions(productsList),
    [productsList],
  );

  // Compute filtered & sorted product list
  const filteredProducts = useMemo(
    () => filterProducts(productsList, search, filters),
    [productsList, search, filters],
  );

  // Handler: Update specific filter key
  const updateFilter = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  // Handler: Reset search and all active filters to default
  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_PRODUCT_FILTERS);
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
    <div className="flex flex-col gap-2 p-3 sm:p-4 font-sans">
      {/* 1. Header Toolbar */}
      <TopHeader
        title="Products"
        description="Manage your products, update details, and track inventory."
        buttonName="Add New Product"
        buttonHref="/admin/products/create"
      />

      {/* 2. Dashboard Inventory Overview & Metrics */}
      <InventoryOverview
        products={productsList}
        onSelectProduct={setSelectedProduct}
      />

      {/* 3. Search & Filter Bar */}
      <section className="rounded-xl bg-[#f7f8f9] p-2.5">
        <div className="flex gap-2">
          <ProductSearch
            search={search}
            onSearchChange={setSearch}
            onClear={() => setSearch("")}
          />

          <ProductFiltersButton
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((current) => !current)}
          />
        </div>

        <ProductFilters
          showFilters={showFilters}
          filters={filters}
          options={filterOptions}
          onChange={updateFilter}
          onReset={resetFilters}
        />
      </section>

      {/* 4. Products Table / Grid View */}
      <ProductView
        isLoading={isLoading}
        products={filteredProducts}
        onToggleActive={handleToggleActive}
        onDeleteProduct={handleDeleteProduct}
        onToggleFeatured={handleToggleFeatured}
        selectedProduct={selectedProduct}
        onSelectedProductChange={setSelectedProduct}
      />
    </div>
  );
}