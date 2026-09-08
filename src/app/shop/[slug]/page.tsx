import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";
import { ProductDetailClient } from "@/components/storefront/product/ProductDetailClient";
import { CategoryShowcase } from "@/components/storefront/shop/CategoryShowcase";
import {
  getStorefrontProductBySlug,
  getStorefrontProductSlugs,
  getStorefrontProducts,
  getRelatedProductsByTags,
} from "@/services/storefront/products";
import {
  getStorefrontCategoryBySlug,
  getStorefrontCategorySlugs,
  getStorefrontCategories,
  filterProductsByCategory,
} from "@/services/storefront/categories";
import {
  generateProductSeoMetadata,
  generateProductJsonLd,
  generateCategorySeoMetadata,
  generateCategoryJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";

interface ShopSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-render static pages for all active products and category disciplines
export async function generateStaticParams() {
  const [productSlugs, categorySlugs] = await Promise.all([
    getStorefrontProductSlugs(),
    getStorefrontCategorySlugs(),
  ]);

  const set = new Set<string>();
  const params: { slug: string }[] = [];

  for (const item of productSlugs) {
    if (item.slug && !set.has(item.slug)) {
      set.add(item.slug);
      params.push({ slug: item.slug });
    }
  }

  for (const cat of categorySlugs) {
    if (cat.slug && !set.has(cat.slug)) {
      set.add(cat.slug);
      params.push({ slug: cat.slug });
    }
  }

  return params;
}

// Revalidate individual pages every 1 hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata({ params }: ShopSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check Product first
  const product = await getStorefrontProductBySlug(slug);
  if (product) {
    return generateProductSeoMetadata(product);
  }

  // 2. Check Category second
  const category = await getStorefrontCategoryBySlug(slug);
  if (category) {
    return generateCategorySeoMetadata(category);
  }

  return {
    title: "NOT FOUND — LÉVARO",
    robots: { index: false, follow: false },
  };
}

export default async function ShopSlugPage({ params }: ShopSlugPageProps) {
  const { slug } = await params;

  // 1. Check if the URL matches an individual product edition
  const product = await getStorefrontProductBySlug(slug);

  if (product) {
    const allProducts = await getStorefrontProducts();
    const relatedProducts = getRelatedProductsByTags(product, allProducts, 3);
    const productJsonLd = generateProductJsonLd(product);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: "الرئيسية", url: "/" },
      { name: "تسوق تيشرتات وملابس ليفارو", url: "/shop" },
      {
        name: product.category_name || product.category,
        url: `/shop?category=${encodeURIComponent(product.category_slug || product.category)}`,
      },
      { name: product.name, url: `/shop/${product.slug}` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <Preloader
          images={product.images}
          title={product.name}
          tagline={`${product.code} — ATELIER EDITION`}
        />
        <LuxuryCursor />
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

  // 2. Check if the URL matches a dedicated category / discipline
  const category = await getStorefrontCategoryBySlug(slug);

  if (category) {
    const [allProducts, allCategories] = await Promise.all([
      getStorefrontProducts(),
      getStorefrontCategories(),
    ]);
    const categoryProducts = filterProductsByCategory(allProducts, category);
    const categoryJsonLd = generateCategoryJsonLd(category, categoryProducts);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: "الرئيسية", url: "/" },
      { name: "المتجر", url: "/shop" },
      { name: category.name, url: `/shop/${category.slug}` },
    ]);

    const previewImages = categoryProducts
      .slice(0, 3)
      .flatMap((p) => p.images)
      .concat(category.image ? [category.image] : [])
      .filter(Boolean);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <Preloader
          images={previewImages}
          title={category.name.toUpperCase()}
          tagline="ATELIER DISCIPLINE // LEVARO"
        />
        <LuxuryCursor />
        <SmoothScroll>
          <main className="min-h-screen bg-[#FBF9F6] text-near-black flex flex-col justify-between">
            <Header theme="light" />
            <CategoryShowcase
              category={category}
              products={categoryProducts}
              otherCategories={allCategories}
            />
            <Footer />
          </main>
        </SmoothScroll>
      </>
    );
  }

  // 3. If neither product nor category exists
  notFound();
}

