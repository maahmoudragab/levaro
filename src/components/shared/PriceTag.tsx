import type { Product } from "@/services/admin/products";
import { cn } from "@/lib/utils";

export interface PriceTagProps {
  product?: Partial<Pick<Product, "price" | "sale_price">> | null;
  price?: number | null;
  salePrice?: number | null;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable PriceTag Component.
 * Displays discounted sale price alongside struck-through original price when available,
 * or standard regular price otherwise.
 * Supports both `product` object or direct `price` / `salePrice` props safely.
 */
export function PriceTag({
  product,
  price: directPrice,
  salePrice: directSalePrice,
  currency = "EGP",
  className,
  size = "md",
}: PriceTagProps) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  const effectivePrice = directPrice !== undefined ? directPrice : product?.price ?? 0;
  const effectiveSalePrice =
    directSalePrice !== undefined
      ? directSalePrice
      : product?.sale_price !== undefined
        ? product?.sale_price
        : null;

  const hasSale =
    effectiveSalePrice !== null &&
    effectiveSalePrice !== undefined &&
    Number(effectiveSalePrice) > 0 &&
    Number(effectiveSalePrice) < Number(effectivePrice);

  if (hasSale) {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1.5 whitespace-nowrap tabular-nums font-sans",
          className,
        )}
      >
        <span
          className={cn(
            "font-bold text-primary",
            isSmall ? "text-xs" : isLarge ? "text-lg" : "text-sm",
          )}
        >
          {Number(effectiveSalePrice).toLocaleString()} {currency}
        </span>
        <span
          className={cn(
            "text-zinc-400 line-through font-medium",
            isSmall ? "text-[10px]" : isLarge ? "text-sm" : "text-xs",
          )}
        >
          {Number(effectivePrice).toLocaleString()} {currency}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "whitespace-nowrap font-bold text-zinc-900 tabular-nums font-sans",
        isSmall ? "text-xs" : isLarge ? "text-lg" : "text-sm",
        className,
      )}
    >
      {Number(effectivePrice).toLocaleString()} {currency}
    </span>
  );
}

export default PriceTag;
