import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { NewArrivalsCatalog } from "@/components/storefront/shop/NewArrivalsCatalog";
import { getStorefrontProducts } from "@/services/storefront/products";

import { SITE_URL, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "NEW ARRIVALS",
  description:
    "Discover the latest drops from LÉVARO: limited atelier releases, sculptural cuts, and heavyweight luxury cottons ready for immediate dispatch across Egypt.",
  keywords: [
    "وصل حديثا ليفارو",
    "جديد ليفارو",
    "تيشرتات ليفارو الجديدة",
    "كولكشن ليفارو الجديد",
    "ملابس ليفارو الجديدة",
    "ليفارو",
    "LÉVARO",
    "Levaro new arrivals",
    "Levaro new collection",
    "Levaro latest drops",
  ],
  alternates: {
    canonical: `${SITE_URL}/new-arrivals`,
  },
  openGraph: {
    title: "LÉVARO — NEW ARRIVALS",
    description:
      "Discover the latest drops from LÉVARO: limited atelier releases, sculptural cuts, and heavyweight luxury cottons.",
    url: `${SITE_URL}/new-arrivals`,
    siteName: "LÉVARO",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [
      {
        url: `${SITE_URL}/images/og-levaro.jpg`,
        secureUrl: `${SITE_URL}/images/og-levaro.jpg`,
        width: 1200,
        height: 630,
        alt: "LÉVARO New Arrivals",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LÉVARO — NEW ARRIVALS",
    description:
      "Discover the latest drops from LÉVARO: limited atelier releases, sculptural cuts, and heavyweight luxury cottons.",
    images: [`${SITE_URL}/images/og-levaro.jpg`],
  },
};

export const revalidate = 3600;

export default async function NewArrivalsPage() {
  const allProducts = await getStorefrontProducts();

  // Filter for products flagged as is_new or featured
  const newArrivals = allProducts.filter((p) => p.is_new === true);
  const displayProducts =
    newArrivals.length >= 4
      ? newArrivals
      : allProducts.filter((p) => p.is_new || p.is_featured).slice(0, 9);

  // Critical images for Preloader GPU decode
  const criticalImages = [
    displayProducts[0]?.images[0] || "",
    displayProducts[1]?.images[0] || "",
  ].filter(Boolean);

  return (
    <>
      {/* 1. Functional Luxury Preloader */}
      <Preloader
        images={criticalImages}
        title="NEW ARRIVALS"
        tagline="LATEST EDITIONS • AUTUMN WINTER 2026"
      />

      {/* 2. Trailing Luxury Cursor */}
      <LuxuryCursor />

      {/* 3. Smooth Scroll Architecture */}
      <SmoothScroll>
        <main className="min-h-screen bg-off-white text-near-black flex flex-col justify-between">
          <Header theme="light" />

          {/* Page Body */}
          <div className="w-full site-padding-x pt-28 sm:pt-36 pb-20 sm:pb-28 flex-1">
            <div className="site-container flex flex-col gap-10 sm:gap-14">
              
              {/* Editorial Page Header */}
              <div className="flex flex-col gap-4 border-b border-near-black/15 pb-8">
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
                  <Link href="/" className="hover:text-near-black transition-colors">
                    HOME
                  </Link>
                  <span>/</span>
                  <span className="text-near-black font-semibold">NEW ARRIVALS</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight leading-none text-near-black">
                      NEW ARRIVALS
                    </h1>
                    <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.16em] text-brand-gray max-w-xl leading-relaxed">
                      Recent atelier releases, contemporary silhouettes, and newly crafted fabrications.
                    </p>
                  </div>

                  <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.22em] text-brand-gray shrink-0">
                    SEASON 2026 &bull; CURRENT RELEASES
                  </span>
                </div>
              </div>

              {/* Interactive Catalog Component */}
              <NewArrivalsCatalog products={displayProducts} />
            </div>
          </div>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
