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
/* Filter select                                                              */
/* -------------------------------------------------------------------------- */

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
  /*
   * Radix Select does not allow an empty string as a SelectItem value.
   *
   * The actual filter state still uses the existing "All..." values.
   * "__all__" exists only inside the Select component.
   */
  const ALL_VALUE = "__all__";

  const isAllSelected =
    typeof value === "string" &&
    (value === "" || value === allLabel);

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
      onChange(
        filterKey,
        allLabel as ProductFilterState[K],
      );

      return;
    }

    onChange(
      filterKey,
      nextValue as ProductFilterState[K],
    );
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {/* Filter label */}
      <Label className="text-[10px] font-bold uppercase text-[#6b7280]">
        {label}
      </Label>

      {/* Filter select */}
      <Select
        value={selectValue}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className="
            h-9
            w-full
            rounded-xl
            border-[#e6e4e1]
            bg-white
            px-3
            text-xs
            text-[#1f2937]
            shadow-none
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          position="popper"
          align="start"
          className="z-100 min-w-(--radix-select-trigger-width)"
        >
          {/* All option */}
          <SelectItem
            value={ALL_VALUE}
            className="text-xs"
          >
            {allLabel}
          </SelectItem>

          {/* Dynamic options */}
          {safeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-xs"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Advanced filters button                                                    */
/* -------------------------------------------------------------------------- */

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
      className={`
        h-10
        shrink-0
        rounded-xl
        border-[#e6e4e1]
        bg-white
        px-3
        text-xs
        font-semibold
        text-[#1f2937]
        shadow-none
        hover:bg-gray-50
        ${
          showFilters
            ? "bg-[#f7f8f9]"
            : ""
        }
      `}
    >
      <SlidersHorizontal className="h-4 w-4" />

      <span className="hidden sm:inline">
        Advanced Filters
      </span>

      <ChevronDown
        className={`
          h-4 w-4
          transition-transform
          duration-200
          ${showFilters ? "rotate-180" : ""}
        `}
      />
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Main filters                                                               */
/* -------------------------------------------------------------------------- */

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
      {/* Select filters                                                       */}
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
          options={[
            "In Stock",
            "Low Stock",
            "Out of Stock",
          ]}
          allLabel="All Stock"
          onChange={onChange}
        />

        <FilterSelect
          label="Active Status"
          filterKey="activeFilter"
          value={filters.activeFilter}
          options={[
            "Active",
            "Inactive",
          ]}
          allLabel="All"
          onChange={onChange}
        />

        <FilterSelect
          label="Featured"
          filterKey="featuredFilter"
          value={filters.featuredFilter}
          options={[
            "Featured",
            "Non-Featured",
          ]}
          allLabel="All"
          onChange={onChange}
        />

        <FilterSelect
          label="New Arrival"
          filterKey="newFilter"
          value={filters.newFilter}
          options={[
            "New",
            "Regular",
          ]}
          allLabel="All"
          onChange={onChange}
        />

        {/* Sort is intentionally not "All".
            Its default value is "newest". */}
        <FilterSelect
          label="Sort By"
          filterKey="sort"
          value={filters.sort}
          options={[
            "newest",
            "name",
            "price-low",
            "price-high",
          ]}
          allLabel="Newest"
          onChange={onChange}
        />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Price range + sale                                                   */}
      {/* -------------------------------------------------------------------- */}

      <div className="flex flex-col gap-3 border-t border-[#e6e4e1]/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Price range */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-[10px] font-bold uppercase text-gray-500">
            Price Range:
          </Label>

          <Input
            type="number"
            min="0"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(event) =>
              onChange(
                "minPrice",
                event.target.value,
              )
            }
            className="
              h-8
              w-20
              rounded-lg
              border-[#e6e4e1]
              bg-white
              px-2
              text-xs
              font-semibold
              shadow-none
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
          />

          <span className="text-xs text-gray-400">
            to
          </span>

          <Input
            type="number"
            min="0"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(event) =>
              onChange(
                "maxPrice",
                event.target.value,
              )
            }
            className="
              h-8
              w-20
              rounded-lg
              border-[#e6e4e1]
              bg-white
              px-2
              text-xs
              font-semibold
              shadow-none
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
          />
        </div>

        {/* Sale + reset */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="sale-only"
              checked={filters.saleOnly}
              onCheckedChange={(checked) =>
                onChange(
                  "saleOnly",
                  checked === true,
                )
              }
              className="h-4 w-4 rounded-lg"
            />

            <Label
              htmlFor="sale-only"
              className="cursor-pointer text-xs font-semibold"
            >
              On Sale Only
            </Label>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="
              h-auto
              px-0
              text-xs
              font-semibold
              text-[#b12d2d]
              shadow-none
              hover:bg-transparent
              hover:text-[#b12d2d]
              hover:underline
            "
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </div>
  );
}