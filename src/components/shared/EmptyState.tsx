import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Reusable Empty State Server Component.
 * Displayed when catalog lists or filtered results have no items.
 */
export function EmptyState({
  title = "No products found",
  description = "No items match your active filters or search query.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 px-4 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-400">
        <PackageSearch className="size-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 max-w-sm">{description}</p>
    </div>
  );
}

export default EmptyState;
