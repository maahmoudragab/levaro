/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  InventoryOverview,
  RecentlyAddedProducts,
  RecentlyUpdatedProducts,
} from "./InventoryProducts";
import {
  deleteProduct,
  getProductHistory,
  toggleProductActive,
  toggleProductFeatured,
  type Product,
  type ProductHistory,
} from "@/app/services/admin/products";

import { Toaster } from "@/components/ui/sonner";
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
import TopHeader from "../TopHeader";

export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilterState>(
    DEFAULT_PRODUCT_FILTERS,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<ProductHistory[]>([]);

  // Dashboard widgets intentionally use the complete product list,
  // so search and filters do not affect them.
  const dashboardProducts = productsList;

  // Sync server data
  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  const loadHistory = useCallback(async () => {
    try {
      const nextHistory = await getProductHistory(50);
      setHistory(nextHistory);
    } catch (error) {
      console.error("Load product history:", error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // Filter options
  const filterOptions = useMemo(
    () => getFilterOptions(productsList),
    [productsList],
  );

  // Filtered products
  const filteredProducts = useMemo(
    () => filterProducts(productsList, search, filters),
    [productsList, search, filters],
  );

  const updateFilter = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_PRODUCT_FILTERS);
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteProduct(id);

      setProductsList((current) =>
        current.filter((product) => product.id !== id),
      );

      toast.success("Product deleted successfully.", {
        duration: 3000,
        style: {
          backgroundColor:
            "color-mix(in srgb, var(--primary) 50%, transparent)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid #00ff6a24",
          padding: "10px 15px",
          color: "white",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    } catch (error) {
      console.error("Delete product:", error);
      toast.error("Failed to delete product.", {
        duration: 3000,
        style: {
          backgroundColor: "#b8040469",
          backdropFilter: "blur(20px)",
          border: "1.5px solid  #b8040469",
          padding: "10px 15px",
          color: "white",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string) => {
    const product = productsList.find((item) => item.id === id);
    if (!product) return;

    const newValue = !product.is_active;

    try {
      setIsLoading(true);
      await toggleProductActive(id, newValue);
      await loadHistory();

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

      toast.success(newValue ? "Product activated." : "Product deactivated.", {
        duration: 3000,
        style: {
          backgroundColor:
            "color-mix(in srgb, var(--primary) 50%, transparent)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid #00ff6a24",
          padding: "10px 15px",
          color: "white",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    } catch (error) {
      console.error("Toggle product active:", error);
      toast.error("Failed to update product status", {
        duration: 3000,
        style: {
          backgroundColor: "#b8040469",
          backdropFilter: "blur(20px)",
          border: "1.5px solid  #b8040469",
          padding: "10px 15px",
          color: "white",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (id: string) => {
    const product = productsList.find((item) => item.id === id);
    if (!product) return;

    const newValue = !product.is_featured;

    try {
      setIsLoading(true);
      await toggleProductFeatured(id, newValue);
      await loadHistory();

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
        newValue ? "Product featured." : "Product removed from featured.",
        {
          duration: 3000,
          style: {
            backgroundColor:
              "color-mix(in srgb, var(--primary) 50%, transparent)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid #00ff6a24",
            padding: "10px 15px",
            color: "white",
            fontSize: "17px",
            borderRadius: "72px",
            boxShadow: "0 0 24px #00ff6a24",
            userSelect: "none",
          },
        },
      );
    } catch (error) {
      console.error("Toggle product featured:", error);
      toast.error("Failed to update featured status", {
        duration: 3000,
        style: {
          backgroundColor: "#b8040469",
          backdropFilter: "blur(20px)",
          border: "1.5px solid  #b8040469",
          padding: "10px 15px",
          color: "white",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col gap-2 p-3 sm:p-4">
        {/* Header */}
        <TopHeader
          title="Products"
          description="Manage your products, update details, and track inventory."
          buttonName="Add New Product"
        />

        {/* Dashboard widgets */}
        <InventoryOverview
          products={dashboardProducts}
          onSelectProduct={setSelectedProduct}
        />

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[50%_50%]">
          <RecentlyAddedProducts
            products={dashboardProducts}
            onSelectProduct={setSelectedProduct}
          />

          {/* Recently Updated */}
          <RecentlyUpdatedProducts
            products={dashboardProducts}
            history={history}
            onSelectProduct={setSelectedProduct}
          />
        </div>

        {/* Search & Filters */}
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

        {/* Products */}
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
    </>
  );
}