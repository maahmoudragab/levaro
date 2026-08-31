import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
};

/**
 * Product search input bar with quick clear trigger.
 */
export function ProductSearch({
  search,
  onSearchChange,
  onClear,
}: ProductSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name, SKU, or category..."
        className="h-10 rounded-xl border-zinc-200/90 bg-white pl-10 pr-10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export default ProductSearch;
