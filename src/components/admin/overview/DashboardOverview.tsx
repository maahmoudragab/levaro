import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  Sparkles,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Tag,
  FolderTree,
  Eye,
} from "lucide-react";
import type { Product } from "@/services/admin/products";
import type { CategoryHierarchy } from "@/services/admin/categories";
import { PriceTag } from "@/components/shared/PriceTag";

interface DashboardOverviewProps {
  products: Product[];
  categories: CategoryHierarchy[];
}

export function DashboardOverview({ products, categories }: DashboardOverviewProps) {
  const totalEditions = products.length;
  const activeEditions = products.filter((p) => p.is_active).length;
  const featuredEditions = products.filter((p) => p.is_featured).length;
  const totalDisciplines = categories.length;
  const totalCollections = categories.reduce(
    (acc, cat) => acc + (cat.collections?.length || 0),
    0
  );

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. ARCHIVE KPI STATS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Total Editions
            </p>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {totalEditions}
          </p>
          <span className="text-[11px] text-zinc-400">Archived Pieces</span>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Active Editions
            </p>
            <Eye className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {activeEditions}
          </p>
          <span className="text-[11px] text-emerald-600">Visible on Storefront</span>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Curated / Featured
            </p>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {featuredEditions}
          </p>
          <span className="text-[11px] text-zinc-400">Homepage Highlights</span>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Disciplines
            </p>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {totalDisciplines}
          </p>
          <span className="text-[11px] text-zinc-400">Primary Departments</span>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Collections
            </p>
            <FolderTree className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {totalCollections}
          </p>
          <span className="text-[11px] text-zinc-400">Capsules & Sub-categories</span>
        </div>
      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Archive Edition</span>
        </Link>

        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors"
        >
          <FolderTree className="w-3.5 h-3.5 text-zinc-400" />
          <span>Organize Collections</span>
        </Link>

        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors"
        >
          <Tag className="w-3.5 h-3.5 text-zinc-400" />
          <span>Inventory & Proportions</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 shadow-2xs hover:text-zinc-900 hover:bg-zinc-50 transition-colors ml-auto"
        >
          <span>View Live Archive</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* 3. TWO-COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Latest Added Archive Editions */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-black/10 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Latest Archived Pieces</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Recently published additions to the atelier lookbook
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-black/5">
            {recentProducts.length > 0 ? (
              recentProducts.map((p) => {
                const img = p.images?.[0] || p.image || "/placeholder.jpg";
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 hover:bg-zinc-50/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-12 h-16 rounded-lg bg-zinc-100 overflow-hidden border border-black/5 shrink-0">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/edit/${p.slug}`}
                          className="text-xs font-bold text-zinc-900 hover:underline truncate block"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                          <span>{p.sku || p.slug}</span>
                          <span>&bull;</span>
                          <span className="uppercase">{p.category_name || "ARCHIVE"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <PriceTag
                        price={p.price}
                        salePrice={p.sale_price}
                        size="sm"
                      />
                      <Link
                        href={`/admin/products/edit/${p.slug}`}
                        className="p-1.5 rounded-lg border border-black/10 hover:bg-zinc-100 text-zinc-600 transition-colors"
                        title="Edit Piece"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400">
                No archive editions created yet.
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Disciplines & Capsules Tree */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-black/10 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Disciplines & Capsules</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Active department taxonomy structure
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {categories.map((dept) => (
              <div
                key={dept.id}
                className="rounded-xl border border-black/5 bg-zinc-50/60 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 uppercase">
                      {dept.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-200/70 text-zinc-700">
                      {dept.product_count ?? 0} pieces
                    </span>
                  </div>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      dept.is_active ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                </div>

                {dept.collections && dept.collections.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {dept.collections.map((col) => (
                      <span
                        key={col.id}
                        className="px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider bg-white border border-black/5 text-zinc-600"
                      >
                        {col.name} ({col.product_count ?? 0})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 text-[11px] text-zinc-400 italic">
                    No sub-collections attached
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
