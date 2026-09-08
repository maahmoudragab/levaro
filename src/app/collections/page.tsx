import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { CollectionsCatalog } from "@/components/storefront/collections/CollectionsCatalog";
import { getAllStorefrontSubCategories } from "@/services/storefront/categories";

import { SITE_URL, siteConfig, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "COLLECTIONS",
  description:
    "استكشف كولكشن ليفارو (LÉVARO) الكامل: كبسولات حصرية، تصاميم دينم السيلفدج، المعاطف المهيكلة، والقصات الحديثة. تصفح التشكيلات الحصرية لدار ليفارو في مصر.",
  keywords: [
    "كولكشن ليفارو",
    "تشكيلات ليفارو",
    "براند ليفارو كولكشن",
    "أزياء ليفارو",
    "Levaro collections",
    "Levaro capsules",
    "Levaro Egypt",
  ],
  alternates: {
    canonical: `${SITE_URL}/collections`,
  },
  openGraph: {
    title: "كولكشن ليفارو — LÉVARO COLLECTIONS ARCHIVE",
    description: "استكشف كافة كبسولات وتشكيلات دار ليفارو للأزياء الفاخرة في مصر.",
    url: `${SITE_URL}/collections`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "كولكشن وتشكيلات ليفارو — LÉVARO",
      },
    ],
  },
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const subCategories = await getAllStorefrontSubCategories();

  // Critical images for Preloader GPU decode
  const criticalImages = [
    subCategories[0]?.image || "",
    subCategories[1]?.image || "",
  ].filter(Boolean);

  return (
    <>
      {/* 1. Functional Luxury Preloader */}
      <Preloader
        images={criticalImages}
        title="COLLECTIONS"
        tagline="ATELIER CAPSULES &amp; DISCIPLINES"
      />

      {/* 2. Trailing Luxury Cursor */}
      <LuxuryCursor />

      {/* 3. Smooth Scroll Architecture */}
      <SmoothScroll>
        <main
          data-light-section="true"
          className="min-h-screen bg-off-white text-near-black flex flex-col justify-between"
        >
          <Header theme="light" />

          {/* Page Body */}
          <div className="w-full site-padding-x pt-28 sm:pt-36 pb-20 sm:pb-28 flex-1">
            <div className="site-container flex flex-col gap-10 sm:gap-14">
              
              {/* Editorial Page Header */}
              <div className="flex flex-col gap-4 border-b border-near-black/15 pb-8">
                {/* Breadcrumbs & Exhibition Metadata */}
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
                  <Link href="/" className="hover:text-near-black transition-colors">
                    HOME
                  </Link>
                  <span>/</span>
                  <span className="text-near-black font-semibold">COLLECTIONS</span>
                  <span className="hidden sm:inline text-near-black/20">•</span>
                  <span className="hidden sm:inline text-brand-gray">ATELIER EXHIBITION</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight leading-none text-near-black">
                      COLLECTIONS ARCHIVE
                    </h1>
                    <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.16em] text-brand-gray max-w-xl leading-relaxed">
                      Every sub-category and capsule represents an autonomous exploration of silhouette, bespoke textile, and disciplined drape. Select any collection to enter filtered editions in the main store.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Collections & Sub-categories Catalog */}
              <CollectionsCatalog initialSubCategories={subCategories} />
            </div>
          </div>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
