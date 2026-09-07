import { Suspense } from "react";
import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { ShopCatalog } from "@/components/storefront/shop/ShopCatalog";
import { getStorefrontProducts } from "@/app/services/storefront/products";
import { getStorefrontTaxonomies } from "@/app/services/storefront/categories";

export const metadata: Metadata = {
  title: "CATALOG ARCHIVE // ALL EDITIONS — LÉVARO",
  description:
    "Explore the complete catalogue of LÉVARO editions. Filter by discipline, seasonal collection, raw selvedge denim, sculptural tailoring, and minimal objects.",
};

// High-speed cached ISR revalidation
export const revalidate = 3600;

function ShopCatalogSkeleton() {
  return (
    <div className="pt-20 sm:pt-28 site-padding-x pb-24 flex-1">
      {/* Skeleton Control Bar */}
      <div className="h-10 border-b border-near-black/10 mb-4 flex items-center justify-between">
        <div className="h-3.5 bg-near-black/5 w-40" />
        <div className="h-3.5 bg-near-black/5 w-24" />
      </div>

      {/* Responsive Skeleton Grid (Zero CLS: exactly mirrors ProductCard dimensions) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3.5 sm:gap-x-8 gap-y-8 sm:gap-y-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="w-full aspect-[3/4] bg-[#F0EEEA] mb-3 animate-pulse" />
            <div className="flex items-baseline justify-between pt-1 mb-1">
              <div className="h-3.5 bg-near-black/5 w-1/2" />
              <div className="h-3.5 bg-near-black/5 w-16" />
            </div>
            <div className="h-2.5 bg-near-black/5 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const [products, taxonomies] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontTaxonomies(),
  ]);

  const criticalImages = [
    products[0]?.images[0] || "",
    products[1]?.images[0] || "",
  ].filter(Boolean);

  return (
    <>
      {/* 1. Mandatory Functional Preloader */}
      <Preloader
        images={criticalImages}
        title="CATALOG"
        tagline="ARCHIVE CATALOG // ALL EDITIONS"
      />

      {/* 2. Custom Inverted Luxury Cursor */}
      <LuxuryCursor />

      {/* 3. Smooth Scroll Experience */}
      <SmoothScroll>
        <main className="min-h-screen bg-off-white text-near-black flex flex-col justify-between">
          <Header theme="light" />
          <Suspense fallback={<ShopCatalogSkeleton />}>
            <ShopCatalog
              initialProducts={products}
              initialTaxonomies={taxonomies}
            />
          </Suspense>
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
