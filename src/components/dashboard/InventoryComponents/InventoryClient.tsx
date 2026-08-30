"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { InventoryOverview } from "@/components/dashboard/ProductsComponents/InventoryProducts";
import {
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured,
  type Product,
} from "@/app/services/admin/products";
import TopHeader from "@/components/dashboard/TopHeader";
import { ProductDetailsSheet } from "@/components/dashboard/ProductsComponents/ProductsView";

/* -------------------------------------------------------------------------- */
/* Main Component: Inventory Client State Manager                             */
/* -------------------------------------------------------------------------- */

/**
 * Client coordinator for the admin inventory dashboard.
 * Manages metrics, stock overview, and quick drawer management for products.
 */
export default function InventoryClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);

  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    setProductsList(initialProducts);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    <div className="flex flex-col gap-3 p-3 sm:p-4 font-sans">
      {/* 1. Header Toolbar */}
      <TopHeader
        title="Inventory"
        description="Track stock levels, size allocations, critical alerts, and recent updates."
        buttonName="Add New Product"
        buttonHref="/admin/products/create"
      />

      {/* 2. Dashboard Inventory Overview & Metrics */}
      <InventoryOverview
        products={productsList}
        onSelectProduct={setSelectedProduct}
      />

      {/* 3. Product Quick Manage Sheet */}
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
        onDeleteProduct={async (id) => {
          await handleDeleteProduct(id);
          setSelectedProduct(null);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
