import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import TopHeader from "@/components/dashboard/TopHeader";
import StatCard from "@/components/dashboard/StateCard";

const recentProducts = [
  {
    name: "Noir Leather Tote",
    category: "Accessories",
    price: "$850.00",
    status: "In Stock",
    statusClass: "bg-[#dff1ea] text-[#0f6b52]",
    icon: "👜",
    iconClass: "from-stone-200 via-stone-300 to-stone-100 text-stone-700",
  },
  {
    name: "Silk Geo Scarf",
    category: "Accessories",
    price: "$220.00",
    status: "Low Stock",
    statusClass: "bg-[#f8f0d7] text-[#a5671d]",
    icon: "🧣",
    iconClass: "from-orange-100 via-rose-100 to-amber-100 text-rose-700",
  },
  {
    name: "Architectural Shades",
    category: "Eyewear",
    price: "$450.00",
    status: "In Stock",
    statusClass: "bg-[#dff1ea] text-[#0f6b52]",
    icon: "🕶️",
    iconClass: "from-zinc-200 via-slate-300 to-stone-200 text-slate-700",
  },
  {
    name: "Fluidity Vase",
    category: "Home",
    price: "$180.00",
    status: "Out of Stock",
    statusClass: "bg-[#fbe8e8] text-[#b12d2d]",
    icon: "🏺",
    iconClass: "from-neutral-200 via-stone-200 to-zinc-100 text-neutral-700",
  },
];

const stockAlerts = [
  {
    name: "Essential Cotton Tee",
    quantity: "5 Remaining",
    type: "Restock",
    accent: "bg-[#f2f2f2] text-[#1f2937]",
  },
  {
    name: "Silver Minimalist Ring",
    quantity: "9 Remaining",
    type: "Restock",
    accent: "bg-[#f2f2f2] text-[#1f2937]",
  },
  {
    name: "Classic Leather Belt",
    quantity: "3 Remaining",
    type: "Restock",
    accent: "bg-[#f2f2f2] text-[#1f2937]",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Overview({ overviewStats }: { overviewStats: any }) {
  // States for the overview stats
  const stats = [
    {
      label: "Total Products",
      value: overviewStats.productsCount.toString(),
      change: `${overviewStats.productsChange}`,
    },
    {
      label: "Total Categories",
      value: overviewStats.categoriesCount.toString(),
      change: overviewStats.categoriesChange,
    },
    {
      label: "Featured Products",
      value: overviewStats.featuredCount.toString(),
      change: `${overviewStats.featuredChange}`,
    },
    {
      label: "New Products",
      value: overviewStats.newProductsCount.toString(),
      change: overviewStats.newProductsChange,
    },
  ];

  // Recent Products

  return (
    <div className="p-4 flex flex-col gap-2 pb-50">
      <TopHeader
        title="Dashboard"
        description="Welcome back, here's what's happening today."
        buttonName="Notifications"
      />

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.map(({ label, value }) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </section>

      <aside className="rounded-2xl bg-[#f7f8f9] p-4 w-full">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#b12d2d]">
            <HiOutlineExclamationTriangle className="text-xl" />
            Stock Alerts
          </h2>
        </div>

        <div className="space-y-3">
          {stockAlerts.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#e3e1df] bg-white px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-stone-200 via-zinc-200 to-slate-100 text-lg shadow-inner">
                  {item.name.includes("Cotton")
                    ? "👕"
                    : item.name.includes("Ring")
                      ? "💍"
                      : "🧢"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1f2937]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#6b7280]">{item.quantity}</p>
                </div>
              </div>

              <button className="rounded-md bg-[#f3f3f2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#374151]">
                {item.type}
              </button>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full rounded-xl border border-[#e4e4e4] bg-white px-3 py-3 text-sm font-medium text-[#1f2937] shadow-sm transition hover:bg-[#f8f8f7]">
          View Inventory Report
        </button>
      </aside>

      <section className="rounded-2xl  bg-[#f7f8f9] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1f2937]">
            Recent Products
          </h2>
          <button className="text-sm font-medium text-[#1f2937] hover:text-[#111827]">
            View All
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e6e4e1] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8f8f7] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.name} className="border-t border-[#f0efee]">
                  <td className="px-4 py-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br ${product.iconClass} text-xl shadow-inner`}
                    >
                      <span>{product.icon}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1f2937]">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1f2937]">
                    {product.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${product.statusClass}`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
