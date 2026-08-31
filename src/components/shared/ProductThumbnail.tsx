import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductThumbnailProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Reusable Product Thumbnail component with automatic fallback placeholder
 * and Next.js Image compression.
 */
export function ProductThumbnail({
  src,
  alt,
  className,
  imageClassName,
  sizes = "64px",
  priority = false,
}: ProductThumbnailProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-black/5 bg-zinc-100",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-300">
          <Package className="size-1/2" />
        </div>
      )}
    </div>
  );
}

export default ProductThumbnail;
