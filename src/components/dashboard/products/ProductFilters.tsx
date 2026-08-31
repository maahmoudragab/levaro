import { useMemo } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDERS,
  BRANDS,
  PRODUCT_TYPES,
  FITS,
  COLORS,
  MATERIALS,
  type CategoryOption,
  type ProductFilterState,
} from "@/components/dashboard/products/product-utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ProductFiltersProps = {
  showFilters: boolean;
  filters: ProductFilterState;
  categoriesList?: CategoryOption[];
  onChange: <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => void;
  onReset: () => void;
};

/* -------------------------------------------------------------------------- */
/* Main Component: Advanced Fashion Filters                                   */
/* -------------------------------------------------------------------------- */

export function ProductFilters({
  showFilters,
  filters,
  categoriesList = [],
  onChange,
  onReset,
}: ProductFiltersProps) {
  // Extract Parent Categories (parent_id == null)
  const parentCategories = useMemo(() => {
    return categoriesList.filter((c) => !c.parent_id);
  }, [categoriesList]);

  // Extract Child Collections matching the currently selected category
  const availableCollections = useMemo(() => {
    if (!filters.category || filters.category === "All Categories") {
      return categoriesList.filter((c) => Boolean(c.parent_id));
    }

    const selectedParent = categoriesList.find(
      (c) =>
        !c.parent_id &&
        (c.name.toLowerCase() === filters.category.toLowerCase() ||
          c.slug?.toLowerCase() === filters.category.toLowerCase() ||
          c.id === filters.category),
    );

    if (!selectedParent) {
      return categoriesList.filter((c) => Boolean(c.parent_id));
    }

    return categoriesList.filter((c) => c.parent_id === selectedParent.id);
  }, [categoriesList, filters.category]);

  if (!showFilters) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4 font-sans mt-2 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
            Advanced Catalog Filters
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 rounded-xl text-xs font-semibold text-zinc-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <RotateCcw className="size-3 mr-1.5" />
          Reset All Filters
        </Button>
      </div>

      {/* Filter Fields Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Main Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Main Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(val) => {
              onChange("category", val);
              onChange("collection", "All Collections");
            }}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories" className="text-xs font-medium">
                All Categories
              </SelectItem>
              {parentCategories.map((c) => (
                <SelectItem key={c.id} value={c.name} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Collection / Line */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Collection / Line
          </Label>
          <Select
            value={filters.collection}
            onValueChange={(val) => onChange("collection", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Collections" className="text-xs font-medium">
                All Collections
              </SelectItem>
              {availableCollections.map((col) => (
                <SelectItem key={col.id} value={col.name} className="text-xs">
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Target Gender */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Target Gender
          </Label>
          <Select
            value={filters.gender}
            onValueChange={(val) => onChange("gender", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Genders" className="text-xs font-medium">
                All Genders
              </SelectItem>
              {GENDERS.map((g) => (
                <SelectItem key={g} value={g} className="text-xs">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Product Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Product Type
          </Label>
          <Select
            value={filters.product_type}
            onValueChange={(val) => onChange("product_type", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types" className="text-xs font-medium">
                All Types
              </SelectItem>
              {PRODUCT_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Fit Style */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">Fit Style</Label>
          <Select
            value={filters.fit}
            onValueChange={(val) => onChange("fit", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Fits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Fits" className="text-xs font-medium">
                All Fits
              </SelectItem>
              {FITS.map((f) => (
                <SelectItem key={f} value={f} className="text-xs">
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 6. Primary Color */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">Color</Label>
          <Select
            value={filters.color}
            onValueChange={(val) => onChange("color", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <div className="flex items-center gap-2 truncate">
                {filters.color && filters.color !== "All Colors" && (
                  <span
                    className="size-2.5 rounded-full border border-black/10 shrink-0"
                    style={{
                      backgroundColor:
                        COLORS.find((c) => c.name === filters.color)?.hex ||
                        "#000",
                    }}
                  />
                )}
                <SelectValue placeholder="All Colors" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="All Colors" className="text-xs font-medium">
                All Colors
              </SelectItem>
              {COLORS.map((c) => (
                <SelectItem key={c.name} value={c.name} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 7. Fabric / Material */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Fabric / Material
          </Label>
          <Select
            value={filters.material}
            onValueChange={(val) => onChange("material", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Materials" className="text-xs font-medium">
                All Materials
              </SelectItem>
              {MATERIALS.map((m) => (
                <SelectItem key={m} value={m} className="text-xs">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 8. Brand */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">Brand</Label>
          <Select
            value={filters.brand}
            onValueChange={(val) => onChange("brand", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Brands" className="text-xs font-medium">
                All Brands
              </SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b} className="text-xs">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 9. Stock Availability */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Stock Status
          </Label>
          <Select
            value={filters.stockStatus}
            onValueChange={(val) => onChange("stockStatus", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Stock" className="text-xs">All Stock</SelectItem>
              <SelectItem value="In Stock" className="text-xs">In Stock (&gt;10 units)</SelectItem>
              <SelectItem value="Low Stock" className="text-xs">Low Stock (1–10 units)</SelectItem>
              <SelectItem value="Out of Stock" className="text-xs">Out of Stock (0 units)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 10. Visibility / Active Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700">
            Visibility Status
          </Label>
          <Select
            value={filters.activeFilter}
            onValueChange={(val) => onChange("activeFilter", val)}
          >
            <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All Items</SelectItem>
              <SelectItem value="Active" className="text-xs">Active (Live in store)</SelectItem>
              <SelectItem value="Inactive" className="text-xs">Draft / Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 11. Price Range */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold text-zinc-700">
            Price Range (EGP)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => onChange("minPrice", e.target.value)}
              className="h-9 rounded-xl bg-[#fbfbfb] text-xs"
            />
            <span className="text-xs text-zinc-400 font-medium">—</span>
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => onChange("maxPrice", e.target.value)}
              className="h-9 rounded-xl bg-[#fbfbfb] text-xs"
            />
          </div>
        </div>
      </div>

      {/* Toggle Quick Checkboxes */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-black/5 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch
            checked={filters.saleOnly}
            onCheckedChange={(v) => onChange("saleOnly", v)}
          />
          <span className="font-semibold text-zinc-700">Sale / Discounted Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch
            checked={filters.featuredFilter === "Featured"}
            onCheckedChange={(v) => onChange("featuredFilter", v ? "Featured" : "All")}
          />
          <span className="font-semibold text-zinc-700">Featured Collections Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch
            checked={filters.newFilter === "New"}
            onCheckedChange={(v) => onChange("newFilter", v ? "New" : "All")}
          />
          <span className="font-semibold text-zinc-700">New Arrivals Only</span>
        </label>
      </div>
    </div>
  );
}

export function ProductFiltersButton({
  showFilters,
  onToggleFilters,
  activeCount = 0,
}: {
  showFilters: boolean;
  onToggleFilters: () => void;
  activeCount?: number;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggleFilters}
      className={`h-9.5 px-3 sm:px-4 rounded-xl border-zinc-200/90 text-xs font-semibold shadow-2xs transition-all ${
        showFilters || activeCount > 0
          ? "bg-primary text-white hover:bg-primary/90 border-primary shadow-xs"
          : "bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
      aria-label="Toggle Advanced Filters"
    >
      <SlidersHorizontal className="size-3.5 sm:mr-1.5" />
      <span className="hidden sm:inline">Advanced Filters</span>
      {activeCount > 0 && (
        <span className="ml-1.5 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
          {activeCount}
        </span>
      )}
    </Button>
  );
}

export default ProductFilters;
