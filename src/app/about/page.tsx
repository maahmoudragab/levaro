import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { AboutHero } from "@/components/storefront/about/AboutHero";
import { AboutManifesto } from "@/components/storefront/about/AboutManifesto";
import { AboutDisciplines } from "@/components/storefront/about/AboutDisciplines";
import { AboutMaterials } from "@/components/storefront/about/AboutMaterials";
import { AboutProtocol } from "@/components/storefront/about/AboutProtocol";

export const metadata: Metadata = {
  title: "THE HOUSE — LÉVARO",
  description:
    "The architectural manifesto, material philosophy, kinetic drapery, and atelier disciplines of LÉVARO.",
};

export const revalidate = 3600;

export default function AboutPage() {
  // Critical images to preload & decode on GPU before lifting curtain
  const criticalImages = [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1000&auto=format&fit=crop",
  ];

  return (
    <>
      {/* Functional Real Asset & Font Preloader */}
      <Preloader
        title="THE HOUSE"
        tagline="ARCHITECTURAL MANIFESTO // L'ATELIER"
        images={criticalImages}
      />

      {/* Trailing Inverted Luxury Cursor */}
      <LuxuryCursor />

      {/* Smooth Scroll Architecture */}
      <SmoothScroll>
        <main className="min-h-screen bg-off-white text-near-black">
          <Header theme="light" />

          {/* 1. MONUMENTAL HERO ARCHITECTURE */}
          <AboutHero />

          {/* 2. THE STRUCTURAL THESIS */}
          <AboutManifesto />

          {/* 3. THE FOUR ATELIER DISCIPLINES */}
          <AboutDisciplines />

          {/* 4. THE TEXTILE LEXICON & BLUEPRINT */}
          <AboutMaterials />

          {/* 5. ATELIER ACQUISITION PROTOCOL & CONCIERGE */}
          <AboutProtocol />

          {/* 6. ATELIER FOOTER */}
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
