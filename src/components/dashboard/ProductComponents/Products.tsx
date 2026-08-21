"use client";

import { useEffect, useMemo, useState } from "react";

import ProductSearch from "@/components/dashboard/ProductComponents/ProductSearch";
import ProductFilters, {
  ProductFiltersButton,
} from "@/components/dashboard/ProductComponents/ProductFilters";
import ProductView from "@/components/dashboard/ProductComponents/ProductsView";

import {
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured,
  type Product,
} from "@/app/services/admin/products";

import TopHeader from "@/components/dashboard/TopHeader";
import StatCard from "@/components/dashboard/StateCard";

export default function Products({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [productsList, setProductsList] =
    useState<Product[]>(initialProducts);

  // =========================
  // Search & Filters
  // =========================

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [category, setCategory] =
    useState("All Categories");

  const [color, setColor] =
    useState("All Colors");

  const [gender, setGender] =
    useState("All Genders");

  const [brand, setBrand] =
    useState("All Brands");

  const [fit, setFit] =
    useState("All Fits");

  const [stockStatus, setStockStatus] =
    useState("All Stock");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [featuredFilter, setFeaturedFilter] =
    useState("All");

  const [newFilter, setNewFilter] =
    useState("All");

  const [sort, setSort] =
    useState("newest");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [saleOnly, setSaleOnly] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  // =========================
  // Sync Initial Products
  // =========================

  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  // =========================
  // Filter Options
  // =========================

  const categories = useMemo(() => {
    const values = productsList
      .map((product) => product.category_name)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return [
      "All Categories",
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [productsList]);

  const colors = useMemo(() => {
    const values = productsList
      .map((product) => product.color)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return [
      "All Colors",
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [productsList]);

  const genders = useMemo(() => {
    const values = productsList
      .map((product) => product.gender)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return [
      "All Genders",
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [productsList]);

  const brands = useMemo(() => {
    const values = productsList
      .map((product) => product.brand)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return [
      "All Brands",
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [productsList]);

  const fits = useMemo(() => {
    const values = productsList
      .map((product) => product.fit)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return [
      "All Fits",
      ...Array.from(new Set(values)).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [productsList]);

  // =========================
  // Filter + Search + Sort
  // =========================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return productsList
      .filter((product) => {
        // Search
        const matchSearch =
          !query ||
          product.name
            .toLowerCase()
            .includes(query) ||
          (product.sku ?? "")
            .toLowerCase()
            .includes(query) ||
          product.id
            .toLowerCase()
            .includes(query);

        // Category
        const matchCategory =
          category === "All Categories" ||
          product.category_name === category;

        // Color
        const matchColor =
          color === "All Colors" ||
          product.color === color;

        // Gender
        const matchGender =
          gender === "All Genders" ||
          product.gender === gender;

        // Brand
        const matchBrand =
          brand === "All Brands" ||
          product.brand === brand;

        // Fit
        const matchFit =
          fit === "All Fits" ||
          product.fit === fit;

        // Active
        const matchActive =
          activeFilter === "All"
            ? true
            : activeFilter === "Active"
              ? product.is_active
              : !product.is_active;

        // Featured
        const matchFeatured =
          featuredFilter === "All"
            ? true
            : featuredFilter === "Featured"
              ? product.is_featured
              : !product.is_featured;

        // New Arrival
        const matchNew =
          newFilter === "All"
            ? true
            : newFilter === "New"
              ? product.is_new
              : !product.is_new;

        // Sale
        const matchSale =
          saleOnly
            ? product.sale_price !== null
            : true;

        // Price
        const price =
          product.sale_price ??
          product.price;

        const matchMinPrice =
          minPrice === "" ||
          price >= Number(minPrice);

        const matchMaxPrice =
          maxPrice === "" ||
          price <= Number(maxPrice);

        // Stock
        const totalStock = (
          product.stock ?? []
        ).reduce(
          (total, item) =>
            total + item.stock,
          0
        );

        const matchStock =
          stockStatus === "All Stock"
            ? true
            : stockStatus === "In Stock"
              ? totalStock > 12
              : stockStatus === "Low Stock"
                ? totalStock > 0 &&
                  totalStock <= 12
                : totalStock === 0;

        return (
          matchSearch &&
          matchCategory &&
          matchColor &&
          matchGender &&
          matchBrand &&
          matchFit &&
          matchActive &&
          matchFeatured &&
          matchNew &&
          matchSale &&
          matchMinPrice &&
          matchMaxPrice &&
          matchStock
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "name":
            return a.name.localeCompare(
              b.name
            );

          case "price-low":
            return (
              (a.sale_price ?? a.price) -
              (b.sale_price ?? b.price)
            );

          case "price-high":
            return (
              (b.sale_price ?? b.price) -
              (a.sale_price ?? a.price)
            );

          case "newest":
          default:
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );
        }
      });
  }, [
    productsList,
    search,
    category,
    color,
    gender,
    brand,
    fit,
    stockStatus,
    activeFilter,
    featuredFilter,
    newFilter,
    sort,
    minPrice,
    maxPrice,
    saleOnly,
  ]);

  // =========================
  // Stats
  // =========================

  const activeCount = useMemo(() => {
    return productsList.filter(
      (product) => product.is_active
    ).length;
  }, [productsList]);

  // =========================
  // Delete Product
  // =========================

  const handleDeleteProduct = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      await deleteProduct(id);

      setProductsList((prev) =>
        prev.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete product:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Toggle Active
  // =========================

  const handleToggleActive = async (
    id: string
  ) => {
    const product = productsList.find(
      (item) => item.id === id
    );

    if (!product) return;

    const newValue = !product.is_active;

    try {
      setIsLoading(true);

      await toggleProductActive(
        id,
        newValue
      );

      setProductsList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_active: newValue,
                updated_at:
                  new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Toggle product active:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update product status."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Toggle Featured
  // =========================

  const handleToggleFeatured = async (
    id: string
  ) => {
    const product = productsList.find(
      (item) => item.id === id
    );

    if (!product) return;

    const newValue =
      !product.is_featured;

    try {
      setIsLoading(true);

      await toggleProductFeatured(
        id,
        newValue
      );

      setProductsList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_featured: newValue,
                updated_at:
                  new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Toggle product featured:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update featured status."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Reset Filters
  // =========================

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setColor("All Colors");
    setGender("All Genders");
    setBrand("All Brands");
    setFit("All Fits");
    setStockStatus("All Stock");
    setActiveFilter("All");
    setFeaturedFilter("All");
    setNewFilter("All");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setSaleOnly(false);
  };

  return (
    <div className="p-4 flex flex-col gap-2 pb-50">
      {/* =========================
          HEADER
      ========================= */}

      <TopHeader
        title="Products Directory"
        description="Manage product inventory and view real-time table analytics."
        buttonName="Add New Product"
      />

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Total Inventory"
          value={productsList.length}
        />

        <StatCard
          label="Active Items"
          value={activeCount}
        />

        <StatCard
          label="Filtered Results"
          value={filteredProducts.length}
        />

        <StatCard
          label="Current Page Items"
          value={Math.min(
            filteredProducts.length,
            10
          )}
        />
      </div>

      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <section className="rounded-2xl bg-[#f7f8f9] p-3 sm:p-4 space-y-3">
        <div className="flex gap-2">
          <ProductSearch
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
            }}
            onClear={() => {
              setSearch("");
            }}
          />

          <ProductFiltersButton
            showFilters={showFilters}
            onToggleFilters={() =>
              setShowFilters(
                (prev) => !prev
              )
            }
          />
        </div>

        <ProductFilters
          showFilters={showFilters}
          category={category}
          setCategory={setCategory}
          color={color}
          setColor={setColor}
          gender={gender}
          setGender={setGender}
          brand={brand}
          setBrand={setBrand}
          fit={fit}
          setFit={setFit}
          stockStatus={stockStatus}
          setStockStatus={setStockStatus}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          featuredFilter={featuredFilter}
          setFeaturedFilter={
            setFeaturedFilter
          }
          newFilter={newFilter}
          setNewFilter={setNewFilter}
          sort={sort}
          setSort={setSort}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          saleOnly={saleOnly}
          setSaleOnly={setSaleOnly}
          categories={categories}
          colors={colors}
          genders={genders}
          brands={brands}
          fits={fits}
          onReset={resetFilters}
          onPageReset={() => {}}
        />
      </section>

      {/* =========================
          PRODUCT VIEW
          
          Table / Grid
          Pagination
          Side Drawer
      ========================= */}

      <ProductView
        products={filteredProducts}
        onToggleActive={handleToggleActive}
        onToggleFeatured={
          handleToggleFeatured
        }
        onDeleteProduct={
          handleDeleteProduct
        }
        isLoading={isLoading}
      />
    </div>
  );
}