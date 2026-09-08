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

import { SITE_URL, siteConfig, generateAboutPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ABOUT",
  description:
    "تعرف على دار ليفارو (LÉVARO) للأزياء الفاخرة في مصر: الفلسفة المعمارية، خامات السيلفدج والصوف المعالج، والحرفية العالية في تفصيل الأزياء المعاصرة.",
  keywords: [
    "عن ليفارو",
    "دار ليفارو",
    "قصة براند ليفارو",
    "أتيليه ليفارو",
    "Lévaro House",
    "About Levaro",
    "Levaro atelier",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "عن دار ليفارو للأزياء الفاخرة — THE HOUSE — LÉVARO",
    description: "الفلسفة المعمارية وخامات دار ليفارو للأزياء الفاخرة في مصر.",
    url: `${SITE_URL}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "دار ليفارو — LÉVARO",
      },
    ],
  },
};

export const revalidate = 3600;

export default function AboutPage() {
  const aboutJsonLd = generateAboutPageJsonLd();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "الرئيسية", url: "/" },
    { name: "عن دار ليفارو", url: "/about" },
  ]);

  // Critical images to preload & decode on GPU before lifting curtain
  const criticalImages = [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1000&auto=format&fit=crop",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
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
