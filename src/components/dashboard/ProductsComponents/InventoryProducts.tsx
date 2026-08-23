"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  Package,
  History,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/app/services/admin/products";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProductHistory = {
  id: string;
  product_id: string;
  action: string | null;
  changes: Record<string, unknown> | null;
  changed_by: string | null;
  created_at: string;
};

type HistoryChange = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
};

type ChangeTone = "positive" | "negative" | "neutral";

/* -------------------------------------------------------------------------- */
/* Product Helpers                                                            */
/* -------------------------------------------------------------------------- */

function getProductStock(product: Product) {
  return (product.stock ?? []).reduce(
    (total, item) => total + Number(item.stock ?? 0),
    0,
  );
}

function compareSizes(a: string, b: string) {
  const order = [
    "XXXS",
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "XXXXL",
  ];

  const normalizedA = a.trim().toUpperCase();
  const normalizedB = b.trim().toUpperCase();

  const indexA = order.indexOf(normalizedA);
  const indexB = order.indexOf(normalizedB);

  if (indexA !== -1 || indexB !== -1) {
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  }

  const numberA = Number(normalizedA);
  const numberB = Number(normalizedB);

  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    return numberA - numberB;
  }

  return normalizedA.localeCompare(normalizedB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function formatRelativeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
}

function PriceTag({ product }: { product: Product }) {
  if (product.sale_price !== null) {
    return (
      <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap text-[11px]">
        <span className="font-semibold text-primary">
          ${product.sale_price}
        </span>

        <span className="text-[11px] text-black/35 line-through">
          ${product.price}
        </span>
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap font-semibold text-black/65 text-[11px]">
      ${product.price}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* History Helpers                                                            */
/* -------------------------------------------------------------------------- */

function getHistoryFieldLabel(field: string) {
  switch (field) {
    case "status":
    case "is_active":
      return "Status";

    case "featured":
    case "is_featured":
      return "Featured";

    case "price":
      return "Price";

    case "stock":
      return "Stock";

    case "color":
      return "Color";

    case "category":
    case "category_id":
      return "Category";

    default:
      return field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function getHistoryDescription(field: string) {
  switch (field) {
    case "status":
    case "is_active":
      return "Product visibility status was changed";

    case "featured":
    case "is_featured":
      return "Featured product setting was updated";

    case "price":
      return "Product selling price was changed";

    case "stock":
      return "Inventory quantities were changed";

    case "color":
      return "Product color was changed";

    case "category":
    case "category_id":
      return "Product category was changed";

    default:
      return "Product information was updated";
  }
}

/* -------------------------------------------------------------------------- */
/* Value Helpers                                                              */
/* -------------------------------------------------------------------------- */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getOldNewFromValue(value: unknown) {
  if (!isObject(value)) {
    return {
      oldValue: null,
      newValue: value,
    };
  }

  // Current database format: { before: ..., after: ... }
  if ("before" in value || "after" in value) {
    return {
      oldValue: value.before ?? null,
      newValue: value.after ?? null,
    };
  }

  // Backward-compatible format: { old_value: ..., new_value: ... }
  if ("old_value" in value || "new_value" in value) {
    return {
      oldValue: value.old_value ?? null,
      newValue: value.new_value ?? null,
    };
  }

  // Backward-compatible format: { old: ..., new: ... }
  if ("old" in value || "new" in value) {
    return {
      oldValue: value.old ?? null,
      newValue: value.new ?? null,
    };
  }

  // Backward-compatible format: { from: ..., to: ... }
  if ("from" in value || "to" in value) {
    return {
      oldValue: value.from ?? null,
      newValue: value.to ?? null,
    };
  }

  return {
    oldValue: null,
    newValue: value,
  };
}

/* -------------------------------------------------------------------------- */
/* Normalize History Changes                                                  */
/* -------------------------------------------------------------------------- */

function normalizeHistoryChanges(
  changes: Record<string, unknown> | null,
): HistoryChange[] {
  if (!changes || !isObject(changes)) {
    return [];
  }

  /*
   * Supported formats:
   *
   * {
   *   price: {
   *     old: 100,
   *     new: 120
   *   }
   * }
   *
   * OR
   *
   * {
   *   price: {
   *     old_value: 100,
   *     new_value: 120
   *   }
   * }
   *
   * OR
   *
   * {
   *   field: "price",
   *   old_value: 100,
   *   new_value: 120
   * }
   */

  if (
    typeof changes.field === "string" &&
    ("old_value" in changes ||
      "new_value" in changes ||
      "old" in changes ||
      "new" in changes)
  ) {
    const { oldValue, newValue } = getOldNewFromValue(changes);

    return [
      {
        field: changes.field,
        oldValue,
        newValue,
      },
    ];
  }

  const entries: HistoryChange[] = [];

  Object.entries(changes).forEach(([field, value]) => {
    const { oldValue, newValue } = getOldNewFromValue(value);

    entries.push({
      field,
      oldValue,
      newValue,
    });
  });

  return entries;
}

/* -------------------------------------------------------------------------- */
/* Format History Values                                                      */
/* -------------------------------------------------------------------------- */

function formatStockValue(value: unknown) {
  if (value === null || value === undefined) {
    return "Not set";
  }

  if (Array.isArray(value)) {
    const total = value.reduce((sum, item) => {
      if (!isObject(item)) return sum;

      const stock =
        typeof item.stock === "number"
          ? item.stock
          : typeof item.quantity === "number"
            ? item.quantity
            : 0;

      return sum + stock;
    }, 0);

    return `${total} units`;
  }

  if (typeof value === "number") {
    return `${value} units`;
  }

  if (typeof value === "string") {
    const number = Number(value);

    if (!Number.isNaN(number)) {
      return `${number} units`;
    }

    return value;
  }

  return JSON.stringify(value);
}

function formatHistoryValue(field: string, value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  if (field === "status" || field === "is_active") {
    if (value === true || value === "true") {
      return "Active";
    }

    if (value === false || value === "false") {
      return "Inactive";
    }
  }

  if (field === "featured" || field === "is_featured") {
    if (value === true || value === "true") {
      return "Featured";
    }

    if (value === false || value === "false") {
      return "Not featured";
    }
  }

  if (field === "price") {
    const number = Number(value);

    if (!Number.isNaN(number)) {
      return `${number.toFixed(2)}`;
    }
  }

  if (field === "stock") {
    return formatStockValue(value);
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "Updated";
    }
  }

  return String(value);
}

/* -------------------------------------------------------------------------- */
/* History Tone                                                               */
/* -------------------------------------------------------------------------- */

function getHistoryTone(
  field: string,
  oldValue: unknown,
  newValue: unknown,
): ChangeTone {
  if (field === "price") {
    const oldNumber = Number(oldValue);
    const newNumber = Number(newValue);

    if (!Number.isNaN(oldNumber) && !Number.isNaN(newNumber)) {
      if (newNumber > oldNumber) return "positive";
      if (newNumber < oldNumber) return "negative";
    }

    return "neutral";
  }

  if (field === "stock") {
    const getStockNumber = (value: unknown) => {
      if (Array.isArray(value)) {
        return value.reduce((sum, item) => {
          if (!isObject(item)) return sum;

          const stock =
            typeof item.stock === "number"
              ? item.stock
              : typeof item.quantity === "number"
                ? item.quantity
                : 0;

          return sum + stock;
        }, 0);
      }

      const number = Number(value);

      return Number.isNaN(number) ? null : number;
    };

    const oldNumber = getStockNumber(oldValue);
    const newNumber = getStockNumber(newValue);

    if (oldNumber !== null && newNumber !== null) {
      if (newNumber > oldNumber) return "positive";
      if (newNumber < oldNumber) return "negative";
    }

    return "neutral";
  }

  if (field === "status" || field === "is_active") {
    const oldActive = oldValue === true || oldValue === "true";
    const newActive = newValue === true || newValue === "true";

    if (!oldActive && newActive) return "positive";
    if (oldActive && !newActive) return "negative";

    return "neutral";
  }

  if (field === "featured" || field === "is_featured") {
    const oldFeatured = oldValue === true || oldValue === "true";

    const newFeatured = newValue === true || newValue === "true";

    if (!oldFeatured && newFeatured) return "positive";
    if (oldFeatured && !newFeatured) return "negative";

    return "neutral";
  }

  return "neutral";
}

/* -------------------------------------------------------------------------- */
/* Action Indicator                                                           */
/* -------------------------------------------------------------------------- */

function ActionIndicator({ tone }: { tone: ChangeTone }) {
  if (tone === "positive") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <ArrowUp className="h-3 w-3" />
      </span>
    );
  }

  if (tone === "negative") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <ArrowDown className="h-3 w-3" />
      </span>
    );
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full  text-black/40">
      <Minus className="h-3 w-3" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Color                                                               */
/* -------------------------------------------------------------------------- */

function getActionColor(field: string) {
  switch (field) {
    case "stock":
      return "bg-amber-50 text-amber-700";

    case "price":
      return "bg-primary/5 text-primary";

    case "status":
    case "is_active":
      return "bg-blue-50 text-blue-700";

    case "featured":
    case "is_featured":
      return "bg-purple-50 text-purple-700";

    case "color":
      return "bg-pink-50 text-pink-700";

    case "category":
    case "category_id":
      return "bg-indigo-50 text-indigo-700";

    default:
      return "bg-black/[0.04] text-black/55";
  }
}

/* -------------------------------------------------------------------------- */
/* Inventory Overview                                                         */
/* -------------------------------------------------------------------------- */

export function InventoryOverview({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  const inventory = useMemo(() => {
    const bySize = new Map<string, number>();

    products.forEach((product) => {
      (product.stock ?? []).forEach((item) => {
        const size = String(item.size ?? "").trim();

        if (!size) return;

        bySize.set(size, (bySize.get(size) ?? 0) + Number(item.stock ?? 0));
      });
    });

    const sizes = Array.from(bySize.entries()).sort((a, b) =>
      compareSizes(a[0], b[0]),
    );

    const total = sizes.reduce((sum, [, quantity]) => sum + quantity, 0);

    const lowStockProducts = products
      .map((product) => ({
        product,
        stock: getProductStock(product),
      }))
      .filter(({ stock }) => stock > 0 && stock <= 10)
      .sort((a, b) => a.stock - b.stock);

    const outOfStockProducts = products.filter(
      (product) => getProductStock(product) === 0,
    );

    return {
      sizes,
      total,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [products]);

  const alertProducts = [
    ...inventory.outOfStockProducts.map((product) => ({
      product,
      stock: 0,
    })),
    ...inventory.lowStockProducts,
  ].slice(0, 4);

  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="border-b border-black/10 px-4 py-4">
        <div className="w-full">
          <h3 className="text-sm font-semibold text-black">
            Inventory Overview
          </h3>

          <p className="min-w-0 truncate text-[11px] leading-4 text-black/45">
            Stock levels across all products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-4  md:grid-cols-5">
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-[11px] font-medium text-black/45">
            Total Products
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-black">
            {products.length}
          </p>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-[11px] font-medium text-black/45">
            Active Products
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-black">
            {products.filter((product) => product.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-[11px] font-medium text-black/45">
            Featured Products
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-black">
            {products.filter((product) => product.is_featured).length}
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
          <p className="text-[11px] font-medium text-amber-700/70">Low stock</p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-amber-700">
            {inventory.lowStockProducts.length}
          </p>

          <p className="mt-0.5 text-[11px] text-amber-700/60">
            1–10 units left
          </p>
        </div>

        <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3">
          <p className="text-[11px] font-medium text-rose-700/70">
            Out of stock
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-rose-700">
            {inventory.outOfStockProducts.length}
          </p>

          <p className="mt-0.5 text-[11px] text-rose-700/60">Needs attention</p>
        </div>
      </div>

      <div className="grid gap-4 border-t border-black/10 p-4 sm:grid-cols-2">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-black">
                Stock by size
              </h4>

              <p className="mt-1 text-[11px] leading-4 text-black/45">
                All sizes from the database, sorted by size
              </p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className="shrink-0 text-[11px] font-medium text-black/45">
                {inventory.sizes.length} sizes
              </p>
              <p className="shrink-0 text-[11px] font-medium text-black/45">
                {inventory.total} units
              </p>
            </div>
          </div>

          {inventory.sizes.length > 0 ? (
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
              {inventory.sizes.map(([size, quantity]) => {
                const percentage =
                  inventory.total > 0
                    ? Math.round((quantity / inventory.total) * 100)
                    : 0;

                return (
                  <div key={size} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs font-semibold text-black/70">
                      {size}
                    </span>

                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full ">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-20 shrink-0 text-right text-[11px] font-medium text-black/50">
                      {quantity} · {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-black/10 px-3 py-6 text-center">
              <p className="text-xs text-black/40">No inventory configured.</p>
            </div>
          )}
        </div>

        <div className="min-w-0 border-t border-black/10 pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-black">Stock alerts</h4>

              <p className="mt-1 text-[11px] leading-4 text-black/45">
                Products that need attention
              </p>
            </div>

            <span className="shrink-0 text-[11px] font-medium text-black/45">
              {inventory.outOfStockProducts.length +
                inventory.lowStockProducts.length}{" "}
              alerts
            </span>
          </div>

          {alertProducts.length > 0 ? (
            <div className="mt-4 space-y-2">
              {alertProducts.map(({ product, stock }) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-2.5",
                    stock === 0
                      ? "border-rose-200 bg-rose-50/70"
                      : "border-amber-200 bg-amber-50/70",
                  )}
                >
                  <div
                    className={cn(
                      "relative h-10 w-10 shrink-0 overflow-hidden rounded-md",
                      stock === 0 ? "bg-rose-100" : "bg-amber-100",
                    )}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <Package className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-black/20" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-xs font-semibold",
                        stock === 0 ? "text-rose-800" : "text-amber-800",
                      )}
                    >
                      {product.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge
                        variant={
                          stock === 0
                            ? "outOfStock"
                            : stock <= 10
                              ? "lowStock"
                              : "inStock"
                        }
                      >
                        {stock === 0 ? "" : stock}{" "}
                        {stock === 0
                          ? "Out of stock"
                          : stock <= 10
                            ? "Low stock"
                            : "In stock"}
                      </Badge>

                      <Badge
                        variant={product.is_active ? "active" : "inactive"}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProduct(product)}
                    className="h-7 rounded-md border-black/10 px-2.5 text-[11px] font-medium text-primary"
                  >
                    <Eye className="h-3 w-3" />
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-6 text-center">
              <p className="text-xs font-medium text-emerald-700">
                Inventory looks healthy
              </p>

              <p className="mt-1 text-[11px] text-emerald-700/60">
                No low-stock or out-of-stock products.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Recently Added Products                                                    */
/* -------------------------------------------------------------------------- */

export function RecentlyAddedProducts({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5),
    [products],
  );

  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="border-b border-black/10 px-4 py-4">
        <div className="w-full">
          <h3 className="text-sm font-semibold text-black">
            Recently Added Products
          </h3>

          <div className="mt-1 flex w-full items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[11px] leading-4 text-black/45">
              The latest products added to your catalog
            </p>

            <span className="shrink-0 text-[11px] leading-4 text-black/45">
              {recentProducts.length} latest
            </span>
          </div>
        </div>
      </div>

      {recentProducts.length > 0 ? (
        <div className="divide-y divide-black/10">
          {recentProducts.map((product) => {
            const stock = getProductStock(product);

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <Package className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-black/20" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="min-w-0 truncate text-xs font-semibold text-black">
                    {product.name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {product.sku && (
                      <span className="rounded-full  font-mono text-[11px] text-black/40">
                        {product.sku}
                      </span>
                    )}
                    <span className="truncate text-[11px] text-black/45">
                      {product.category_name ?? "Uncategorized"}
                    </span>
                    <span className="text-[11px] text-black/45">
                      {formatRelativeDate(product.created_at)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>

                    <Badge
                      variant={
                        stock === 0
                          ? "outOfStock"
                          : stock <= 10
                            ? "lowStock"
                            : "inStock"
                      }
                    >
                      {stock === 0 ? "Out of stock" : `${stock} in stock`}
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <PriceTag product={product} />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProduct(product)}
                    className="h-7 rounded-md border-black/10 px-2.5 text-[11px] font-medium text-primary"
                  >
                    <Eye className="h-3 w-3" />
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-10 text-center">
          <Package className="mx-auto h-6 w-6 text-black/20" />

          <p className="mt-2 text-xs font-medium text-black/55">
            No products added yet
          </p>

          <p className="mt-1 text-[11px] text-black/35">
            New products will appear here automatically.
          </p>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Recently Updated Products                                                  */
/* -------------------------------------------------------------------------- */

export function RecentlyUpdatedProducts({
  products,
  history,
  onSelectProduct,
}: {
  products: Product[];
  history: ProductHistory[];
  onSelectProduct: (product: Product) => void;
}) {
  const recentlyUpdated = useMemo(() => {
    return [...(history ?? [])]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );

        if (!product) return null;

        const changes = normalizeHistoryChanges(item.changes);

        return {
          item,
          product,
          changes,
        };
      })
      .filter(
        (
          item,
        ): item is {
          item: ProductHistory;
          product: Product;
          changes: HistoryChange[];
        } => item !== null,
      )
      .slice(0, 5);
  }, [history, products]);

  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
      {/* Header - متطابق مع باقي الصفحة */}
      <div className="border-b border-black/10 px-4 py-4">
        <div className="w-full">
          <h3 className="text-sm font-semibold text-black">
            Recently Updated Products
          </h3>

          <div className="mt-1 flex w-full items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[11px] leading-4 text-black/45">
              Latest product changes and update history
            </p>

            <span className="shrink-0 text-[11px] leading-4 text-black/45">
              {recentlyUpdated.length} updates
            </span>
          </div>
        </div>
      </div>

      {/* Content List */}
      {recentlyUpdated.length > 0 ? (
        <div className="divide-y divide-black/10">
          {recentlyUpdated.map(({ item, product, changes }) => {
            const visibleChanges = changes.filter((change) =>
              [
                "status",
                "is_active",
                "featured",
                "is_featured",
                "price",
                "stock",
                "color",
                "category",
                "category_id",
              ].includes(change.field),
            );

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover border border-black/10"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-black/10 bg-black/5">
                      <Package className="h-5 w-5 text-black/20" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="min-w-0 truncate text-xs font-semibold text-black">
                    {product.name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>

                    {product.sku && (
                      <span className="font-mono text-[11px] text-black/40">
                        {product.sku}
                      </span>
                    )}
                    <span className="truncate text-[11px] text-black/45">
                      {product.category_name ?? "Uncategorized"}
                    </span>
                    <span className="text-[11px] text-black/45">
                      {formatRelativeDate(item.created_at)}
                    </span>
                  </div>

                  {visibleChanges.length > 0 ? (
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      {visibleChanges.map((change, index) => {
                        const fieldLabel = getHistoryFieldLabel(change.field);
                        const oldValue = formatHistoryValue(
                          change.field,
                          change.oldValue,
                        );
                        const newValue = formatHistoryValue(
                          change.field,
                          change.newValue,
                        );
                        const tone = getHistoryTone(
                          change.field,
                          change.oldValue,
                          change.newValue,
                        );

                        return (
                          <div
                            key={`${item.id}-${change.field}-${index}`}
                            className="flex items-center gap-1.5 text-[11px]"
                          >
                            <ActionIndicator tone={tone} />

                            <span className="font-medium text-black/60">
                              {fieldLabel}:
                            </span>

                            <span className="text-black/40 line-through">
                              {oldValue}
                            </span>

                            <ArrowRight className="h-3 w-3 text-black/25" />

                            <span
                              className={cn(
                                "font-semibold",
                                tone === "positive" && "text-emerald-600",
                                tone === "negative" && "text-rose-600",
                                tone === "neutral" && "text-black/70",
                              )}
                            >
                              {newValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-black/40">
                      Product information was updated.
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProduct(product)}
                    className="h-7 rounded-md border-black/10 px-2.5 text-[11px] font-medium text-primary hover:bg-black/5"
                  >
                    <Eye className="mr-1.5 h-3 w-3" />
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-10 text-center">
          <History className="mx-auto h-6 w-6 text-black/20" />
          <p className="mt-2 text-xs font-medium text-black/55">
            No product updates yet
          </p>
          <p className="mt-1 text-[11px] text-black/35">
            Product changes will appear here automatically.
          </p>
        </div>
      )}
    </section>
  );
}
