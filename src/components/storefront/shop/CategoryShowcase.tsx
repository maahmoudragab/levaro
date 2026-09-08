import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/shop/ProductCard";
import type { ProductItem } from "@/types/storefront";
import type { ResolvedCategory } from "@/services/storefront/categories";

interface CategoryShowcaseProps {
  category: ResolvedCategory;
  products: ProductItem[];
  otherCategories?: { slug: string; name: string }[];
}

export function CategoryShowcase({
  category,
  products,
  otherCategories = [],
}: CategoryShowcaseProps) {
  const relatedDisciplines = otherCategories.filter(
    (d) => d.slug.toLowerCase() !== category.slug.toLowerCase()
  );

  return (
    <div className="w-full min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-16 max-w-[1536px] mx-auto flex flex-col gap-10 sm:gap-14">
      {/* 1. ATELIER BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.2em] text-brand-gray"
      >
        <Link
          href="/"
          className="hover:text-near-black transition-colors duration-200"
        >
          HOME
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <Link
          href="/shop"
          className="hover:text-near-black transition-colors duration-200"
        >
          SHOP
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-near-black font-semibold">
          {category.name.toUpperCase()}
        </span>
      </nav>

      {/* 2. EDITORIAL CATEGORY HEADER */}
      <header className="border-b border-near-black/15 pb-8 sm:pb-12 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-near-black inline-block" />
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.26em] text-brand-gray">
              ATELIER DISCIPLINE // {category.parentName || "CATALOGUE"}
            </span>
          </div>

          <span className="text-[11px] font-mono tracking-[0.18em] text-brand-gray">
            {products.length} {products.length === 1 ? "EDITION" : "EDITIONS"} AVAILABLE
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-light uppercase tracking-tight text-near-black leading-none">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base font-sans font-light tracking-[0.04em] text-brand-gray leading-relaxed mt-2">
              {category.description}
            </p>
          </div>

          {/* Bilingual Arabic Search Anchor */}
          <div className="flex flex-col items-start lg:items-end gap-1 text-right">
            <span className="text-xs sm:text-sm font-sans font-medium text-near-black/80 tracking-wide">
              {category.arabicName}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray">
              دار ليفارو للأزياء — مصر
            </span>
          </div>
        </div>
      </header>

      {/* 3. PRODUCT GRID */}
      {products.length > 0 ? (
        <section aria-label={`${category.name} Editions`}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3.5 sm:gap-x-8 gap-y-10 sm:gap-y-16">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
                theme="light"
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-5 border border-dashed border-near-black/20 p-8 sm:p-16">
          <span className="text-xs uppercase font-mono tracking-[0.22em] text-brand-gray">
            ARCHIVE TEMPORARILY EXHAUSTED
          </span>
          <p className="text-base sm:text-lg font-sans font-light tracking-wide text-near-black max-w-md">
            All editions under this discipline are currently reserved or undergoing atelier production.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.22em] hover:bg-near-black/85 transition-colors cursor-pointer"
          >
            <span>BROWSE FULL ATELIER CATALOGUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. CROSS-DISCIPLINE INTERNAL LINKING ARCHITECTURE */}
      <footer className="mt-16 pt-12 border-t border-near-black/15 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono tracking-[0.26em] text-brand-gray">
            DISCOVER OTHER DISCIPLINES
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-light uppercase tracking-tight text-near-black">
            EXPLORE THE LÉVARO ATELIER
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {relatedDisciplines.map((item) => (
            <Link
              key={item.slug}
              href={`/shop/${item.slug}`}
              className="px-4 py-2.5 border border-near-black/15 hover:border-near-black bg-white/50 hover:bg-near-black hover:text-off-white text-near-black text-xs uppercase font-sans tracking-[0.16em] transition-all duration-200 cursor-pointer"
            >
              {item.name.toUpperCase()}
            </Link>
          ))}
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.16em] hover:bg-near-black/85 transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>ALL EDITIONS</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
