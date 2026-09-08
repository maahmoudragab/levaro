"use client";

import { Grid2X2, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "table" | "grid";

interface ProductViewSwitcherProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/**
 * Apple HIG Segmented Control for switching between Table and Grid catalog layouts.
 */
export function ProductViewSwitcher({
  viewMode,
  onChange,
}: ProductViewSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-zinc-100/90 p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-label="Table view"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-200 active:scale-[0.97]",
          viewMode === "table"
            ? "bg-primary text-white font-semibold shadow-xs"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50",
        )}
      >
        <Table2
          className={cn(
            "size-3.5 transition-colors",
            viewMode === "table" ? "text-white" : "text-zinc-400",
          )}
        />
        <span className="hidden sm:inline">Table</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-200 active:scale-[0.97]",
          viewMode === "grid"
            ? "bg-primary text-white font-semibold shadow-xs"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50",
        )}
      >
        <Grid2X2
          className={cn(
            "size-3.5 transition-colors",
            viewMode === "grid" ? "text-white" : "text-zinc-400",
          )}
        />
        <span className="hidden sm:inline">Grid</span>
      </button>
    </div>
  );
}

export default ProductViewSwitcher;
