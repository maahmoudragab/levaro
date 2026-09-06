"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductItem } from "@/types/storefront";

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
  theme?: "dark" | "light";
}

export function ProductCard({
  product,
  priority = false,
  theme = "light",
}: ProductCardProps) {
  const primaryImage = product.images[0] || "/placeholder.jpg";
  const productHref = `/shop/${product.slug}`;
  const isLight = theme === "light";

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* 1. EDITORIAL IMAGE CONTAINER */}
      <Link
        href={productHref}
        className={`relative w-full aspect-3/4 overflow-hidden transition-colors duration-500 mb-3 block cursor-pointer ${
          isLight ? "bg-[#F0EEEA]" : "bg-charcoal"
        }`}
        aria-label={`View ${product.name}`}
      >
        <div className="relative w-full h-full will-change-transform overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            quality={92}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top brightness-[0.98] group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-700 ease-signature"
          />
        </div>

        {/* Minimal Subtle Edition Tag */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span
            className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-[0.2em] ${
              isLight
                ? "bg-white/90 text-near-black border border-near-black/10"
                : "bg-near-black/75 text-off-white/80 border border-off-white/10"
            }`}
          >
            {product.code}
          </span>
        </div>
      </Link>

      {/* 2. PRODUCT METADATA */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-baseline justify-between gap-3">
          <Link href={productHref} className="block group/title">
            <h3
              className={`text-xs sm:text-sm font-sans tracking-[0.14em] uppercase transition-opacity duration-200 hover:opacity-70 ${
                isLight ? "text-near-black font-medium" : "text-off-white font-medium"
              }`}
            >
              {product.name}
            </h3>
          </Link>
          <span
            className={`text-xs font-mono tracking-[0.12em] shrink-0 ${
              isLight ? "text-near-black" : "text-off-white"
            }`}
          >
            {product.priceFormatted}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-[0.18em] text-brand-gray">
          <span>{product.material}</span>
          <span className="opacity-60">{product.category_name || product.category}</span>
        </div>
      </div>
    </div>
  );
}
