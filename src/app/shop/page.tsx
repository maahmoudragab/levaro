import { Suspense } from "react";
import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { ShopCatalog } from "@/components/storefront/shop/ShopCatalog";
import { getStorefrontProducts } from "@/services/storefront/products";
import { getStorefrontTaxonomies } from "@/services/storefront/categories";

import { SITE_URL, siteConfig, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SHOP",
  description:
    "تسوق كتالوج ليفارو (LÉVARO) الكامل: أحدث تشكيلة من تيشرتات ليفارو الفاخرة (Oversized Tees & Minimalist Tops)، البناطيل، المعاطف، ودينم السيلفدج الياباني. تصاميم معمارية راقية مع شحن سريع في مصر.",
  keywords: [
    "تيشرتات ليفارو",
    "تيشيرت ليفارو",
    "تيشرتات اوفر سايز ليفارو",
    "ملابس ليفارو",
    "شوب ليفارو",
    "متجر ليفارو",
    "كتالوج ليفارو",
    "هدوم ليفارو",
    "Levaro t-shirts",
    "Levaro tees",
    "Levaro shop",
    "Levaro catalog",
    "Levaro clothing",
    "Levaro Egypt",
    "تيشرتات براند مصري",
    "ملابس شبابية راقية مصر",
  ],
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: "تسوق تيشرتات وملابس ليفارو الرسمية — LÉVARO CATALOG",
    description:
      "تصفح أحدث كولكشن من دار ليفارو: تيشرتات أوفر سايز راقية، أزياء عصرية، وجواكت مصممة بخامات فاخرة.",
    url: `${SITE_URL}/shop`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "تيشرتات وملابس ليفارو — LÉVARO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تسوق تيشرتات وملابس ليفارو | LÉVARO",
    description:
      "كتالوج وتيشرتات ليفارو الفاخرة — تصاميم معمارية راقية وتوصيل سريع لكافة محافظات مصر.",
  },
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
            <div className="w-full aspect-3/4 bg-[#F0EEEA] mb-3" />
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

  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "الرئيسية", url: "/" },
    { name: "تسوق تيشرتات وملابس ليفارو", url: "/shop" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* 1. Mandatory Functional Preloader */}
      <Preloader
        images={criticalImages}
        title="CATALOG"
        tagline="ARCHIVE CATALOG — ALL EDITIONS"
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
