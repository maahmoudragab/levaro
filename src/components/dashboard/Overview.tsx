import {
  HiOutlineBell,
  HiOutlineCube,
  HiOutlineExclamationTriangle,
  HiOutlineFolder,
  HiOutlineMagnifyingGlassPlus,
  HiOutlinePlus,
  HiOutlineStar,
} from "react-icons/hi2";

const stats = [
  {
    label: "Total Products",
    value: "1,248",
    change: "+12% this month",
    tone: "text-[#1c2a2c]",
    icon: HiOutlineCube,
    iconWrap: "bg-[#f0f4f1] text-[#1a3a35]",
  },
  {
    label: "Total Categories",
    value: "24",
    change: "No change",
    tone: "text-[#374151]",
    icon: HiOutlineFolder,
    iconWrap: "bg-[#f0f4f1] text-[#1a3a35]",
  },
  {
    label: "Featured Products",
    value: "12",
    change: "+2 this week",
    tone: "text-[#1a3a35]",
    icon: HiOutlineStar,
    iconWrap: "bg-[#f3f0ea] text-[#8a6b1d]",
  },
  {
    label: "Out of Stock",
    value: "18",
    change: "Needs attention",
    tone: "text-[#b12d2d]",
    icon: HiOutlineExclamationTriangle,
    iconWrap: "bg-[#f8efef] text-[#b12d2d]",
  },
];

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

export default function Overview() {
  return (
    <div className="min-h-screen p-4 bg-[#efefee] text-[#1f2937]">
        <header className=" flex items-center justify-between gap-4 rounded-[18px] border border-[#e6e4e1] bg-[#f7f7f6] px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] lg:px-5">
          <div>
            <h1 className="font-bodoni text-4xl font-bold text-[#1f2937]">
              Dashboard
            </h1>
            <p className="mt-1 text-base text-[#6b7280]">
              Welcome back, here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#18694f] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,105,79,0.18)] transition hover:bg-[#13573f]">
              <HiOutlinePlus className="text-base" />
              Add Product
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-[#f7f8f9] px-4 py-3 text-sm font-semibold text-[#1f2937] shadow-[0_8px_20px_rgba(24,105,79,0.18)] transition hover:bg-[#e5e5e5a3]">
              <HiOutlineBell/>
              <span className="a">
                Notfications
              </span>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <div className="flex items-center justify-between gap-4">



          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, change, tone, icon: Icon, iconWrap }) => (
              <article
                key={label}
                className="rounded-2xl border border-[#e6e4e1] bg-[#f7f7f6] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#4b5563]">{label}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconWrap}`}>
                    <Icon className="text-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={`text-4xl font-bold tracking-[-0.05em] ${tone}`}>{value}</p>
                  <p className="text-xs font-medium text-[#6b7280]">{change}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-2xl border border-[#e6e4e1] bg-[#f7f7f6] p-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1f2937]">Recent Products</h2>
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
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{product.name}</td>
                        <td className="px-4 py-3 text-[#4b5563]">{product.category}</td>
                        <td className="px-4 py-3 font-medium text-[#1f2937]">{product.price}</td>
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
            </div>

            <aside className="rounded-2xl border border-[#e6e4e1] bg-[#f2f2f1] p-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#b12d2d]">
                  <HiOutlineExclamationTriangle className="text-xl" />
                  Stock Alerts
                </h2>
              </div>

              <div className="space-y-3">
                {stockAlerts.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#e3e1df] bg-white px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-stone-200 via-zinc-200 to-slate-100 text-lg shadow-inner">
                        {item.name.includes("Cotton") ? "👕" : item.name.includes("Ring") ? "💍" : "🧢"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1f2937]">{item.name}</p>
                        <p className="text-xs text-[#6b7280]">{item.quantity}</p>
                      </div>
                    </div>

                    <button className="rounded-md bg-[#f3f3f2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#374151]">
                      {item.type}
                    </button>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full rounded-xl border border-[#e4e4e4] bg-white px-3 py-2.5 text-sm font-medium text-[#1f2937] shadow-sm transition hover:bg-[#f8f8f7]">
                View Inventory Report
              </button>
            </aside>
          </section>
        </main>
    </div>
  );
}