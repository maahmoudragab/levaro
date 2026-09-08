"use client";

import { useMemo } from "react";
import { SectionHeader } from "@/components/storefront/shared/SectionHeader";
import { SectionFooter } from "@/components/storefront/shared/SectionFooter";
import { ProductCard } from "@/components/storefront/shop/ProductCard";
import type { ProductItem } from "@/types/storefront";

export function SelectedEditions({ products }: { products?: ProductItem[] } = {}) {
  const displayedProducts = useMemo(() => {
    const list = products || [];
    const featured = list.filter((p) => p.is_featured === true);
    const nonFeatured = list.filter((p) => !p.is_featured);

    // Display the latest 6 products (featured prioritized first)
    return featured.length >= 6
      ? featured.slice(0, 6)
      : [...featured, ...nonFeatured].slice(0, 6);
  }, [products]);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="featured"
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="FEATURED"
        titleAccent="EDITIONS"
        subtitle="Signature atelier silhouettes and essential pieces highlighted for the season."
        theme="light"
        action={{
          label: "VIEW ALL PIECES",
          href: "/shop",
        }}
      />

      {/* 2. EXACT SHOP ARCHITECTURAL PRODUCT GRID (SAME SPACING, SIZES & PRODUCT CARD) */}
      <div className="site-container my-8 sm:my-12 lg:my-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3.5 sm:gap-x-8 gap-y-8 sm:gap-y-16">
          {displayedProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 2}
              theme="light"
            />
          ))}
        </div>
      </div>

      {/* 3. SECTION FOOTER */}
      <SectionFooter
        theme="light"
        showBackToTop={true}
        action={{
          label: "EXPLORE FULL ARCHIVE",
          href: "/shop",
        }}
        className="mt-6 sm:mt-8"
      />
    </section>
  );
}

export const FeaturedEditions = SelectedEditions;
