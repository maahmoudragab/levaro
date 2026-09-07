"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Info,
  Scissors,
  Box,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import { ProductCard } from "@/components/storefront/shop/ProductCard";
import { EditorialLightbox } from "@/components/storefront/product/EditorialLightbox";
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

  // Normalize sizes from either stock array, stock object, or sizes array
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

  // Accordion open/close state for consolidated Atelier Dossier
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    manifesto: true,
    material: false,
    silhouette: false,
    logistics: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Interactive Desktop Cursor Zoom
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

  // Mobile Horizontal Swipe Scroll Tracking
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const handleMobileScroll = useCallback(() => {
    if (!mobileGalleryRef.current) return;
    const scrollLeft = mobileGalleryRef.current.scrollLeft;
    const width = mobileGalleryRef.current.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      setMobileActiveIndex(Math.max(0, Math.min(product.images.length - 1, index)));
    }
  }, [product.images.length]);

  // Full-screen Studio Editorial Lightbox Takeover
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imagesList = product.images.length > 0 ? product.images : ["/placeholder.jpg"];
  const primaryDesktopImage = imagesList[selectedImageIndex] || imagesList[0];

  return (
    <div className="w-full bg-[#FBF9F6] text-near-black pt-16 sm:pt-28 pb-16 sm:pb-24 transition-colors">
      <div className="site-padding-x">
        <div className="site-container space-y-6 sm:space-y-14">
          
          {/* 1. ULTRA-MINIMAL TOP BREADCRUMB */}
          <nav className="flex items-center justify-between border-b border-near-black/10 pb-3 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.24em] text-brand-gray">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Link href="/shop" className="hover:text-near-black transition-colors cursor-pointer shrink-0">
                SHOP
              </Link>
              <span>/</span>
              <Link
                href={`/shop?department=${(product.gender || product.department || "all").toLowerCase()}`}
                className="hover:text-near-black transition-colors cursor-pointer shrink-0"
              >
                {product.gender || product.department || "ARCHIVE"}
              </Link>
              {(product.category_name || product.category) && (
                <>
                  <span>/</span>
                  <Link
                    href={`/shop?category=${encodeURIComponent(product.category_slug || product.category)}`}
                    className="hover:text-near-black transition-colors cursor-pointer truncate"
                  >
                    {product.category_name || product.category}
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0 pl-2">
              <span className="text-near-black font-semibold">
                {product.sku || product.code}
              </span>
              {product.collection && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-near-black text-off-white text-[8px] font-mono font-medium">
                  {product.collection.toUpperCase()}
                </span>
              )}
            </div>
          </nav>

          {/* 2. MAIN ATELIER SHOWROOM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-start">
            
            {/* A. GALLERY (RIGHT ON DESKTOP, TOP ON MOBILE) */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              
              {/* MOBILE: Edge-to-Edge Touch Snap Carousel */}
              <div className="sm:hidden relative -mx-5 px-5">
                <div
                  ref={mobileGalleryRef}
                  onScroll={handleMobileScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full aspect-[3/4] bg-[#F0EEEA] border-y border-near-black/10"
                >
                  {imagesList.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      className="w-full h-full shrink-0 snap-center relative cursor-zoom-in"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} look ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        className="object-cover object-[center_20%]"
                      />
                    </div>
                  ))}
                </div>

                {/* Floating Mobile Indicators: Numeric Index + Fullscreen Trigger */}
                <div className="absolute bottom-3 left-8 right-8 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#FBF9F6]/90 backdrop-blur-xs px-2 py-0.5 border border-near-black/10 text-[9px] font-mono tracking-[0.2em] text-near-black font-semibold">
                    {String(mobileActiveIndex + 1).padStart(2, "0")} // {String(imagesList.length).padStart(2, "0")}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(mobileActiveIndex);
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto bg-[#FBF9F6]/90 backdrop-blur-xs p-1.5 border border-near-black/10 text-near-black hover:bg-near-black hover:text-off-white transition-colors cursor-pointer"
                    aria-label="Expand image fullscreen"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* DESKTOP: High-Res Magnification Frame with Thumbnails */}
              <div className="hidden sm:block space-y-4">
                <div
                  ref={imageContainerRef}
                  onClick={() => setIsLightboxOpen(true)}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative aspect-[3/4] max-h-[640px] w-full bg-[#F0EEEA] overflow-hidden border border-near-black/10 cursor-zoom-in group"
                >
                  <Image
                    src={primaryDesktopImage}
                    alt={product.name}
                    fill
                    priority
                    quality={95}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZoomed ? "scale(2.1)" : "scale(1)",
                      transition: isZoomed ? "none" : "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                    className="object-cover object-[center_20%] will-change-transform"
                  />

                  {/* Desktop Subtle Expand Hint */}
                  <div
                    className={`absolute bottom-3 right-3 z-10 bg-[#FBF9F6]/90 text-near-black p-2 border border-near-black/10 pointer-events-none transition-opacity duration-300 backdrop-blur-xs flex items-center justify-center ${
                      isZoomed ? "opacity-0" : "opacity-80 group-hover:opacity-100"
                    }`}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Desktop Thumbnails Bar */}
                {imagesList.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pt-1">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 md:w-20 aspect-[3/4] bg-[#F0EEEA] overflow-hidden border transition-all cursor-pointer shrink-0 ${
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
            </div>

            {/* B. SPECIFICATIONS & SIZING (LEFT ON DESKTOP, BOTTOM ON MOBILE) */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:sticky lg:top-28 space-y-4 sm:space-y-6">
              
              {/* Primary Header: Discipline, Name & Price */}
              <div className="border-b border-near-black/10 pb-3 sm:pb-5 space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-3 text-[9.5px] sm:text-[10px] uppercase font-mono tracking-[0.22em] text-brand-gray">
                  <span>
                    {product.gender || product.department || "ATELIER"} {"//"} {product.category_name || product.category || "EDITION"}
                  </span>
                  {product.is_featured && (
                    <span className="text-near-black font-semibold">CURATED</span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-light uppercase tracking-tight text-near-black leading-tight">
                  {product.name}
                </h1>

                {/* Price Line with Optional Sale Price Strikethrough */}
                <div className="flex items-baseline gap-3 pt-0.5">
                  <span className="text-xl sm:text-2xl font-mono font-medium tracking-[0.12em] text-near-black">
                    {product.salePriceFormatted || product.priceFormatted}
                  </span>
                  {product.sale_price && product.sale_price < product.price && (
                    <span className="text-xs sm:text-sm font-mono text-brand-gray line-through tracking-[0.08em]">
                      {product.priceFormatted}
                    </span>
                  )}
                </div>
              </div>

              {/* Condensed Architectural Meta Specs */}
              {(product.material || product.fit || product.silhouette || product.color) && (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-[0.16em]">
                  {product.material && (
                    <div className="p-2.5 bg-near-black/[0.03] border border-near-black/8">
                      <span className="text-brand-gray block text-[9px] mb-0.5">COMPOSITION</span>
                      <span className="text-near-black font-medium truncate block">{product.material}</span>
                    </div>
                  )}
                  {(product.fit || product.silhouette) && (
                    <div className="p-2.5 bg-near-black/[0.03] border border-near-black/8">
                      <span className="text-brand-gray block text-[9px] mb-0.5">PROPORTION</span>
                      <span className="text-near-black font-medium truncate block">{product.fit || product.silhouette}</span>
                    </div>
                  )}
                  {(product.color || (product.colors && product.colors.length > 0)) && (
                    <div className="p-2.5 bg-near-black/[0.03] border border-near-black/8 col-span-2">
                      <span className="text-brand-gray block text-[9px] mb-0.5">COLORWAY</span>
                      <span className="text-near-black font-medium truncate block">
                        {product.color || product.colors?.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray">
                  <span>SELECT PROPORTION:</span>
                  <span className="text-near-black font-semibold">{selectedSize}</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
                  {availableSizes.map(({ size, available }) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        onClick={() => available && setSelectedSize(size)}
                        className={`py-2 text-[11px] sm:text-xs uppercase font-mono tracking-[0.16em] border transition-all cursor-pointer ${
                          !available
                            ? "opacity-25 line-through border-near-black/10 cursor-not-allowed text-brand-gray"
                            : isSelected
                            ? "bg-near-black text-off-white border-near-black font-bold"
                            : "bg-transparent text-near-black border-near-black/20 hover:border-near-black"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[9.5px] uppercase font-mono tracking-[0.16em] text-brand-gray pt-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-near-black" />
                <span>Complimentary Insured Transit &bull; Dedicated Concierge</span>
              </div>

              {/* 3. CONSOLIDATED ATELIER ACCORDIONS (ZERO MOBILE CLUTTER) */}
              <div className="border-t border-near-black/10 pt-3 sm:pt-4 space-y-1 divide-y divide-near-black/10">
                
                {/* Accordion 1: Manifesto / Description */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("manifesto")}
                    className="w-full py-2.5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-[10.5px] uppercase font-mono tracking-[0.2em] font-semibold text-near-black flex items-center gap-2">
                      <Info className="w-3 h-3 text-brand-gray" />
                      <span>01 // DESIGN MANIFESTO</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-brand-gray transition-transform duration-300 ${
                        openAccordions.manifesto ? "rotate-180 text-near-black" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.manifesto ? "max-h-[500px] pb-3 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs uppercase font-sans tracking-[0.14em] text-near-black/80 leading-relaxed">
                      {product.description}
                    </p>
                    {product.short_description && (
                      <p className="text-[11px] font-sans uppercase tracking-[0.12em] text-brand-gray mt-2">
                        {product.short_description}
                      </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {product.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-[8.5px] uppercase font-mono tracking-[0.16em] border border-near-black/10 text-brand-gray bg-near-black/[0.02]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Accordion 2: Materiality & Fabrication */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("material")}
                    className="w-full py-2.5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-[10.5px] uppercase font-mono tracking-[0.2em] font-semibold text-near-black flex items-center gap-2">
                      <Scissors className="w-3 h-3 text-brand-gray" />
                      <span>02 // MATERIALITY &amp; FABRICATION</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-brand-gray transition-transform duration-300 ${
                        openAccordions.material ? "rotate-180 text-near-black" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.material ? "max-h-[300px] pb-3 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.14em] space-y-1.5 text-near-black/80">
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">COMPOSITION</span>
                        <span className="font-medium text-right">{product.material || "ATELIER CUSTOM BLEND"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">STRUCTURE</span>
                        <span className="font-medium text-right">RAW TEXTURED DENSITY</span>
                      </div>
                      {product.brand && (
                        <div className="flex justify-between py-1 border-b border-near-black/5">
                          <span className="text-brand-gray">HOUSE</span>
                          <span className="font-medium text-right">{product.brand}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Accordion 3: Silhouette & Measurements */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("silhouette")}
                    className="w-full py-2.5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-[10.5px] uppercase font-mono tracking-[0.2em] font-semibold text-near-black flex items-center gap-2">
                      <Layers className="w-3 h-3 text-brand-gray" />
                      <span>03 // SILHOUETTE &amp; CUT</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-brand-gray transition-transform duration-300 ${
                        openAccordions.silhouette ? "rotate-180 text-near-black" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.silhouette ? "max-h-[300px] pb-3 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.14em] space-y-1.5 text-near-black/80">
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">TAILORING CUT</span>
                        <span className="font-medium text-right">{product.fit || product.silhouette || "RELAXED ARCHITECTURAL"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">PROPORTION</span>
                        <span className="font-medium text-right">TRUE TO ATELIER SIZE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion 4: Logistics & Care */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("logistics")}
                    className="w-full py-2.5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-[10.5px] uppercase font-mono tracking-[0.2em] font-semibold text-near-black flex items-center gap-2">
                      <Box className="w-3 h-3 text-brand-gray" />
                      <span>04 // PROVENANCE &amp; CARE</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-brand-gray transition-transform duration-300 ${
                        openAccordions.logistics ? "rotate-180 text-near-black" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.logistics ? "max-h-[300px] pb-3 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.14em] space-y-1.5 text-near-black/80">
                      {product.country_of_origin && (
                        <div className="flex justify-between py-1 border-b border-near-black/5">
                          <span className="text-brand-gray">PROVENANCE</span>
                          <span className="font-medium text-right">{product.country_of_origin}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">MAINTENANCE</span>
                        <span className="font-medium text-right">SPECIALIST DRY CLEAN ONLY</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-near-black/5">
                        <span className="text-brand-gray">SHIPPING</span>
                        <span className="font-medium text-right">INSURED COMPLIMENTARY COURIER</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 4. CURATED RELATED PIECES ("COMPLETE THE SILHOUETTE") */}
          {relatedProducts.length > 0 && (
            <section className="border-t border-near-black/10 pt-10 sm:pt-16 space-y-5 sm:space-y-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray mb-1 block">
                    CURATED COMBINATIONS
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-light uppercase tracking-tight text-near-black leading-none">
                    COMPLETE THE SILHOUETTE
                  </h2>
                </div>

                <Link
                  href="/shop"
                  className="text-[9.5px] sm:text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray hover:text-near-black transition-colors"
                >
                  VIEW ALL &rarr;
                </Link>
              </div>

              {/* Responsive Lookbook Grid: 2 Columns on Mobile, 3 on Desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 sm:gap-x-8 gap-y-8 sm:gap-y-12">
                {relatedProducts.slice(0, 3).map((p) => (
                  <ProductCard key={p.id} product={p} theme="light" />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* 5. FULL-SCREEN MINIMAL IMAGE VIEW */}
      <EditorialLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imagesList}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}
