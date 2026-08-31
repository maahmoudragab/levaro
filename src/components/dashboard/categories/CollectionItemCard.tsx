import Link from "next/link";
import { Pencil, Trash2, Layers, ArrowUpRight, Calendar, Package } from "lucide-react";
import type { CategoryItem } from "@/app/services/admin/categories";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/components/dashboard/products/product-utils";

import { toast } from "@/lib/toast";

interface CollectionItemCardProps {
  collection: CategoryItem;
  parentName?: string;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onEdit: (collection: CategoryItem) => void;
  onDelete: (collection: CategoryItem) => void;
  disabled?: boolean;
}

/**
 * Rich card representation of a Collection (Subcategory) nested under a parent category.
 */
export function CollectionItemCard({
  collection,
  parentName,
  onToggleActive,
  onEdit,
  onDelete,
  disabled = false,
}: CollectionItemCardProps) {
  const productsUrl = `/admin/products?${parentName ? `category=${encodeURIComponent(parentName)}&` : ""}collection=${encodeURIComponent(collection.name)}`;
  const productCount = collection.product_count ?? 0;
  const isEmpty = productCount === 0;

  const handleToggle = (checked: boolean) => {
    if (checked && isEmpty) {
      toast.error(
        "Cannot Activate Collection",
        `"${collection.name}" has 0 products. Assign at least one product before activating.`,
      );
      return;
    }
    onToggleActive(collection.id, checked);
  };

  return (
    <div
      className={cn(
        "group flex flex-col justify-between gap-3 rounded-2xl border p-3.5 sm:p-4 transition-all bg-white shadow-2xs hover:shadow-xs",
        collection.is_active
          ? "border-zinc-200 hover:border-primary/40"
          : "border-zinc-200/60 bg-zinc-50/60 opacity-80",
      )}
    >
      {/* 1. Header & Quick Controls */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl border",
              collection.is_active
                ? "bg-primary/5 text-primary border-primary/20"
                : "bg-zinc-100 text-zinc-400 border-zinc-200",
            )}
          >
            <Layers className="size-4" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <h4 className="truncate text-xs sm:text-sm font-bold text-zinc-900">
              {collection.name}
            </h4>
            <p className="truncate text-[11px] text-zinc-400 font-mono">
              /{collection.slug}
            </p>
          </div>
        </div>

        {/* Action Controls & Active Switch */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Switch
            checked={collection.is_active}
            disabled={disabled}
            onCheckedChange={handleToggle}
            aria-label={`Toggle active for ${collection.name}`}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(collection)}
            className="size-7 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            title="Edit Collection"
          >
            <Pencil className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(collection)}
            className="size-7 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            title="Delete Collection"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Metadata & Stats Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100 text-xs">
        {isEmpty ? (
          <Badge
            variant="inactive"
            className="text-[10px] h-5 px-2 bg-amber-50 text-amber-700 border-amber-200 font-medium"
          >
            Empty (0 Products)
          </Badge>
        ) : (
          <Badge
            variant={collection.is_active ? "active" : "inactive"}
            className="text-[10px] h-5 px-2"
          >
            {collection.is_active ? "Active" : "Hidden"}
          </Badge>
        )}

        <div className="flex items-center gap-1 text-zinc-600 font-medium">
          <Package className="size-3 text-zinc-400" />
          <span className="tabular-nums">{productCount} Products</span>
        </div>

        {collection.created_at && (
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 ml-auto">
            <Calendar className="size-3" />
            <span>{formatRelativeDate(collection.created_at)}</span>
          </div>
        )}
      </div>

      {/* 3. Direct Link to Filtered Products */}
      <Link
        href={productsUrl}
        className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link"
      >
        <span>View Collection Products</span>
        <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      </Link>
    </div>
  );
}

export default CollectionItemCard;
