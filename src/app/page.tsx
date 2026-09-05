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

export default function Home() {
  return (
    <>
      {/* Luxury Preloader (Full Real Asset & Font Decode) */}
      <Preloader
        images={[
          "/images/hero background.jpg",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop",
        ]}
      />

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

          {/* 5. SELECTED EDITIONS (CURATED PIECES) */}
          <SelectedEditions />

          {/* 4. BRAND STORY & MANIFESTO */}
          <BrandStory />

          {/* 6. FOOTER */}
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
