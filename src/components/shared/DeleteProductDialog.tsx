"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Product } from "@/services/admin/products";

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Reusable modal alert dialog for confirming permanent product deletions.
 */
export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteProductDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isLoading) {
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent className="rounded-2xl border-zinc-200 p-5 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-zinc-900">
            Delete product?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-zinc-500">
            {product
              ? `This will permanently delete "${product.name}" and its product images from the catalog.`
              : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="h-9 rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
            className="h-9 rounded-xl bg-rose-600 text-xs font-medium text-white shadow-xs hover:bg-rose-700"
          >
            {isLoading ? "Deleting..." : "Delete product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProductDialog;
