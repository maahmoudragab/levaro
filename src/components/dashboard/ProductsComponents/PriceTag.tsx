import type { Product } from "@/app/services/admin/products";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  product: Product;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Reusable PriceTag component.
 * Displays discounted sale price alongside struck-through original price when available,
 * or standard regular price otherwise.
 */
export function PriceTag({ product, className, size = "md" }: PriceTagProps) {
  const isSmall = size === "sm";

  if (product.sale_price !== null) {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1.5 whitespace-nowrap",
          isSmall && "text-[11px]",
          className,
        )}
      >
        <span className="font-semibold text-primary">
          ${product.sale_price}
        </span>
        <span className="text-[11px] text-black/35 line-through">
          ${product.price}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "whitespace-nowrap font-semibold text-black/65",
        isSmall && "text-[11px]",
        className,
      )}
    >
      ${product.price}
    </span>
  );
}

export default PriceTag;
