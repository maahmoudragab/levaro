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

  const hasDiscount = Boolean(
    product.sale_price &&
    product.sale_price > 0 &&
    product.sale_price < product.price
  );

  const formatPrice = (amount: number) => `EGP ${amount.toLocaleString("en-US")}`;
  const originalPriceFormatted = product.priceFormatted || formatPrice(product.price);
  const salePriceFormatted =
    product.salePriceFormatted ||
    (product.sale_price ? formatPrice(product.sale_price) : null);

  const displayFit = product.fit || product.silhouette || "REGULAR FIT";

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* 1. EDITORIAL IMAGE CONTAINER (Explicit aspect-[3/4] prevents CLS) */}
      <Link
        href={productHref}
        className={`relative w-full aspect-[3/4] overflow-hidden transition-colors duration-500 mb-3 block cursor-pointer ${
          isLight ? "bg-[#F0EEEA]" : "bg-charcoal"
        }`}
        aria-label={`View ${product.name}`}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top brightness-[0.98] group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-700 ease-signature"
          />
        </div>
      </Link>

      {/* 2. PRODUCT METADATA */}
      <div className="flex flex-col gap-2 pt-2.5">
        {/* Full Name: takes its own row (1 or 2 lines depending on length) */}
        <Link href={productHref} className="block group/title">
          <h3
            className={`text-xs sm:text-[13px] font-sans tracking-[0.14em] uppercase transition-opacity duration-200 hover:opacity-70 line-clamp-2 leading-relaxed ${
              isLight ? "text-near-black font-medium" : "text-off-white font-medium"
            }`}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price & Fit Row: Price moved down below the name */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1 border-t border-near-black/5">
          {/* Price before and after discount */}
          <div className="flex items-baseline gap-1.5 font-mono text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.12em] shrink-0">
            {hasDiscount ? (
              <>
                <span
                  className={
                    isLight
                      ? "text-near-black font-medium"
                      : "text-off-white font-medium"
                  }
                >
                  {salePriceFormatted}
                </span>
                <span className="text-[10px] sm:text-[11px] text-brand-gray line-through opacity-75">
                  {originalPriceFormatted}
                </span>
              </>
            ) : (
              <span className={isLight ? "text-near-black font-medium" : "text-off-white font-medium"}>
                {originalPriceFormatted}
              </span>
            )}
          </div>

          {/* Fit */}
          <span
            className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.14em] sm:tracking-[0.16em] text-brand-gray truncate text-right max-w-[50%]"
            title={displayFit}
          >
            {displayFit}
          </span>
        </div>
      </div>
    </div>
  );
}
