
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronDown,
} from "react-icons/hi2";

type ProductFiltersProps = {
  showFilters: boolean;
  category: string;
  setCategory: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  brand: string;
  setBrand: (value: string) => void;
  fit: string;
  setFit: (value: string) => void;
  stockStatus: string;
  setStockStatus: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  featuredFilter: string;
  setFeaturedFilter: (value: string) => void;
  newFilter: string;
  setNewFilter: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  saleOnly: boolean;
  setSaleOnly: (value: boolean) => void;

  categories: string[];
  colors: string[];
  genders: string[];
  brands: string[];
  fits: string[];

  onReset: () => void;
  onPageReset: () => void;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#6b7280] uppercase">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e6e4e1] p-2 text-xs font-bold outline-none focus:border-primary transition"
      >
        {options.map((opt) => (
          <option className="text-xs" key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ProductFiltersButton({
  showFilters,
  onToggleFilters,
}: {
  showFilters: boolean;
  onToggleFilters: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleFilters}
      className={`inline-flex items-center gap-2 rounded-xl border border-[#e6e4e1] px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
        showFilters
          ? "bg-primary text-white"
          : "bg-white text-[#1f2937] hover:bg-gray-50"
      }`}
    >
      <HiOutlineAdjustmentsHorizontal className="text-base" />

      <span className="hidden sm:inline">Advanced Filters</span>

      <HiOutlineChevronDown
        className={`transition-transform duration-200 ${
          showFilters ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export default function ProductFilters({
  showFilters,
  category,
  setCategory,
  color,
  setColor,
  gender,
  setGender,
  brand,
  setBrand,
  fit,
  setFit,
  stockStatus,
  setStockStatus,
  activeFilter,
  setActiveFilter,
  featuredFilter,
  setFeaturedFilter,
  newFilter,
  setNewFilter,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  saleOnly,
  setSaleOnly,
  categories,
  colors,
  genders,
  brands,
  fits,
  onReset,
  onPageReset,
}: ProductFiltersProps) {
  const update = (setter: (value: string) => void, value: string) => {
    setter(value);
    onPageReset();
  };

  return (
    <>
      {showFilters && (
        <div className="p-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <FilterSelect
              label="Category"
              value={category}
              onChange={(value) => update(setCategory, value)}
              options={categories}
            />

            <FilterSelect
              label="Color"
              value={color}
              onChange={(value) => update(setColor, value)}
              options={colors}
            />

            <FilterSelect
              label="Gender"
              value={gender}
              onChange={(value) => update(setGender, value)}
              options={genders}
            />

            <FilterSelect
              label="Brand"
              value={brand}
              onChange={(value) => update(setBrand, value)}
              options={brands}
            />

            <FilterSelect
              label="Fit"
              value={fit}
              onChange={(value) => update(setFit, value)}
              options={fits}
            />

            <FilterSelect
              label="Stock Availability"
              value={stockStatus}
              onChange={(value) => update(setStockStatus, value)}
              options={["All Stock", "In Stock", "Low Stock", "Out of Stock"]}
            />

            <FilterSelect
              label="Active Status"
              value={activeFilter}
              onChange={(value) => update(setActiveFilter, value)}
              options={["All", "Active", "Inactive"]}
            />

            <FilterSelect
              label="Featured"
              value={featuredFilter}
              onChange={(value) => update(setFeaturedFilter, value)}
              options={["All", "Featured", "Non-Featured"]}
            />

            <FilterSelect
              label="New Arrival"
              value={newFilter}
              onChange={(value) => update(setNewFilter, value)}
              options={["All", "New", "Regular"]}
            />

            <FilterSelect
              label="Sort By"
              value={sort}
              onChange={(value) => update(setSort, value)}
              options={["newest", "name", "price-low", "price-high"]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e6e4e1]/60">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-500 uppercase text-[10px]">
                Price Range:
              </span>

              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  onPageReset();
                }}
                className="w-20 h-8 rounded-lg border border-[#e6e4e1] bg-white px-2 text-xs font-semibold outline-none focus:border-[#1f2937]"
              />

              <span className="text-gray-400">to</span>

              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  onPageReset();
                }}
                className="w-20 h-8 rounded-lg border border-[#e6e4e1] bg-white px-2 text-xs font-semibold outline-none focus:border-[#1f2937]"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => {
                    setSaleOnly(e.target.checked);
                    onPageReset();
                  }}
                  className="rounded border-gray-300 text-[#1f2937]"
                />

                <span>On Sale Only</span>
              </label>

              <button
                type="button"
                onClick={onReset}
                className="text-xs font-semibold cursor-pointer text-[#b12d2d] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
