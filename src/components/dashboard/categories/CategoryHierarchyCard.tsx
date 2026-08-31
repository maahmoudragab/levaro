import Link from "next/link";
import {
  Plus,
  Tags,
  Package,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Calendar,
  Layers,
  Boxes,
} from "lucide-react";
import { useState } from "react";
import type { CategoryHierarchy, CategoryItem } from "@/app/services/admin/categories";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CollectionItemCard } from "@/components/dashboard/categories/CollectionItemCard";
import { formatRelativeDate } from "@/components/dashboard/products/product-utils";

interface CategoryHierarchyCardProps {
  category: CategoryHierarchy;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onAddCollection: (parentCategory: CategoryHierarchy) => void;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory: (category: CategoryItem) => void;
  onEditCollection: (collection: CategoryItem) => void;
  onDeleteCollection: (collection: CategoryItem) => void;
  disabled?: boolean;
}

/**
 * Rich Parent Category Card with comprehensive statistics and nested collection management.
 */
export function CategoryHierarchyCard({
  category,
  onToggleActive,
  onAddCollection,
  onEditCategory,
  onDeleteCategory,
  onEditCollection,
  onDeleteCollection,
  disabled = false,
}: CategoryHierarchyCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const collections = category.collections || [];

  const categoryProductsUrl = `/admin/products?category=${encodeURIComponent(category.name)}`;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs transition-all space-y-4",
        category.is_active
          ? "border-black/10 hover:border-primary/30 hover:shadow-xs"
          : "border-zinc-200/80 bg-zinc-50/40 opacity-80",
      )}
    >
      {/* 1. Category Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              category.is_active
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-zinc-100 text-zinc-400 border border-zinc-200",
            )}
          >
            <Tags className="size-6" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base sm:text-xl font-bold text-zinc-900 font-sans tracking-tight">
                {category.name}
              </h3>
              <Badge
                variant={category.is_active ? "active" : "inactive"}
                className="h-5 px-2 text-[10px]"
              >
                {category.is_active ? "Active" : "Hidden"}
              </Badge>
            </div>
            <p className="truncate text-xs text-zinc-400 font-mono">
              slug: /{category.slug}
            </p>
          </div>
        </div>

        {/* Action Controls & Active Switch */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-black/5">
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              {category.is_active ? "Active" : "Hidden"}
            </span>
            <Switch
              checked={category.is_active}
              disabled={disabled}
              onCheckedChange={(checked) => onToggleActive(category.id, checked)}
              aria-label={`Toggle active for category ${category.name}`}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddCollection(category)}
            className="h-9 rounded-xl border-primary/30 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-all shadow-2xs"
          >
            <Plus className="size-3.5 mr-1" />
            Add Collection
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEditCategory(category)}
            className="size-9 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            title="Edit Category"
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDeleteCategory(category)}
            className="size-9 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Delete Category"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* 2. Detailed Metadata Bar: Date, Products Count, Stock, Collections, Link */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 rounded-xl bg-[#f8f9fa] border border-black/5 p-3 text-xs">
        {/* Total Products */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Package className="size-3 text-zinc-400" /> Products
          </span>
          <p className="text-sm font-bold text-zinc-900 tabular-nums">
            {category.product_count ?? 0} Items
          </p>
        </div>

        {/* Total Stock Units */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Boxes className="size-3 text-zinc-400" /> Stock Available
          </span>
          <p className="text-sm font-bold text-zinc-900 tabular-nums">
            {category.total_stock ?? 0} Units
          </p>
        </div>

        {/* Sub-Collections Count */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="size-3 text-zinc-400" /> Collections
          </span>
          <p className="text-sm font-bold text-zinc-900 tabular-nums">
            {collections.length} Lines
          </p>
        </div>

        {/* Created Date */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="size-3 text-zinc-400" /> Created Date
          </span>
          <p className="text-xs font-semibold text-zinc-700">
            {category.created_at ? formatRelativeDate(category.created_at) : "—"}
          </p>
        </div>
      </div>

      {/* 3. Category Description & Link to Filtered Products */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-0.5">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
          {category.description || "Main fashion category collection."}
        </p>

        <Link
          href={categoryProductsUrl}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all shrink-0 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <span>View Category Products</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* 4. Nested Collections Section */}
      <div className="rounded-xl border border-black/5 bg-[#fbfbfb] p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Collections & Sub-categories ({collections.length})
            </h4>
          </div>

          {collections.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <span>{isExpanded ? "Collapse" : "Expand"}</span>
              {isExpanded ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          )}
        </div>

        {collections.length > 0 ? (
          isExpanded && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {collections.map((col) => (
                <CollectionItemCard
                  key={col.id}
                  collection={col}
                  parentName={category.name}
                  onToggleActive={onToggleActive}
                  onEdit={onEditCollection}
                  onDelete={onDeleteCollection}
                  disabled={disabled}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-zinc-400 border border-dashed border-black/10 rounded-xl bg-white">
            <Package className="size-6 text-zinc-300 mb-1" />
            <p className="font-medium text-zinc-600">No sub-collections in this category</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Click &quot;Add Collection&quot; to create curated lines (e.g. Summer Essentials, Denim, Noir).
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddCollection(category)}
              className="mt-3 h-8 rounded-xl text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5"
            >
              <Plus className="size-3 mr-1" />
              Create First Collection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryHierarchyCard;
