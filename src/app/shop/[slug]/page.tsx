import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { ProductDetailClient } from "@/components/storefront/product/ProductDetailClient";
import {
  getStorefrontProductBySlug,
  getStorefrontProductSlugs,
  getStorefrontProducts,
} from "@/app/services/storefront/products";
import { SHOP_PRODUCTS } from "@/data/storefront";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-render static pages for active edition slugs
export async function generateStaticParams() {
  return await getStorefrontProductSlugs();
}

// Revalidate individual piece page every 1 hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "PIECE NOT FOUND — LÉVARO",
    };
  }

  return {
    title: `${product.name} (${product.code}) — LÉVARO`,
    description: `${product.material}. ${product.description}`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Find related products efficiently from cached products list without extra DB hit
  const allProducts = await getStorefrontProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.department === product.department))
    .slice(0, 3);


  return (
    <>
      {/* 1. Mandatory Functional Preloader for Storefront */}
      <Preloader
        images={product.images}
        title={product.name}
        tagline={`${product.code} // ATELIER EDITION`}
      />

      {/* 2. Custom Inverted Luxury Cursor */}
      <LuxuryCursor />

      {/* 3. Smooth Scroll Architecture */}
      <SmoothScroll>
        <main className="min-h-screen bg-[#FBF9F6] text-near-black flex flex-col justify-between">
          <Header theme="light" />
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
