import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Hero } from "@/components/storefront/sections/Hero";
import { Departments } from "@/components/storefront/sections/Departments";
import { Collections } from "@/components/storefront/sections/Collections";
import { BrandStory } from "@/components/storefront/sections/BrandStory";
import { SelectedEditions } from "@/components/storefront/sections/SelectedEditions";
import { Footer } from "@/components/storefront/sections/Footer";
import { getStorefrontProducts } from "@/app/services/storefront/products";
import { getStorefrontTaxonomies } from "@/app/services/storefront/categories";
import { DEPARTMENTS } from "@/data/storefront";

export const revalidate = 3600;

export default async function Home() {
  const [products] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontTaxonomies(),
  ]);

  // Preload critical above-the-fold assets strictly to ensure instant, fluid entrance
  const criticalImages = [
    "/images/hero background.jpg",
    products[0]?.images[0] || DEPARTMENTS[0].image,
  ];

  return (
    <>
      {/* Luxury Preloader (Full Real Asset & Font Decode) */}
      <Preloader images={criticalImages} />

      {/* Trailing Inverted Luxury Cursor */}
      <LuxuryCursor />

      {/* Main Storefront (Server Component Architecture) */}
      <SmoothScroll>
        <main className="min-h-screen bg-near-black text-off-white">
          {/* Minimal luxury header */}
          <Header />

          {/* 1. HERO */}
          <Hero />

          {/* 2. DEPARTMENTS & DISCIPLINES (LOCKED) */}
          <Departments />

          {/* 3. COLLECTIONS */}
          <Collections />

          {/* 5. SELECTED EDITIONS (CURATED PIECES FROM SUPABASE) */}
          <SelectedEditions products={products} />

          {/* 4. BRAND STORY & MANIFESTO */}
          <BrandStory />

          {/* 6. FOOTER */}
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
