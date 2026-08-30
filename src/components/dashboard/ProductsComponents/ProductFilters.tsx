import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFilterState } from "@/components/dashboard/ProductsComponents/product-utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type FilterOptions = {
  categories: string[];
  colors: string[];
  genders: string[];
  brands: string[];
  fits: string[];
};

type ProductFiltersProps = {
  showFilters: boolean;
  filters: ProductFilterState;
  options: FilterOptions;
  onChange: <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K],
  ) => void;
  onReset: () => void;
};

/* -------------------------------------------------------------------------- */
/* Sub-Component: Filter Select Dropdown                                      */
/* -------------------------------------------------------------------------- */

/**
 * Reusable select filter input for category, gender, color, brand, etc.
 * Handles Radix Select placeholder values cleanly.
 */
function FilterSelect<K extends keyof ProductFilterState>({
  label,
  filterKey,
  value,
  options,
  onChange,
  allLabel = "All",
}: {
  label: string;
  filterKey: K;
  value: ProductFilterState[K];
  options: string[];
  onChange: <T extends keyof ProductFilterState>(
    key: T,
    value: ProductFilterState[T],
  ) => void;
  allLabel?: string;
}) {
  // Radix UI Select does not permit empty string values; map to internal placeholder key
  const ALL_VALUE = "__all__";
  const isAllSelected =
    typeof value === "string" && (value === "" || value === allLabel);
  const selectValue = isAllSelected ? ALL_VALUE : String(value);

  const safeOptions = Array.from(
    new Set(
      (options ?? []).filter(
        (option): option is string =>
          typeof option === "string" &&
          option.trim().length > 0 &&
          option !== allLabel,
      ),
    ),
  );

  const handleChange = (nextValue: string) => {
    if (nextValue === ALL_VALUE) {
      onChange(filterKey, allLabel as ProductFilterState[K]);
      return;
    }

    onChange(filterKey, nextValue as ProductFilterState[K]);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </Label>

      <Select value={selectValue} onValueChange={handleChange}>
        <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/90 bg-white px-3 text-xs sm:text-sm text-zinc-800 shadow-2xs transition-all hover:border-zinc-300 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          position="popper"
          align="start"
          className="z-100 min-w-(--radix-select-trigger-width) rounded-xl border-zinc-200 shadow-md"
        >
          <SelectItem value={ALL_VALUE} className="text-xs sm:text-sm">
            {allLabel}
          </SelectItem>

          {safeOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-xs sm:text-sm">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-Component: Filter Toggle Button                                        */
/* -------------------------------------------------------------------------- */

/**
 * Toggle button to expand or collapse the advanced filter panel.
 */
export function ProductFiltersButton({
  showFilters,
  onToggleFilters,
}: {
  showFilters: boolean;
  onToggleFilters: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggleFilters}
      className={`h-10 shrink-0 gap-2 rounded-xl border-zinc-200/90 bg-white px-3.5 text-xs sm:text-sm font-medium text-zinc-800 shadow-2xs transition-all hover:bg-zinc-50 ${
        showFilters ? "bg-zinc-100/80 border-zinc-300" : ""
      }`}
    >
      <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
      <span className="hidden sm:inline">Advanced Filters</span>
      <ChevronDown
        className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
          showFilters ? "rotate-180 text-zinc-700" : ""
        }`}
      />
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component: Product Filters Panel                                      */
/* -------------------------------------------------------------------------- */

/**
 * Expandable filter drawer containing multi-attribute selects, price sliders, and sale filters.
 */
export default function ProductFilters({
  showFilters,
  filters,
  options,
  onChange,
  onReset,
}: ProductFiltersProps) {
  if (!showFilters) {
    return null;
  }

  return (
    <div className="space-y-3 p-2">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Attribute Dropdown Filters Grid                                   */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FilterSelect
          label="Category"
          filterKey="category"
          value={filters.category}
          options={options.categories}
          allLabel="All Categories"
          onChange={onChange}
        />

        <FilterSelect
          label="Color"
          filterKey="color"
          value={filters.color}
          options={options.colors}
          allLabel="All Colors"
          onChange={onChange}
        />

        <FilterSelect
          label="Gender"
          filterKey="gender"
          value={filters.gender}
          options={options.genders}
          allLabel="All Genders"
          onChange={onChange}
        />

        <FilterSelect
          label="Brand"
          filterKey="brand"
          value={filters.brand}
          options={options.brands}
          allLabel="All Brands"
          onChange={onChange}
        />

        <FilterSelect
          label="Fit"
          filterKey="fit"
          value={filters.fit}
          options={options.fits}
          allLabel="All Fits"
          onChange={onChange}
        />

        <FilterSelect
          label="Stock Availability"
          filterKey="stockStatus"
          value={filters.stockStatus}
          options={["In Stock", "Low Stock", "Out of Stock"]}
          allLabel="All Stock"
          onChange={onChange}
        />

        <FilterSelect
          label="Active Status"
          filterKey="activeFilter"
          value={filters.activeFilter}
          options={["Active", "Inactive"]}
          allLabel="All"
          onChange={onChange}
        />

        <FilterSelect
          label="Featured"
          filterKey="featuredFilter"
          value={filters.featuredFilter}
          options={["Featured", "Non-Featured"]}
          allLabel="All"
          onChange={onChange}
        />

        <FilterSelect
          label="New Arrival"
          filterKey="newFilter"
          value={filters.newFilter}
          options={["New", "Regular"]}
          allLabel="All"
          onChange={onChange}
        />

        <FilterSelect
          label="Sort By"
          filterKey="sort"
          value={filters.sort}
          options={["newest", "name", "price-low", "price-high"]}
          allLabel="Newest"
          onChange={onChange}
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. Price Range & Quick Reset Row                                     */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 border-t border-zinc-200/80 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Min/Max Price Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Price Range:
          </Label>

          <Input
            type="number"
            min="0"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(event) => onChange("minPrice", event.target.value)}
            className="h-9 w-24 rounded-xl border-zinc-200/90 bg-white px-2.5 text-xs sm:text-sm font-medium tabular-nums shadow-2xs transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
          />

          <span className="text-xs text-zinc-400">to</span>

          <Input
            type="number"
            min="0"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(event) => onChange("maxPrice", event.target.value)}
            className="h-9 w-24 rounded-xl border-zinc-200/90 bg-white px-2.5 text-xs sm:text-sm font-medium tabular-nums shadow-2xs transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        {/* Sale Checkbox & Reset Trigger */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sale-only"
              checked={filters.saleOnly}
              onCheckedChange={(checked) => onChange("saleOnly", checked === true)}
              className="h-4 w-4 rounded-md border-zinc-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="sale-only"
              className="cursor-pointer text-xs sm:text-sm font-medium text-zinc-700 select-none"
            >
              On Sale Only
            </Label>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2.5 text-xs font-medium text-rose-600 rounded-lg transition-colors hover:bg-rose-50 hover:text-rose-700"
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </div>
  );
}