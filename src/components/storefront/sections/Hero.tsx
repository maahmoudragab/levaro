"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSignatureEase();

    const content = contentRef.current;
    const bottomBar = bottomBarRef.current;

    if (!content) return;

    let hasRevealed = false;

    const animatedElements = [
      ...Array.from(content.children),
      bottomBar,
    ].filter(Boolean);

    // Initial state
    gsap.set(animatedElements, { y: 16, opacity: 0 });

    const revealEntrance = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      gsap.to(animatedElements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: SIGNATURE_EASE,
        force3D: true,
      });
    };

    const isPreloaderDone = (window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
    if (isPreloaderDone) {
      revealEntrance();
    } else {
      window.addEventListener("preloaderCurtainLifting", revealEntrance, { once: true });
      window.addEventListener("preloaderComplete", revealEntrance, { once: true });
    }

    return () => {
      window.removeEventListener("preloaderCurtainLifting", revealEntrance);
      window.removeEventListener("preloaderComplete", revealEntrance);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[80vh] flex flex-col justify-between bg-near-black text-off-white site-padding-x pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-10 overflow-hidden border-b border-off-white/10"
    >
      {/* 1. Photography Backdrop (Same image with clear, atmospheric lighting) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/hero-background.jpg"
          alt="LÉVARO"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-top md:object-[center_top] brightness-[0.88] contrast-[1.05]"
        />
        {/* Soft, clean gradient overlays for optimal text clarity */}
        <div className="absolute inset-0 bg-near-black/30" />
        <div className="absolute inset-0 bg-linear-to-t from-near-black via-near-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-near-black/60 via-transparent to-transparent" />
      </div>

      {/* 2. Main Hero Content (Fluid, spacious, responsive) */}
      <div
        ref={contentRef}
        className="relative z-20 w-full site-container my-auto py-6 sm:py-8 flex flex-col items-start gap-4 sm:gap-6"
      >
        {/* Brand Wordmark & Slogan */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-light uppercase tracking-[0.04em] sm:tracking-[0.08em] leading-[0.92] text-off-white">
            LÉVARO
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-sans tracking-[0.22em] uppercase">
            <span className="text-off-white font-medium">MODERN LUXURY</span>
            <span className="text-brand-gray/40">&bull;</span>
            <span className="text-brand-gray">TAILORED FOR MOVEMENT</span>
          </div>
        </div>

        {/* Concise Description */}
        <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-off-white/80 max-w-lg leading-relaxed font-light">
          Sculpted silhouettes and bespoke textiles engineered for the body in transit.
        </p>

        {/* Action Buttons & Quick Access (Comfortable mobile wrapping) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-3 w-full sm:w-auto">
          {/* Main CTA */}
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.2em] font-semibold hover:bg-white transition-all duration-300 shadow-lg cursor-pointer"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Quick Department Shortcuts */}
          <div className="flex items-center justify-start gap-2 pt-1 sm:pt-0 sm:pl-3 sm:border-l sm:border-off-white/20">
            <Link
              href="/shop?department=men"
              className="px-3.5 py-2 text-[11px] uppercase font-sans tracking-[0.18em] text-off-white/85 hover:text-off-white border border-off-white/20 hover:border-off-white/50 bg-near-black/40 transition-colors"
            >
              MEN
            </Link>
            <Link
              href="/shop?department=women"
              className="px-3.5 py-2 text-[11px] uppercase font-sans tracking-[0.18em] text-off-white/85 hover:text-off-white border border-off-white/20 hover:border-off-white/50 bg-near-black/40 transition-colors"
            >
              WOMEN
            </Link>
            <Link
              href="/shop?department=accessories"
              className="px-3.5 py-2 text-[11px] uppercase font-sans tracking-[0.18em] text-off-white/85 hover:text-off-white border border-off-white/20 hover:border-off-white/50 bg-near-black/40 transition-colors"
            >
              ACCESSORIES
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Clean, Spacious Bottom Spec Bar */}
      <div
        ref={bottomBarRef}
        className="relative z-20 w-full site-container pt-4 sm:pt-6 border-t border-off-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] sm:text-xs font-sans uppercase tracking-[0.18em] text-brand-gray"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-off-white font-medium">AUTUMN / WINTER 2026</span>
          <span className="text-brand-gray/50">&bull;</span>
          <span>ATELIER ARCHIVE</span>
        </div>

        <div className="hidden md:flex items-center gap-2.5 text-[10px] sm:text-[11px] text-off-white/70">
          <span>RAW JAPANESE SELVEDGE</span>
          <span className="text-brand-gray/50">&bull;</span>
          <span>TUSCAN VIRGIN WOOL</span>
        </div>
      </div>
    </section>
  );
}
