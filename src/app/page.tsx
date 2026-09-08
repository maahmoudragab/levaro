import type { Metadata } from "next";
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
import { getStorefrontProducts } from "@/services/storefront/products";
import {
  getStorefrontDepartments,
  getStorefrontCuratedCollections,
} from "@/services/storefront/categories";
import { SITE_URL, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "LÉVARO",
  },
  description:
    "Official website of LÉVARO in Egypt. Discover architectural oversized silhouettes, elevated tailoring, and raw selvedge denim. Express delivery across all Egyptian governorates.",
  keywords: [
    "ليفارو",
    "براند ليفارو",
    "ماركة ليفارو",
    "دار ليفارو",
    "متجر ليفارو الرسمي",
    "تيشرتات ليفارو",
    "ملابس ليفارو",
    "LÉVARO",
    "Lévaro",
    "Levaro",
    "Levaro Egypt",
    "Levaro clothing",
    "Levaro t-shirts",
    "Mahmoud Ragab",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "LÉVARO — Contemporary Luxury Fashion Atelier",
    description:
      "Official website of LÉVARO in Egypt. Discover architectural oversized silhouettes, elevated tailoring, and raw selvedge denim.",
    url: SITE_URL,
    siteName: "LÉVARO",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [
      {
        url: `${SITE_URL}/images/og-levaro.jpg`,
        secureUrl: `${SITE_URL}/images/og-levaro.jpg`,
        width: 1200,
        height: 630,
        alt: "LÉVARO — Contemporary Luxury Fashion Atelier",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LÉVARO — Contemporary Luxury Fashion Atelier",
    description:
      "Official website of LÉVARO in Egypt. Discover architectural oversized silhouettes, elevated tailoring, and raw selvedge denim.",
    images: [`${SITE_URL}/images/og-levaro.jpg`],
  },
};

export const revalidate = 3600;

export default async function Home() {
  const [products, departments, curatedCollections] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontDepartments(),
    getStorefrontCuratedCollections(),
  ]);

  // Preload critical above-the-fold assets strictly to ensure instant, fluid entrance
  const criticalImages = [
    "/images/hero-background.jpg",
    departments[0]?.image || products[0]?.images?.[0] || "",
    curatedCollections[0]?.imagePrimary || "",
  ].filter(Boolean);

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

          {/* 2. DEPARTMENTS & DISCIPLINES (LIVE FROM SUPABASE) */}
          <Departments departments={departments} />

          {/* 3. COLLECTIONS (LIVE NEW ARRIVALS & LATEST MEN'S CAPSULE) */}
          <Collections collections={curatedCollections} />

          {/* 4. FEATURED EDITIONS (LIVE FROM SUPABASE) */}
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
