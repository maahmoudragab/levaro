"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight, CornerDownLeft, Sparkles } from "lucide-react";
import { SHOP_PRODUCTS } from "@/data/storefront";
import type { ProductItem } from "@/types/storefront";

const QUICK_TAGS = [
  "RAW DENIM",
  "VIRGIN WOOL",
  "MOTION",
  "SHIFT",
  "OUTERWEAR",
  "TAILORING",
  "ACCESSORIES",
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Listener (⌘K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Return featured or all up to 6
      return SHOP_PRODUCTS.slice(0, 6);
    }

    return SHOP_PRODUCTS.filter((product) => {
      const matchName = product.name?.toLowerCase().includes(trimmed);
      const matchSku = product.sku?.toLowerCase().includes(trimmed);
      const matchCode = product.code?.toLowerCase().includes(trimmed);
      const matchDept = product.department?.toLowerCase().includes(trimmed);
      const matchCat = product.category?.toLowerCase().includes(trimmed);
      const matchCol = product.collection?.toLowerCase().includes(trimmed);
      const matchMat = product.material?.toLowerCase().includes(trimmed);
      const matchTags = product.tags?.some((t) => t.toLowerCase().includes(trimmed));

      return (
        matchName ||
        matchSku ||
        matchCode ||
        matchDept ||
        matchCat ||
        matchCol ||
        matchMat ||
        matchTags
      );
    }).slice(0, 10);
  }, [query]);

  // Handle item selection / navigation
  const navigateToProduct = useCallback(
    (product: ProductItem) => {
      setIsOpen(false);
      router.push(`/shop/${product.slug}`);
    },
    [router]
  );

  // Keyboard navigation within list (Up, Down, Enter)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProducts[selectedIndex]) {
        navigateToProduct(filteredProducts[selectedIndex]);
      }
    }
  };

  // Keep selected item in scroll view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 md:pt-32 px-4 bg-near-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Archive Search Command Palette"
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-3xl bg-near-black border border-off-white/20 text-off-white shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. SEARCH INPUT ROW */}
        <div className="relative flex items-center gap-3 px-5 py-4.5 border-b border-off-white/10">
          <Search className="w-5 h-5 text-brand-gray shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="SEARCH EDITIONS, TEXTILES, SILHOUETTES, OR TAGS..."
            className="w-full bg-transparent text-sm sm:text-base font-sans uppercase tracking-[0.16em] text-off-white placeholder:text-brand-gray/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 text-brand-gray hover:text-off-white transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 border border-off-white/20 text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray hover:text-off-white hover:border-off-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            ESC
          </button>
        </div>

        {/* 2. QUICK PILLS (SHOWN WHEN SEARCH EMPTY) */}
        {!query && (
          <div className="px-5 py-3 border-b border-off-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none bg-charcoal/40">
            <span className="text-[9px] uppercase font-sans tracking-[0.24em] text-brand-gray shrink-0 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> SUGGESTED:
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 text-[9px] uppercase font-mono tracking-[0.18em] border border-off-white/15 text-off-white/80 hover:text-off-white hover:border-off-white transition-colors shrink-0 cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* 3. RESULTS LIST */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto divide-y divide-off-white/5 scrollbar-thin scrollbar-thumb-off-white/10"
        >
          {filteredProducts.length === 0 ? (
            <div className="px-6 py-12 text-center flex flex-col items-center gap-3">
              <span className="text-xs uppercase font-sans tracking-[0.2em] text-brand-gray">
                NO ARCHIVAL EDITIONS FOUND MATCHING &ldquo;{query}&rdquo;
              </span>
              <p className="text-[10px] uppercase font-sans tracking-[0.14em] text-brand-gray/60 max-w-sm">
                Try querying specific materials like &ldquo;Denim&rdquo;, &ldquo;Wool&rdquo;, or collections like &ldquo;Motion&rdquo;.
              </p>
            </div>
          ) : (
            filteredProducts.map((product, idx) => {
              const isSelected = idx === selectedIndex;
              const previewImg = product.images?.[0] || "/placeholder.jpg";

              return (
                <div
                  key={product.id}
                  data-index={idx}
                  onClick={() => navigateToProduct(product)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group px-5 py-3.5 flex items-center gap-4 cursor-pointer transition-colors ${
                    isSelected ? "bg-charcoal" : "hover:bg-charcoal/50"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-12 h-16 bg-near-black border border-off-white/10 shrink-0 overflow-hidden">
                    <Image
                      src={previewImg}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Metadata Column */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-brand-gray uppercase">
                        {product.code || product.sku}
                      </span>
                      <span className="text-brand-gray/40">&bull;</span>
                      <span className="text-[9px] font-sans tracking-[0.2em] text-off-white/60 uppercase">
                        {product.department} / {product.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-display font-light uppercase tracking-[0.12em] text-off-white truncate">
                      {product.name}
                    </h4>

                    {product.material && (
                      <p className="text-[9px] font-sans uppercase tracking-[0.14em] text-brand-gray truncate">
                        {product.material}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Price & Tags */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                    <span className="text-xs font-mono tracking-[0.15em] text-off-white">
                      {product.priceFormatted || `EGP ${product.price?.toLocaleString()}`}
                    </span>
                    <div className="hidden sm:flex items-center gap-1">
                      {product.tags?.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[8px] font-mono tracking-wider px-1 py-0.5 border border-off-white/10 text-brand-gray uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowUpRight
                    className={`w-4 h-4 text-brand-gray transition-transform shrink-0 ${
                      isSelected ? "text-off-white translate-x-0.5 -translate-y-0.5" : ""
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* 4. FOOTER BAR KEYBOARD INSTRUCTIONS */}
        <div className="px-5 py-2.5 bg-near-black border-t border-off-white/10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-brand-gray">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="px-1 py-0.5 border border-off-white/20 text-off-white text-[8px]">↑</span>
              <span className="px-1 py-0.5 border border-off-white/20 text-off-white text-[8px]">↓</span>
              NAVIGATE
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-off-white" /> SELECT
            </span>
          </div>

          <span className="hidden sm:inline-block">
            {filteredProducts.length} ARCHIVE EDITIONS LISTED
          </span>
        </div>
      </div>
    </div>
  );
}
