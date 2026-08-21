"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckBadge,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineSquares2X2,
  HiOutlineStar,
  HiOutlineTrash,
  HiOutlineViewColumns,
  HiXMark,
} from "react-icons/hi2";

import type { Product } from "@/app/services/admin/products";
import { useRouter } from "next/navigation";

type ViewMode = "table" | "grid";

type ProductViewProps = {
  products?: Product[];

  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDeleteProduct: (id: string) => void;

  isLoading?: boolean;
};

const LOW_STOCK_THRESHOLD = 24;

/* -------------------------------------------------------------------------- */
/* Small shared bits                                                          */
/* -------------------------------------------------------------------------- */

type StockTone = "rose" | "amber" | "emerald";

const stockToneClasses: Record<StockTone, string> = {
  rose: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

function getStockInfo(product: Product) {
  const total = (product.stock ?? []).reduce(
    (sum, item) => sum + item.stock,
    0,
  );

  if (total === 0) {
    return {
      label: "Out of stock",
      tone: "rose" as StockTone,
    };
  }

  if (total <= LOW_STOCK_THRESHOLD) {
    return {
      label: `Low stock · ${total}`,
      tone: "amber" as StockTone,
    };
  }

  return {
    label: `In stock · ${total}`,
    tone: "emerald" as StockTone,
  };
}

function StockBadge({ product }: { product: Product }) {
  const { label, tone } = getStockInfo(product);

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${stockToneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${
        active ? "text-black/70" : "text-black/35"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-primary" : "bg-black/20"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function PriceTag({ product }: { product: Product }) {
  if (product.sale_price !== null) {
    return (
      <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="font-semibold text-primary">
          ${product.sale_price}
        </span>

        <span className="text-[10px] text-gray-500 line-through">
          ${product.price}
        </span>
      </span>
    );
  }

  return (
    <span className="font-semibold text-black/60 whitespace-nowrap">
      ${product.price}
    </span>
  );
}

function ManageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-black/10 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
    >
      <HiOutlineEye className="text-sm" />

      <span>Manage</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* View switcher                                                              */
/* -------------------------------------------------------------------------- */

function ViewSwitcher({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) {
  const options: {
    key: ViewMode;
    label: string;
    icon: typeof HiOutlineViewColumns;
  }[] = [
    {
      key: "table",
      label: "Table",
      icon: HiOutlineViewColumns,
    },
    {
      key: "grid",
      label: "Grid",
      icon: HiOutlineSquares2X2,
    },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white p-1">
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setViewMode(key)}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
            viewMode === key
              ? "bg-primary text-white"
              : "text-black/50 hover:text-black/80"
          }`}
        >
          <Icon className="text-sm" />

          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table view                                                                 */
/* -------------------------------------------------------------------------- */

function ProductTable({
  products,
  currentPage,
  itemsPerPage,
  onSelectProduct,
}: {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  onSelectProduct: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-black/10 bg-white py-14 text-center text-sm text-black/40">
        No products match your search.
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}

      <div className="flex flex-col gap-2 sm:hidden">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 text-left transition active:bg-black/[0.02]"
          >
            <span className="text-[11px] font-mono text-black/30 w-4 flex-shrink-0">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </span>

            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/[0.03]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold text-black">
                  {product.name}
                </p>

                <PriceTag product={product} />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-black/45">
                  {product.category_name ?? "Uncategorized"}
                </p>

                <StockBadge product={product} />
              </div>

              <StatusDot active={product.is_active} />
            </div>
          </button>
        ))}
      </div>

      {/* Desktop */}

      <div className="hidden overflow-x-auto rounded-xl border border-black/10 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-[11px] uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-2 py-2 font-semibold text-center w-10">#</th>

              <th className="px-4 py-3 font-semibold">Product</th>

              <th className="px-4 py-3 font-semibold">Category</th>

              <th className="px-4 py-3 font-semibold">Price</th>

              <th className="px-4 py-3 font-semibold">Stock</th>

              <th className="px-4 py-3 font-semibold">Status</th>

              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5">
            {products.map((product, index) => {
              const rowIndex = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <tr
                  key={product.id}
                  className="transition hover:bg-black/[0.015]"
                >
                  <td className="px-2 py-2 text-center">
                    <span className="font-mono text-xs text-black/30">
                      {rowIndex}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-15 w-15 flex-shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/[0.03]">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="62px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-black">
                          {product.name}
                        </p>

                        <p className="mt-0.5 font-mono text-[11px] text-black/50">
                          {product.sku ?? "No SKU"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-black/60">
                    {product.category_name ?? "Uncategorized"}
                  </td>

                  <td className="px-4 py-3">
                    <PriceTag product={product} />
                  </td>

                  <td className="px-4 py-3">
                    <StockBadge product={product} />
                  </td>

                  <td className="px-4 py-3">
                    <StatusDot active={product.is_active} />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <ManageButton onClick={() => onSelectProduct(product)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Grid view                                                                  */
/* -------------------------------------------------------------------------- */

function ProductGrid({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-black/10 bg-white py-14 text-center text-sm text-black/40">
        No products match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className="group flex cursor-pointer flex-col rounded-xl border border-black/10 bg-white p-2 text-left transition hover:border-primary/30"
        >
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-black/10 bg-black/[0.03]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition group-hover:scale-[1.03]"
                />
              )}
            </div>

            <div className="absolute top-2 left-2">
              <StockBadge product={product} />
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <h3 className="truncate text-xs font-semibold text-black">
              {product.name}
            </h3>

            <p className="truncate text-[10px] text-black/40">
              {product.category_name ?? "Uncategorized"}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-black/5">
              <StatusDot active={product.is_active} />

              <PriceTag product={product} />
            </div>
          </div>

          {/* Manage button منفصل */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              onSelectProduct(product);
            }}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/10 py-1.5 text-[11px] font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
          >
            <HiOutlineEye className="text-sm" />
            Manage
          </button>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawer                                                                     */
/* -------------------------------------------------------------------------- */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-xs">
      <span className="text-black/40">{label}</span>

      <span className="truncate font-medium text-black/80">{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-[10px] font-semibold uppercase tracking-wider text-black/40">
      {children}
    </h5>
  );
}

function ProductDrawer({
  product,
  onClose,
  onToggleActive,
  onToggleFeatured,
  onDeleteProduct,
  isLoading,
}: {
  product: Product;
  onClose: () => void;
  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  isLoading: boolean;
}) {
  const router = useRouter();
  const secondaryDetails = [
    {
      label: "Brand",
      value: product.brand,
    },
    {
      label: "Gender",
      value: product.gender,
    },
    {
      label: "Color",
      value: product.color,
    },
    {
      label: "Fit",
      value: product.fit,
    },
    {
      label: "Material",
      value: product.material,
    },
    {
      label: "Origin",
      value: product.country_of_origin,
    },
    {
      label: "Type",
      value: product.product_type,
    },
  ].filter((row) => row.value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
        }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 260,
        }}
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-black">Product details</h3>

            <p className="mt-0.5 font-mono text-[10px] text-black/35">
              {product.sku ?? product.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-black/40 transition hover:bg-black/5 hover:text-black"
          >
            <HiXMark className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Hero */}

          <div className="flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/[0.03]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <h4 className="truncate text-sm font-bold text-black">
                {product.name}
              </h4>

              <p className="text-sm">
                <PriceTag product={product} />
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <StockBadge product={product} />

                <StatusDot active={product.is_active} />

                {product.is_featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    <HiOutlineStar className="text-xs" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-black/10 text-xs font-semibold text-primary transition hover:bg-primary/5"
          >
            <HiOutlineArrowTopRightOnSquare className="text-sm" />
            View live product page
          </a>

          {/* Overview */}

          <div>
            <SectionLabel>Overview</SectionLabel>

            <div className="mt-2 divide-y divide-black/5">
              <DetailRow
                label="Category"
                value={product.category_name ?? "Uncategorized"}
              />

              {product.sale_price !== null && (
                <DetailRow label="Regular price" value={`$${product.price}`} />
              )}

              <DetailRow
                label="Added"
                value={new Date(product.created_at).toLocaleDateString()}
              />
            </div>
          </div>

          {/* Description */}

          {product.short_description && (
            <div>
              <SectionLabel>Description</SectionLabel>

              <p className="mt-2 text-xs leading-relaxed text-black/70">
                {product.short_description}
              </p>
            </div>
          )}

          {/* Stock */}

          <div>
            <SectionLabel>Stock by size</SectionLabel>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {(product.stock ?? []).length > 0 ? (
                (product.stock ?? []).map((item) => (
                  <span
                    key={item.size}
                    className="rounded-lg border border-black/10 px-2.5 py-1 text-[11px] text-black/70"
                  >
                    <span className="font-semibold text-black">
                      {item.size}
                    </span>{" "}
                    · {item.stock}
                  </span>
                ))
              ) : (
                <span className="text-xs text-black/35">
                  No sizes configured
                </span>
              )}
            </div>
          </div>

          {/* Attributes */}

          {secondaryDetails.length > 0 && (
            <div>
              <SectionLabel>Attributes</SectionLabel>

              <div className="mt-2 divide-y divide-black/5">
                {secondaryDetails.map((row) => (
                  <DetailRow
                    key={row.label}
                    label={row.label}
                    value={row.value as string}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tags */}

          {(product.tags ?? []).length > 0 && (
            <div>
              <SectionLabel>Tags</SectionLabel>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {(product.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[11px] text-black/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}

        <div className="border-t border-black/10 px-5 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onToggleActive(product.id)}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-black/10 text-xs font-semibold text-black/70 transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
            >
              <HiOutlineCheckBadge className="text-sm" />

              {product.is_active ? "Deactivate" : "Activate"}
            </button>

            <button
              type="button"
              onClick={() => onToggleFeatured(product.id)}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-black/10 text-xs font-semibold text-black/70 transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
            >
              <HiOutlineStar className="text-sm" />

              {product.is_featured ? "Unfeature" : "Feature"}
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/dashboard/products/${product.id}/edit`)
            }
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white font-semibold text-xs transition hover:opacity-90"
          >
            <HiOutlinePencilSquare className="text-sm" />
            Edit product
          </button>

          <button
            type="button"
            onClick={() => onDeleteProduct(product.id)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-rose-600 font-semibold text-xs transition hover:bg-rose-50 disabled:opacity-50"
          >
            <HiOutlineTrash className="text-sm" />
            Delete product
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main view                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProductView({
  products,
  onToggleActive,
  onToggleFeatured,
  onDeleteProduct,
  isLoading = false,
}: ProductViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const itemsPerPage = 10;

  // Prevent undefined from breaking the component
  const safeProducts = products ?? [];

  useEffect(() => {
    setCurrentPage(1);
  }, [safeProducts]);

  useEffect(() => {
    if (!selectedProduct) return;

    const exists = safeProducts.some(
      (product) => product.id === selectedProduct.id,
    );

    if (!exists) {
      setSelectedProduct(null);
    }
  }, [safeProducts, selectedProduct]);

  const totalPages = Math.ceil(safeProducts.length / itemsPerPage) || 1;

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const start = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedProducts = safeProducts.slice(start, start + itemsPerPage);

  return (
    <>
      <section className="rounded-2xl bg-[#f7f8f9] p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-xs text-black/50">
            Showing{" "}
            <span className="font-semibold text-black/80">
              {paginatedProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-black/80">
              {safeProducts.length}
            </span>{" "}
            products
          </p>

          <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {viewMode === "table" ? (
          <ProductTable
            products={paginatedProducts}
            currentPage={safeCurrentPage}
            itemsPerPage={itemsPerPage}
            onSelectProduct={setSelectedProduct}
          />
        ) : (
          <ProductGrid
            products={paginatedProducts}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-black/10 pt-3 mt-3">
          <p className="text-xs text-black/50">
            Page{" "}
            <span className="font-semibold text-black/80">
              {safeCurrentPage}
            </span>{" "}
            of <span className="font-semibold text-black/80">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-white text-black/50 transition hover:text-primary disabled:opacity-30"
            >
              <HiOutlineChevronLeft className="text-xs" />
            </button>

            <span className="text-xs px-2 font-semibold text-black/70">
              {safeCurrentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-white text-black/50 transition hover:text-primary disabled:opacity-30"
            >
              <HiOutlineChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* Drawer */}

      <AnimatePresence>
        {selectedProduct && (
          <ProductDrawer
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onToggleActive={onToggleActive}
            onToggleFeatured={onToggleFeatured}
            onDeleteProduct={onDeleteProduct}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
