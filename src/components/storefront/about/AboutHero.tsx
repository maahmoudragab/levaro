"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";

export function AboutHero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const baselineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSignatureEase();

    const headline = headlineRef.current;
    const narrative = narrativeRef.current;
    const actions = actionsRef.current;
    const imageFrame = imageFrameRef.current;
    const baseline = baselineRef.current;

    const animTargets = [
      headline,
      narrative,
      actions,
      imageFrame,
      baseline,
    ].filter(Boolean);

    // Initial state
    gsap.set(animTargets, { y: 16, opacity: 0 });

    let hasRevealed = false;
    const revealEntrance = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      gsap.to(animTargets, {
        y: 0,
        opacity: 1,
        duration: 0.85,
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

  const scrollToManifesto = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo("#manifesto", { offset: 0, duration: 1.2 });
    } else {
      const el = document.getElementById("manifesto");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="about-hero"
      ref={containerRef}
      data-light-section="true"
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-between bg-off-white text-near-black site-padding-x pt-32 sm:pt-40 pb-12 sm:pb-16 transition-colors duration-500"
    >
      {/* Main Architectural Stage */}
      <div className="site-container my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-6 sm:py-10">
        {/* Left Column: Monumental Editorial Voice (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-near-black/40" />
            <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-brand-gray font-semibold">
              THE HOUSE OF LÉVARO / ATELIER
            </span>
          </div>

          {/* Master Headline */}
          <div ref={headlineRef} className="flex flex-col gap-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light uppercase tracking-[-0.03em] leading-[0.92] text-near-black">
              THE ARCHITECTURE <br />
              <span className="text-brand-gray">OF MOVEMENT.</span>
            </h1>
          </div>

          {/* Philosophical Narrative */}
          <p
            ref={narrativeRef}
            className="text-xs sm:text-sm md:text-base font-sans uppercase tracking-[0.16em] text-near-black/85 leading-relaxed max-w-xl font-light"
          >
            LÉVARO operates as an atelier of structural fashion, tectonic silhouettes, and kinetic drapery.
            We reject garments conceived as static covers—every piece is engineered as a habitable volume
            that responds to gravity, shadow, and the human body in transit.
          </p>

          {/* Direct Atelier Actions */}
          <div ref={actionsRef} className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={scrollToManifesto}
              className="group inline-flex items-center gap-3 px-7 py-4 bg-near-black text-off-white text-xs uppercase font-sans tracking-[0.24em] font-semibold transition-all duration-300 hover:bg-near-black/90 shadow-md cursor-pointer"
            >
              <span>EXPLORE MANIFESTO</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 px-7 py-4 bg-transparent border border-near-black/25 text-near-black text-xs uppercase font-sans tracking-[0.24em] transition-all duration-300 hover:border-near-black cursor-pointer"
            >
              <span>VIEW RECENT EDITIONS</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Tall Architectural Portrait Study (5 Cols) */}
        <div ref={imageFrameRef} className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-4/5 bg-[#E8E5DF] border border-near-black/15 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1200&auto=format&fit=crop"
              alt="LÉVARO Atelier Study"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center filter grayscale contrast-125 brightness-95 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-near-black/60 via-transparent to-transparent pointer-events-none" />

            {/* In-Frame Curatorial Tag */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-off-white bg-near-black/90 backdrop-blur-xs px-3 py-2.5 border border-off-white/10">
              <span>STUDY 01 // ARCHETYPE MONOLITH</span>
              <span className="text-brand-gray">VOL. 26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Baseline Divider Bar */}
      <div
        ref={baselineRef}
        className="site-container w-full pt-6 border-t border-near-black/15 flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.24em] text-brand-gray"
      >
        <span>SECTION 00 // THE HOUSE</span>
        <button
          type="button"
          onClick={scrollToManifesto}
          className="hover:text-near-black transition-colors cursor-pointer"
        >
          SCROLL TO MANIFESTO &darr;
        </button>
      </div>
    </section>
  );
}
