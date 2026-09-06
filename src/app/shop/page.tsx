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
import { SHOP_PRODUCTS } from "@/data/storefront";

export const metadata: Metadata = {
  title: "CATALOG ARCHIVE // ALL EDITIONS — LÉVARO",
  description:
    "Explore the complete catalogue of LÉVARO editions. Filter by discipline, seasonal collection, raw selvedge denim, sculptural tailoring, and minimal objects.",
};

// Revalidate storefront cache every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function ShopPage() {
  // 1 Server-side cached queries with Next.js unstable_cache
  const [products, taxonomies] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontTaxonomies(),
  ]);

  const criticalImages = [
    products[0]?.images[0] || SHOP_PRODUCTS[0]?.images[0] || "",
    products[1]?.images[0] || SHOP_PRODUCTS[1]?.images[0] || "",
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
          <Suspense
            fallback={
              <div className="min-h-screen bg-off-white flex items-center justify-center">
                <span className="text-xs font-mono tracking-[0.25em] text-brand-gray uppercase animate-pulse">
                  INITIALIZING ATELIER CATALOG...
                </span>
              </div>
            }
          >
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

