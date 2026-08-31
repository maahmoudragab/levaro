"use client";

import type { CategoryItem } from "@/app/services/admin/categories";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteCategoryDialogProps {
  item: CategoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Safe delete dialog for categories and collections.
 */
export function DeleteCategoryDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteCategoryDialogProps) {
  if (!item) return null;

  const isParent = !item.parent_id;
  const productCount = item.product_count ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-black/10 p-5 sm:p-6 shadow-xl max-w-md">
        <AlertDialogHeader className="space-y-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-base sm:text-lg font-bold text-zinc-900 font-sans">
            Delete {isParent ? "Category" : "Collection"} &quot;{item.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-500 leading-relaxed">
            This will permanently remove this {isParent ? "category" : "collection"} from your catalog.
            {productCount > 0 && (
              <span className="block mt-2 font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Notice: {productCount} product(s) currently linked will become uncategorized.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="h-9 rounded-xl border-zinc-200 text-xs font-medium text-zinc-700"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-9 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : null}
            Yes, Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCategoryDialog;
