
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

type ProductSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
};

export default function ProductSearch({
  search,
  onSearchChange,
  onClear,
}: ProductSearchProps) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="relative flex-1">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Name, SKU, ID..."
          className="w-full rounded-xl border border-[#e6e4e1] bg-white py-2 pl-10 pr-9 text-sm outline-none focus:border-primary transition"
        />

        {search && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <HiXMark />
          </button>
        )}
      </div>
    </div>
  );
}
