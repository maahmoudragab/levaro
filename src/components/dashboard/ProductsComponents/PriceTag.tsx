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
          "inline-flex items-baseline gap-1.5 whitespace-nowrap tabular-nums",
          className,
        )}
      >
        <span
          className={cn(
            "font-semibold text-primary",
            isSmall ? "text-xs" : "text-sm",
          )}
        >
          ${product.sale_price}
        </span>
        <span
          className={cn(
            "text-zinc-400 line-through",
            isSmall ? "text-[11px]" : "text-xs",
          )}
        >
          ${product.price}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "whitespace-nowrap font-semibold text-zinc-800 tabular-nums",
        isSmall ? "text-xs" : "text-sm",
        className,
      )}
    >
      ${product.price}
    </span>
  );
}

export default PriceTag;
