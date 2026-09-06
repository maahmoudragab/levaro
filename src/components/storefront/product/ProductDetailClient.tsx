"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles, SlidersHorizontal, Info, Compass, Scissors, Box, Layers, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ProductCard } from "@/components/storefront/shop/ProductCard";
import type { ProductItem } from "@/types/storefront";

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Normalize sizes from either sizes array or stock JSONB
  const availableSizes = useMemo(() => {
    if (Array.isArray(product.stock) && product.stock.length > 0) {
      return product.stock.map((item) => ({
        size: item.size,
        available: item.stock > 0,
        count: item.stock,
      }));
    }
    if (product.stock && typeof product.stock === "object" && !Array.isArray(product.stock)) {
      return Object.entries(product.stock).map(([size, count]) => ({
        size,
        available: Number(count) > 0,
        count: Number(count),
      }));
    }
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.map((s) => ({
        size: s,
        available: true,
        count: 1,
      }));
    }
    return [{ size: "ONE SIZE", available: true, count: 1 }];
  }, [product.stock, product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes.find((s) => s.available)?.size || availableSizes[0]?.size || "ONE SIZE"
  );

  // Interactive Cursor Zoom state and handlers
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsZoomed(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  }, []);

  // Full-screen White Studio Lightbox Takeover
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox on ESC, navigate with ArrowLeft/ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, product.images.length]);

  // Dynamic order inquiry message
  const dynamicWhatsappMessage = `Hello LÉVARO Atelier, I would like to acquire the ${product.name} (Ref: ${product.sku || product.code}) in Size: ${selectedSize}. Price: ${product.salePriceFormatted || product.priceFormatted}. Please confirm atelier availability.`;
  const whatsappUrl = `https://wa.me/201019082005?text=${encodeURIComponent(dynamicWhatsappMessage)}`;

  const primaryImage = product.images[selectedImageIndex] || product.images[0] || "/placeholder.jpg";

  return (
    <div className="w-full bg-[#FBF9F6] text-near-black site-padding-x pt-28 sm:pt-36 pb-24 transition-colors">
      <div className="site-container space-y-16 sm:space-y-24">
        
        {/* 1. TOP BREADCRUMB */}
        <nav className="flex items-center justify-between border-b border-near-black/10 pb-4 text-[10px] font-mono uppercase tracking-[0.24em] text-brand-gray">
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hover:text-near-black transition-colors cursor-pointer"
            >
              SHOP
            </Link>
            <span>/</span>
            <Link
              href={`/shop?department=${(product.gender || product.department || "all").toLowerCase()}`}
              className="hover:text-near-black transition-colors cursor-pointer"
            >
              {product.gender || product.department}
            </Link>
            {(product.category_name || product.category) && (
              <>
                <span>/</span>
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category_slug || product.category)}`}
                  className="hover:text-near-black transition-colors cursor-pointer text-brand-gray"
                >
                  {product.category_name || product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-near-black font-semibold">
              {product.sku || product.code}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {product.is_new && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-[0.2em] px-2 py-0.5 bg-near-black text-off-white font-semibold">
                <Sparkles className="w-2.5 h-2.5" />
                NEW RELEASE
              </span>
            )}
            {product.brand && (
              <span className="text-brand-gray font-mono tracking-[0.2em]">
                {product.brand}
              </span>
            )}
          </div>
        </nav>

        {/* 2. MAIN COMPACT SHOWROOM (BALANCED PROPORTIONS & CURSOR ZOOM) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* A. LEFT COLUMN: COMPACT IMAGE FRAMEWORK (6 COLS) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Compact Viewport with Interactive Hover Zoom & Fullscreen Click */}
            <div
              ref={imageContainerRef}
              onClick={() => setIsLightboxOpen(true)}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[4/4.5] sm:aspect-[4/4.2] max-h-[560px] w-full bg-[#F0EEEA] overflow-hidden border border-near-black/10 cursor-zoom-in group"
            >
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? "scale(2.1)" : "scale(1)",
                  transition: isZoomed ? "none" : "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
                className="object-cover object-[center_25%] brightness-[0.98] will-change-transform"
              />

              {/* Hover Zoom & Fullscreen Hint */}
              <div
                className={`absolute bottom-3 right-3 z-10 text-[9px] uppercase font-mono tracking-[0.2em] bg-[#FBF9F6]/90 text-near-black px-2.5 py-1 border border-near-black/10 pointer-events-none transition-opacity duration-300 backdrop-blur-xs flex items-center gap-1.5 ${
                  isZoomed ? "opacity-0" : "opacity-100"
                }`}
              >
                <Maximize2 className="w-2.5 h-2.5" />
                <span>CLICK FOR FULLSCREEN</span>
              </div>

              {/* Minimal Subtle Badges */}
              <div className="absolute top-3 left-3 z-10 text-[9px] uppercase font-mono tracking-[0.2em] bg-[#FBF9F6]/90 text-near-black px-2.5 py-1 border border-near-black/10 backdrop-blur-xs pointer-events-none font-semibold">
                {product.sku || product.code}
              </div>

              {product.collection && (
                <div className="absolute top-3 right-3 z-10 text-[9px] uppercase font-mono tracking-[0.2em] bg-near-black text-off-white font-semibold px-2.5 py-1 pointer-events-none">
                  {product.collection.toUpperCase()}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-[4/4.5] bg-[#F0EEEA] overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-near-black ring-1 ring-near-black"
                        : "border-near-black/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* B. RIGHT COLUMN: PRODUCT SPECIFICATIONS & ACQUISITION (6 COLS) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
            
            {/* Header: Name, Discipline, Pricing */}
            <div className="border-b border-near-black/10 pb-5 space-y-2.5">
              <div className="flex items-center justify-between gap-3 text-[10px] uppercase font-mono tracking-[0.22em] text-brand-gray">
                <span>
                  {product.gender || product.department} {"//"} {product.category_name || product.category || product.product_type || "EDITION"}
                </span>
                {product.is_featured && (
                  <span className="text-near-black font-semibold">FEATURED SELECTION</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light uppercase tracking-tight text-near-black leading-none">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-mono font-medium tracking-[0.14em] text-near-black">
                  {product.salePriceFormatted || product.priceFormatted}
                </span>

                {product.sale_price && product.sale_price < product.price && (
                  <span className="text-sm font-mono text-brand-gray line-through tracking-[0.1em]">
                    {product.priceFormatted}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Short Description */}
            {product.short_description ? (
              <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-near-black/90 font-medium leading-relaxed">
                {product.short_description}
              </p>
            ) : (
              <p className="text-xs uppercase font-sans tracking-[0.12em] text-brand-gray leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Fast Specs Matrix (Top Level) */}
            <div className="border border-near-black/10 divide-y divide-near-black/10 bg-near-black/[0.02] text-[10px] font-mono uppercase tracking-[0.18em]">
              {product.material && (
                <div className="flex items-center justify-between p-3">
                  <span className="text-brand-gray">FABRIC SPEC</span>
                  <span className="text-near-black font-medium text-right max-w-[65%]">
                    {product.material}
                  </span>
                </div>
              )}

              {(product.fit || product.silhouette) && (
                <div className="flex items-center justify-between p-3">
                  <span className="text-brand-gray">PROPORTION / FIT</span>
                  <span className="text-near-black font-medium text-right max-w-[65%]">
                    {product.fit || product.silhouette}
                  </span>
                </div>
              )}

              {(product.color || (product.colors && product.colors.length > 0)) && (
                <div className="flex items-center justify-between p-3">
                  <span className="text-brand-gray">COLORWAY</span>
                  <span className="text-near-black font-medium">
                    {product.color || product.colors?.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Size & Stock Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray">
                <span>SELECT PROPORTION (SIZE):</span>
                <span className="text-near-black font-semibold">{selectedSize}</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {availableSizes.map(({ size, available }) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => available && setSelectedSize(size)}
                      className={`py-2.5 text-xs uppercase font-mono tracking-[0.16em] border transition-all cursor-pointer ${
                        !available
                          ? "opacity-30 line-through border-near-black/10 cursor-not-allowed text-brand-gray"
                          : isSelected
                          ? "bg-near-black text-off-white border-near-black font-bold shadow-sm"
                          : "bg-transparent text-near-black border-near-black/20 hover:border-near-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acquisition Action */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 bg-near-black text-off-white text-xs uppercase font-sans font-bold tracking-[0.24em] hover:bg-charcoal transition-all shadow-md cursor-pointer"
              >
                <span>ACQUIRE PIECE // SIZE {selectedSize}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-mono tracking-[0.16em] text-brand-gray text-center">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-near-black" />
                <span>Complimentary Insured Delivery &bull; Dedicated Concierge</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EXPANDED FULL DESCRIPTION & ATELIER DOSSIER SECTION */}
        <section className="border-t border-near-black/10 pt-16 sm:pt-20 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-near-black/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-brand-gray block mb-1">
                ATELIER SPECIFICATION DOSSIER
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-light uppercase tracking-tight text-near-black leading-none">
                FULL DESIGN &amp; MATERIAL STUDY
              </h2>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gray">
              REF // {product.sku || product.code}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Deep Architectural Narrative (Full Description) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                <span>COMPLETE DESIGN MANIFESTO</span>
              </span>

              <div className="space-y-4 text-sm sm:text-base font-sans uppercase tracking-[0.14em] text-near-black/85 leading-relaxed">
                <p>
                  {product.description}
                </p>
                {product.short_description && (
                  <p className="text-brand-gray text-xs sm:text-sm">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Tags Exploration */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gray block">
                    EDITION ARCHIVE TAGS:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[10px] uppercase font-mono tracking-[0.18em] border border-near-black/15 text-near-black/80 bg-near-black/[0.03]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Technical Attributes Grid */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>TECHNICAL ATTRIBUTES</span>
              </span>

              <div className="border border-near-black/10 divide-y divide-near-black/10 bg-near-black/[0.02] text-xs font-mono uppercase tracking-[0.16em]">
                {product.material && (
                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-brand-gray flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5" />
                      <span>FABRICATION</span>
                    </span>
                    <span className="text-near-black text-right font-medium">
                      {product.material}
                    </span>
                  </div>
                )}

                {(product.fit || product.silhouette) && (
                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-brand-gray flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>SILHOUETTE</span>
                    </span>
                    <span className="text-near-black text-right font-medium">
                      {product.fit || product.silhouette}
                    </span>
                  </div>
                )}

                {product.country_of_origin && (
                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-brand-gray flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5" />
                      <span>PROVENANCE</span>
                    </span>
                    <span className="text-near-black text-right font-medium">
                      {product.country_of_origin}
                    </span>
                  </div>
                )}

                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-brand-gray flex items-center gap-2">
                    <Box className="w-3.5 h-3.5" />
                    <span>DELIVERY &amp; CARE</span>
                  </span>
                  <span className="text-near-black text-right font-medium">
                    DRY CLEAN ONLY &bull; INSURED TRANSIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "COMPLETE THE SILHOUETTE" // RELATED SUGGESTIONS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-near-black/10 pt-16 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-brand-gray mb-1 block">
                  CURATED COMBINATIONS
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-tight text-near-black leading-none">
                  COMPLETE THE SILHOUETTE
                </h2>
              </div>

              <Link
                href="/shop"
                className="text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray hover:text-near-black transition-colors"
              >
                EXPLORE ALL PIECES &rarr;
              </Link>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} theme="light" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 5. FULL-SCREEN WHITE STUDIO LIGHTBOX TAKEOVER (GALLERY CANVAS) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBF9F6] text-near-black flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Top Bar with Product Reference, Counter & Close Button */}
          <div className="site-padding-x py-5 border-b border-near-black/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.24em] text-brand-gray uppercase">
                LÉVARO // HIGH-RES STUDIO EXHIBIT
              </span>
              <span className="text-[10px] font-mono text-near-black/30">|</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-near-black font-semibold">
                {product.name} ({product.sku || product.code})
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Image index counter */}
              <span className="text-xs font-mono tracking-[0.2em] text-brand-gray">
                0{selectedImageIndex + 1} / 0{product.images.length}
              </span>

              {/* Close ESC button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="flex items-center gap-2 text-xs uppercase font-sans tracking-[0.2em] text-near-black hover:opacity-60 transition-opacity cursor-pointer"
                aria-label="Close studio exhibit"
              >
                <span>CLOSE [ESC]</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Stage with High-Res Image & Arrow Switches */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 select-none">
            {/* Previous Image Arrow */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) => (prev - 1 + product.images.length) % product.images.length
                  )
                }
                className="absolute left-4 sm:left-10 z-20 p-3 sm:p-4 rounded-full bg-near-black/5 hover:bg-near-black/10 text-near-black transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Central Master Studio Image Viewport */}
            <div className="relative w-full max-w-4xl h-[65vh] sm:h-[75vh] flex items-center justify-center">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={`${product.name} exhibit view ${selectedImageIndex + 1}`}
                fill
                priority
                quality={98}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-contain"
              />
            </div>

            {/* Next Image Arrow */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
                }
                className="absolute right-4 sm:right-10 z-20 p-3 sm:p-4 rounded-full bg-near-black/5 hover:bg-near-black/10 text-near-black transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Thumbnail Strip Switcher & Keyboard Tip */}
          <div className="site-padding-x py-4 border-t border-near-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBF9F6]">
            {/* Keyboard arrow hint */}
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray hidden sm:inline">
              USE ARROWS [←] [→] TO NAVIGATE VIEWS
            </span>

            {/* Interactive Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none mx-auto sm:mx-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 sm:w-14 aspect-[4/4.5] bg-[#F0EEEA] overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-near-black ring-2 ring-near-black"
                        : "border-near-black/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="60px"
                      className="object-cover object-center filter grayscale"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Sizing summary */}
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray hidden sm:inline">
              SELECTED SIZE: {selectedSize}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
