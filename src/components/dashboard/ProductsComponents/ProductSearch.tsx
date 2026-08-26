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
export default function ProductSearch({
  search,
  onSearchChange,
  onClear,
}: ProductSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by Name, SKU, ID..."
        className="h-10 rounded-xl border-[#e6e4e1] bg-white pl-10 pr-10 text-sm focus-visible:border-primary focus-visible:ring-0"
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-black"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
