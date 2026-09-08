"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/shop/ProductCard";
import type { ProductItem } from "@/types/storefront";

interface NewArrivalsCatalogProps {
  products: ProductItem[];
}

const DEPARTMENTS = [
  { key: "all", label: "ALL PIECES" },
  { key: "men", label: "MEN" },
  { key: "women", label: "WOMEN" },
  { key: "accessories", label: "ACCESSORIES" },
];

export function NewArrivalsCatalog({ products }: NewArrivalsCatalogProps) {
  const [activeDepartment, setActiveDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Filter products by department
  const filteredProducts = useMemo(() => {
    let list = products;

    if (activeDepartment !== "all") {
      list = list.filter((p) => {
        const dept = (p.department || "").toLowerCase();
        const gender = (p.gender || "").toLowerCase();
        return dept === activeDepartment || gender.includes(activeDepartment);
      });
    }

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    }

    return list;
  }, [products, activeDepartment, sortBy]);

  return (
    <div className="w-full flex flex-col gap-8 sm:gap-12">
      {/* 1. Interactive Department Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-near-black/15">
        {/* Department Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeDepartment === dept.key;
            return (
              <button
                key={dept.key}
                type="button"
                onClick={() => setActiveDepartment(dept.key)}
                className={`px-4 py-2 text-[11px] sm:text-xs uppercase font-sans tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-near-black text-off-white border-near-black shadow-sm"
                    : "bg-transparent text-near-black/70 border-near-black/15 hover:border-near-black/40 hover:text-near-black"
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Counter & Sort Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono tracking-[0.16em] text-brand-gray">
          <span>{filteredProducts.length} EDITIONS</span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
            className="bg-transparent border border-near-black/15 px-3 py-1.5 text-[10.5px] uppercase font-mono tracking-[0.18em] text-near-black focus:outline-none focus:border-near-black cursor-pointer"
          >
            <option value="featured">CURATED SORT</option>
            <option value="price-asc">PRICE: LOW — HIGH</option>
            <option value="price-desc">PRICE: HIGH — LOW</option>
          </select>
        </div>
      </div>

      {/* 2. Responsive Product Grid (2 columns mobile, 3 columns desktop) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3.5 sm:gap-x-8 gap-y-8 sm:gap-y-14">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
              theme="light"
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-sm uppercase font-sans tracking-[0.2em] text-brand-gray">
            NO RECENT EDITIONS FOUND IN THIS DISCIPLINE
          </p>
          <button
            type="button"
            onClick={() => setActiveDepartment("all")}
            className="px-6 py-2.5 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.2em] hover:bg-near-black/80 transition-colors cursor-pointer"
          >
            VIEW ALL EDITIONS
          </button>
        </div>
      )}

      {/* 3. Bottom Transition to Complete Archive */}
      <div className="mt-12 sm:mt-16 pt-10 border-t border-near-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-near-black/5 p-6 sm:p-10">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
            COMPLETE ARCHIVE
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-light uppercase tracking-tight text-near-black">
            EXPLORE THE FULL CATALOGUE
          </h3>
          <p className="text-xs uppercase font-sans tracking-[0.14em] text-brand-gray max-w-md">
            Discover permanent editions, foundational tailoring, and all seasonal capsules.
          </p>
        </div>

        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.22em] font-semibold hover:bg-near-black/85 transition-all duration-300 shadow-md cursor-pointer shrink-0 w-fit"
        >
          <span>VIEW ALL PRODUCTS</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
