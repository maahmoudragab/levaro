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
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 1. IMAGERY & SEAMLESS INFINITE LOOP CAROUSEL ARCHITECTURE
  // --------------------------------------------------------------------------
  const imagesList = useMemo(() => {
    return product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.jpg"];
  }, [product.images]);

  const CLONE_OFFSET = 2;

  // Cloned slides for continuous infinite looping (no visual ends or boundaries)
  const slides = useMemo(() => {
    if (imagesList.length <= 1) {
      return imagesList.map((img, idx) => ({
        img,
        originalIndex: idx,
        isClone: false,
        id: `real-${idx}`,
      }));
    }
    const N = imagesList.length;
    const cloneStart = [
      {
        img: imagesList[(N - 2 + N) % N],
        originalIndex: (N - 2 + N) % N,
        isClone: true,
        id: "clone-start-0",
      },
      {
        img: imagesList[(N - 1 + N) % N],
        originalIndex: (N - 1 + N) % N,
        isClone: true,
        id: "clone-start-1",
      },
    ];
    const real = imagesList.map((img, idx) => ({
      img,
      originalIndex: idx,
      isClone: false,
      id: `real-${idx}`,
    }));
    const cloneEnd = [
      {
        img: imagesList[0],
        originalIndex: 0,
        isClone: true,
        id: "clone-end-0",
      },
      {
        img: imagesList[1 % N],
        originalIndex: 1 % N,
        isClone: true,
        id: "clone-end-1",
      },
    ];
    return [...cloneStart, ...real, ...cloneEnd];
  }, [imagesList]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const scrollEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Map physical slide index to real image index (0 .. N-1)
  const getRealIndex = useCallback(
    (slideIdx: number) => {
      if (imagesList.length <= 1) return 0;
      const N = imagesList.length;
      const relative = (slideIdx - CLONE_OFFSET) % N;
      return (relative + N) % N;
    },
    [imagesList.length]
  );

  // Silent instantaneous teleportation when settling on cloned buffer slides
  const checkAndTeleport = useCallback(() => {
    if (
      !carouselRef.current ||
      imagesList.length <= 1 ||
      isDraggingRef.current ||
      isTouchingRef.current
    )
      return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (!clientWidth) return;

    const currentSlide = Math.round(scrollLeft / clientWidth);
    const N = imagesList.length;

    if (currentSlide < CLONE_OFFSET) {
      const targetSlide = currentSlide + N;
      carouselRef.current.scrollLeft = targetSlide * clientWidth;
    } else if (currentSlide >= CLONE_OFFSET + N) {
      const targetSlide = currentSlide - N;
      carouselRef.current.scrollLeft = targetSlide * clientWidth;
    }
  }, [imagesList.length]);

  // Initialize scroll position to real image 0
  useEffect(() => {
    if (!carouselRef.current || imagesList.length <= 1) return;
    const el = carouselRef.current;
    const initScroll = () => {
      if (el.clientWidth > 0) {
        el.scrollLeft = CLONE_OFFSET * el.clientWidth;
      }
    };
    initScroll();
    const t = setTimeout(initScroll, 50);
    return () => clearTimeout(t);
  }, [imagesList]);

  // Keep alignment on browser resize
  useEffect(() => {
    const handleResize = () => {
      if (!carouselRef.current || imagesList.length <= 1) return;
      const clientWidth = carouselRef.current.clientWidth;
      if (clientWidth > 0) {
        carouselRef.current.scrollLeft =
          (CLONE_OFFSET + activeImageIndex) * clientWidth;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesList.length, activeImageIndex]);

  // Listen to native scrollend event where supported
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || imagesList.length <= 1) return;

    const onScrollEnd = () => {
      checkAndTeleport();
    };

    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      el.removeEventListener("scrollend", onScrollEnd);
    };
  }, [imagesList.length, checkAndTeleport]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  // Synchronize active dot/index on touch swipe or mouse scroll
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current || imagesList.length <= 1) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth > 0) {
      const slideIdx = Math.round(scrollLeft / clientWidth);
      const realIdx = getRealIndex(slideIdx);
      setActiveImageIndex(realIdx);

      // Debounced scroll settlement check for infinite loop wrap
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        checkAndTeleport();
      }, 150);
    }
  }, [imagesList.length, getRealIndex, checkAndTeleport]);

  // Jump to specific real slide smoothly
  const goToSlide = useCallback(
    (realIndex: number) => {
      if (!carouselRef.current) return;
      if (imagesList.length <= 1) {
        setActiveImageIndex(0);
        return;
      }
      const clientWidth = carouselRef.current.clientWidth;
      const targetSlide = CLONE_OFFSET + realIndex;
      carouselRef.current.scrollTo({
        left: targetSlide * clientWidth,
        behavior: "smooth",
      });
      setActiveImageIndex(realIndex);

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        checkAndTeleport();
      }, 400);
    },
    [imagesList.length, checkAndTeleport]
  );

  // Infinite Next Slide (never disabled, seamlessly wraps)
  const handleNextSlide = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!carouselRef.current || imagesList.length <= 1) return;
      const clientWidth = carouselRef.current.clientWidth;
      const currentSlide = Math.round(
        carouselRef.current.scrollLeft / clientWidth
      );
      const nextSlide = currentSlide + 1;

      carouselRef.current.scrollTo({
        left: nextSlide * clientWidth,
        behavior: "smooth",
      });

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        checkAndTeleport();
      }, 400);
    },
    [imagesList.length, checkAndTeleport]
  );

  // Infinite Prev Slide (never disabled, seamlessly wraps)
  const handlePrevSlide = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!carouselRef.current || imagesList.length <= 1) return;
      const clientWidth = carouselRef.current.clientWidth;
      const currentSlide = Math.round(
        carouselRef.current.scrollLeft / clientWidth
      );
      const prevSlide = currentSlide - 1;

      carouselRef.current.scrollTo({
        left: prevSlide * clientWidth,
        behavior: "smooth",
      });

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        checkAndTeleport();
      }, 400);
    },
    [imagesList.length, checkAndTeleport]
  );

  // Mouse Drag Support for Desktop Swiping
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!carouselRef.current || imagesList.length <= 1) return;
      isDraggingRef.current = true;
      dragDistanceRef.current = 0;
      startXRef.current = e.pageX - carouselRef.current.offsetLeft;
      scrollLeftRef.current = carouselRef.current.scrollLeft;
    },
    [imagesList.length]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startXRef.current;
    dragDistanceRef.current = Math.abs(walk);
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleMouseUpOrLeave = useCallback(() => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    isDraggingRef.current = false;
    const clientWidth = carouselRef.current.clientWidth;
    if (!clientWidth) return;

    const currentScroll = carouselRef.current.scrollLeft;
    const nearestSlide = Math.round(currentScroll / clientWidth);

    carouselRef.current.scrollTo({
      left: nearestSlide * clientWidth,
      behavior: "smooth",
    });

    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      checkAndTeleport();
    }, 400);
  }, [checkAndTeleport]);

  const handleTouchStart = useCallback(() => {
    isTouchingRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTouchingRef.current = false;
  }, []);

  const handleSlideClick = useCallback(
    (originalIdx: number) => {
      if (dragDistanceRef.current < 6) {
        setActiveImageIndex(originalIdx);
        setIsLightboxOpen(true);
      }
    },
    []
  );

  // --------------------------------------------------------------------------
  // 2. PRICING & VALUATION (WITH QUIET LUXURY DISCOUNT DISPLAY)
  // --------------------------------------------------------------------------
  const hasDiscount = Boolean(
    product.sale_price &&
      product.sale_price > 0 &&
      product.sale_price < product.price
  );

  const formatPrice = (amount: number) =>
    `EGP ${amount.toLocaleString("en-US")}`;

  const originalPriceFormatted =
    product.priceFormatted || formatPrice(product.price);
  const salePriceFormatted =
    product.salePriceFormatted ||
    (product.sale_price ? formatPrice(product.sale_price) : null);

  const discountPercent =
    hasDiscount && product.sale_price
      ? Math.round(
          ((product.price - product.sale_price) / product.price) * 100
        )
      : 0;

  // --------------------------------------------------------------------------
  // 3. SIZING & PROPORTIONS MATRIX
  // --------------------------------------------------------------------------
  const availableSizes = useMemo(() => {
    if (Array.isArray(product.stock) && product.stock.length > 0) {
      return product.stock.map((item) => ({
        size: item.size,
        available: item.stock > 0,
        count: item.stock,
      }));
    }
    if (
      product.stock &&
      typeof product.stock === "object" &&
      !Array.isArray(product.stock)
    ) {
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
        count: null,
      }));
    }
    return [{ size: "ONE SIZE", available: true, count: null }];
  }, [product.stock, product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0]?.size || "ONE SIZE"
  );

  // --------------------------------------------------------------------------
  // 4. ACCORDIONS STATE (ATELIER DOSSIER)
  // --------------------------------------------------------------------------
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    manifesto: true,
    specs: true,
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

  return (
    <div className="w-full bg-[#FBF9F6] text-near-black pt-16 sm:pt-28 pb-16 sm:pb-24 transition-colors">
      <div className="site-padding-x">
        <div className="site-container space-y-6 sm:space-y-12">
          {/* 1. ARCHITECTURAL TOP BREADCRUMB & METADATA BAR */}
          <nav className="flex flex-wrap items-center justify-between gap-y-2 border-b border-near-black/15 pb-4 text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-near-black/70">
            <div className="flex items-center gap-2 truncate">
              <Link
                href="/shop"
                className="hover:text-near-black transition-colors cursor-pointer shrink-0 font-medium"
              >
                ARCHIVE
              </Link>
              <span>/</span>
              <Link
                href={`/shop?department=${(
                  product.gender ||
                  product.department ||
                  "all"
                ).toLowerCase()}`}
                className="hover:text-near-black transition-colors cursor-pointer shrink-0 font-medium"
              >
                {product.gender || product.department || "DISCIPLINE"}
              </Link>
              {(product.category_name || product.category) && (
                <>
                  <span>/</span>
                  <Link
                    href={`/shop?category=${encodeURIComponent(
                      product.category_slug || product.category
                    )}`}
                    className="hover:text-near-black transition-colors cursor-pointer truncate font-medium"
                  >
                    {product.category_name || product.category}
                  </Link>
                </>
              )}
              {product.collection && (
                <>
                  <span>/</span>
                  <span className="text-near-black font-bold truncate">
                    {product.collection}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-near-black font-bold text-xs sm:text-[13px]">
                {product.sku || product.code}
              </span>
              {product.is_new && (
                <span className="px-2 py-0.5 bg-near-black text-off-white text-[9.5px] sm:text-[10px] font-mono font-semibold">
                  NEW EDITION
                </span>
              )}
              {product.is_featured && (
                <span className="px-2 py-0.5 border border-near-black/25 text-near-black text-[9.5px] sm:text-[10px] font-mono font-semibold">
                  CURATED
                </span>
              )}
            </div>
          </nav>

          {/* 2. MAIN ATELIER SHOWROOM (TWO-COLUMN ARCHITECTURE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* A. RE-ENGINEERED SWIPEABLE GALLERY (LEFT/DOMINANT) */}
            <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col items-center">
              {/* Main Swipeable Frame */}
              <div className="relative w-full overflow-hidden group">
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full aspect-3/4 sm:aspect-4/5 lg:aspect-3/4 max-h-180 bg-[#F0EEEA] border border-near-black/10 select-none cursor-grab active:cursor-grabbing transition-shadow"
                >
                  {slides.map((slide, slideIdx) => (
                    <div
                      key={`${slide.id}-${slideIdx}`}
                      onClick={() => handleSlideClick(slide.originalIndex)}
                      className="w-full h-full shrink-0 snap-center relative cursor-zoom-in"
                    >
                      <Image
                        src={slide.img}
                        alt={`${product.name} look ${slide.originalIndex + 1}`}
                        fill
                        priority={slide.originalIndex === 0 && !slide.isClone}
                        quality={92}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-[center_20%] pointer-events-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Left & Right Floating Navigation Arrows — Always active for infinite loop */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-[#FBF9F6]/90 border border-near-black/15 text-near-black backdrop-blur-xs transition-all cursor-pointer opacity-75 hover:opacity-100 hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-[#FBF9F6]/90 border border-near-black/15 text-near-black backdrop-blur-xs transition-all cursor-pointer opacity-75 hover:opacity-100 hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* PAGINATION DOTS (OVERLAYED INSIDE IMAGE) */}
                {imagesList.length > 1 && (
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-near-black/70 backdrop-blur-xs border border-off-white/10 pointer-events-auto">
                    {imagesList.map((_, idx) => {
                      const isActive = activeImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(idx);
                          }}
                          className={`transition-all duration-300 cursor-pointer h-[3px] ${
                            isActive
                              ? "w-6 bg-off-white"
                              : "w-1.5 bg-off-white/35 hover:bg-off-white/70"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Lightbox Maximize Icon */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(activeImageIndex);
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-3 right-3 z-10 bg-[#FBF9F6]/90 text-near-black p-2 border border-near-black/10 backdrop-blur-xs hover:bg-white transition-opacity cursor-pointer opacity-80 hover:opacity-100"
                  aria-label="Open Fullscreen Lightbox"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* OPTIONAL ARCHITECTURAL MINI-THUMBNAILS STRIP */}
              {imagesList.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none pt-3 max-w-full">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`relative w-12 sm:w-14 aspect-3/4 bg-[#F0EEEA] overflow-hidden border transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === idx
                          ? "border-near-black ring-1 ring-near-black opacity-100"
                          : "border-near-black/15 opacity-40 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* B. ALL PRODUCT DETAILS DOSSIER (RIGHT/STICKY) */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:sticky lg:top-28 space-y-6 sm:space-y-7">
              {/* 1. Header: Department, Category, Title & Pricing */}
              <div className="border-b border-near-black/15 pb-5 space-y-2.5">
                <div className="flex items-center justify-between gap-3 text-xs sm:text-[13px] uppercase font-mono tracking-[0.2em] text-near-black/70 font-medium">
                  <span>
                    {product.gender || product.department || "ATELIER"} &bull;{" "}
                    {product.category_name || product.category || "EDITION"}
                  </span>
                  {product.brand && (
                    <span className="text-near-black font-semibold">
                      {product.brand}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-light uppercase tracking-tight text-near-black leading-[1.05]">
                  {product.name}
                </h1>

                {/* PRICING BLOCK (SHOWING DISCOUNT WITH QUIET LUXURY ELEGANCE) */}
                <div className="pt-2">
                  {hasDiscount ? (
                    <div className="flex flex-wrap items-baseline gap-3.5">
                      <span className="text-3xl sm:text-4xl font-mono font-medium tracking-[0.06em] text-near-black">
                        {salePriceFormatted}
                      </span>
                      <span className="text-base sm:text-lg font-mono text-near-black/45 line-through tracking-[0.06em]">
                        {originalPriceFormatted}
                      </span>
                      <span className="px-2.5 py-1 text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] border border-near-black/25 text-near-black bg-near-black/[0.05] font-semibold">
                        -{discountPercent}% CURATED REDUCTION
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-mono font-medium tracking-[0.06em] text-near-black">
                        {originalPriceFormatted}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-near-black/60 font-medium">
                        ARCHIVE VALUATION
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. EXHAUSTIVE ARCHITECTURAL SPECIFICATIONS GRID */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-near-black/70 font-semibold">
                  <span>ATELIER BLUEPRINT &bull; FULL RECORD</span>
                  <span className="text-near-black font-bold">{product.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Composition */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                    <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                      COMPOSITION
                    </span>
                    <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                      {product.material || "ATELIER BESPOKE BLEND"}
                    </span>
                  </div>

                  {/* Silhouette / Fit */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                    <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                      SILHOUETTE / FIT
                    </span>
                    <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                      {product.fit ||
                        product.silhouette ||
                        "RELAXED ARCHITECTURAL"}
                    </span>
                  </div>

                  {/* Cut Proportions / Drape */}
                  {product.silhouette && (
                    <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                      <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                        DRAPE STRUCTURE
                      </span>
                      <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                        {product.silhouette}
                      </span>
                    </div>
                  )}

                  {/* Colorway */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                    <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                      COLORWAY
                    </span>
                    <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                      {product.color ||
                        product.colors?.join(", ") ||
                        "MONOCHROME"}
                    </span>
                  </div>

                  {/* Provenance */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                    <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                      PROVENANCE
                    </span>
                    <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                      {product.country_of_origin || "ATELIER CRAFTED"}
                    </span>
                  </div>

                  {/* Fashion House */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15">
                    <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                      ATELIER HOUSE
                    </span>
                    <span className="text-near-black font-medium text-xs sm:text-sm font-mono uppercase tracking-[0.08em] block leading-snug">
                      {product.brand || "LÉVARO ATELIER"}
                    </span>
                  </div>

                  {/* SKU & Identification */}
                  <div className="p-3 bg-near-black/[0.03] border border-near-black/15 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-near-black/60 block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium mb-1">
                        CATALOG SKU &bull; SERIAL
                      </span>
                      <span className="text-near-black font-semibold text-xs sm:text-sm font-mono uppercase tracking-[0.12em]">
                        {product.sku || product.code}
                      </span>
                    </div>
                    {product.product_type && (
                      <span className="px-2.5 py-1 text-[11px] sm:text-xs bg-near-black/5 border border-near-black/15 text-near-black/80 font-mono uppercase tracking-[0.14em] font-medium">
                        TYPE: {product.product_type.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. ATELIER SIZING & PROPORTIONS MATRIX */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs sm:text-[13px] uppercase font-mono tracking-[0.2em] text-near-black/75">
                  <span className="font-semibold">ATELIER PROPORTIONS:</span>
                  <span className="text-near-black font-bold">
                    {selectedSize}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {availableSizes.map(({ size, count }) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 sm:py-3 text-xs sm:text-sm uppercase font-mono tracking-[0.16em] border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? "bg-near-black text-off-white border-near-black font-bold shadow-xs"
                            : "bg-transparent text-near-black border-near-black/25 hover:border-near-black font-medium"
                        }`}
                      >
                        <span>{size}</span>
                        {count !== null && count > 0 && (
                          <span className="text-[9px] sm:text-[10px] font-mono opacity-70 mt-0.5">
                            {count} PCS
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.18em] text-near-black/75 pt-2 border-t border-near-black/15 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0 text-near-black" />
                <span>
                  ATELIER ARCHIVE EDITION &bull; PERMANENT STUDY EXHIBITION
                </span>
              </div>

              {/* 4. CONSOLIDATED ATELIER ACCORDIONS (EVERY DETAIL FULLY EXPOSED) */}
              <div className="border-t border-near-black/15 pt-2 space-y-1 divide-y divide-near-black/15">
                {/* Accordion 1: Manifesto / Description */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("manifesto")}
                    className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-[0.18em] font-bold text-near-black flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-near-black/70" />
                      <span>01 — DESIGN MANIFESTO &amp; CONCEPT</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-near-black/70 transition-transform duration-300 ${
                        openAccordions.manifesto
                          ? "rotate-180 text-near-black"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.manifesto
                        ? "max-h-[600px] pb-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm sm:text-[15px] font-sans uppercase tracking-[0.08em] text-near-black/90 leading-relaxed font-normal">
                      {product.description}
                    </p>
                    {product.short_description && (
                      <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.08em] text-near-black/75 mt-3 border-l-2 border-near-black/30 pl-3 leading-relaxed">
                        {product.short_description}
                      </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3">
                        {product.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.14em] border border-near-black/20 text-near-black/80 bg-near-black/[0.03] font-medium"
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
                    className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-[0.18em] font-bold text-near-black flex items-center gap-2.5">
                      <Scissors className="w-4 h-4 text-near-black/70" />
                      <span>02 — MATERIALITY &amp; FABRICATION</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-near-black/70 transition-transform duration-300 ${
                        openAccordions.material
                          ? "rotate-180 text-near-black"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.material
                        ? "max-h-[350px] pb-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.12em] space-y-2 text-near-black">
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">COMPOSITION</span>
                        <span className="font-semibold text-right">
                          {product.material || "ATELIER BESPOKE BLEND"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">STRUCTURE</span>
                        <span className="font-semibold text-right">
                          HIGH-DENSITY ARCHITECTURAL WEAVE
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">COLOR PROCESS</span>
                        <span className="font-semibold text-right">
                          {product.color || "MONOCHROME REACTIVE DYE"}
                        </span>
                      </div>
                      {product.brand && (
                        <div className="flex justify-between py-1.5 border-b border-near-black/10">
                          <span className="text-near-black/60 font-medium">HOUSE LABEL</span>
                          <span className="font-semibold text-right">
                            {product.brand}
                          </span>
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
                    className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-[0.18em] font-bold text-near-black flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-near-black/70" />
                      <span>03 — SILHOUETTE &amp; CUT PROPORTIONS</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-near-black/70 transition-transform duration-300 ${
                        openAccordions.silhouette
                          ? "rotate-180 text-near-black"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.silhouette
                        ? "max-h-[350px] pb-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.12em] space-y-2 text-near-black">
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">TAILORING CUT</span>
                        <span className="font-semibold text-right">
                          {product.fit ||
                            product.silhouette ||
                            "RELAXED ARCHITECTURAL"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">DRAPE DYNAMICS</span>
                        <span className="font-semibold text-right">
                          KINETIC WEIGHTED FALL
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">CALIBRATION</span>
                        <span className="font-semibold text-right">
                          TRUE TO ATELIER STANDARDS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion 4: Logistics & Care */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("logistics")}
                    className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-[0.18em] font-bold text-near-black flex items-center gap-2.5">
                      <Box className="w-4 h-4 text-near-black/70" />
                      <span>04 — PROVENANCE &amp; PRESERVATION</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-near-black/70 transition-transform duration-300 ${
                        openAccordions.logistics
                          ? "rotate-180 text-near-black"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordions.logistics
                        ? "max-h-[350px] pb-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.12em] space-y-2 text-near-black">
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">PROVENANCE</span>
                        <span className="font-semibold text-right">
                          {product.country_of_origin || "ATELIER CRAFTED"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">MAINTENANCE</span>
                        <span className="font-semibold text-right">
                          SPECIALIST DRY CLEAN ONLY
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">PRESERVATION</span>
                        <span className="font-semibold text-right">
                          BREATHABLE GARMENT BAG &bull; CEDAR STORAGE
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-near-black/10">
                        <span className="text-near-black/60 font-medium">CURATION</span>
                        <span className="font-semibold text-right">
                          PERMANENT ARCHIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CURATED RELATED PIECES ("COMPLETE THE SILHOUETTE") */}
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

      {/* 4. FULL-SCREEN MINIMAL IMAGE VIEW */}
      <EditorialLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imagesList}
        initialIndex={activeImageIndex}
      />
    </div>
  );
}
