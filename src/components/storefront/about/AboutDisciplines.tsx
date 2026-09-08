"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Discipline {
  number: string;
  name: string;
  headline: string;
  tagline: string;
  narrative: string;
  principle: string;
  image: string;
  alt: string;
}

const DISCIPLINES: Discipline[] = [
  {
    number: "01",
    name: "TECTONIC SILHOUETTE",
    headline: "CLOTH AS ARCHITECTURE",
    tagline: "VOLUME & MASS OVER BODY CONTOUR",
    narrative:
      "Every seam is drafted as a structural joint. We replace soft body-hugging tailoring with sharp cantilever lapels, drop-shoulder geometries, and reinforced columnar profiles that project unyielding presence.",
    principle: "Form constitutes space rather than merely conforming to it.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop",
    alt: "LÉVARO Tectonic Silhouette Study",
  },
  {
    number: "02",
    name: "KINETIC DRAPING",
    headline: "DESIGNED IN TRANSIT",
    tagline: "FORM ACTIVATED THROUGH MOVEMENT",
    narrative:
      "Clothing only realizes its true dimension in motion. Our master patterns are never engineered on static dressmaker mannequins, but drafted for walking velocity—measuring fluid shear and deep textile swing.",
    principle: "Calibrated for velocity, stride cadence, and natural gravity.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1400&auto=format&fit=crop",
    alt: "LÉVARO Kinetic Draping Study",
  },
  {
    number: "03",
    name: "RAW MATERIAL PURITY",
    headline: "SUBSTANCE OVER NOVELTY",
    tagline: "NATURAL DENSITY & ZERO ELASTANE",
    narrative:
      "We strictly reject artificial stretch blends and synthetic shortcuts. Every piece is cut from unyielding natural fibers: 14.5oz shuttle-loom Japanese selvedge, dense 480gsm virgin wools, and organic plant acetates.",
    principle: "Dense untreated natural fibers engineered to age with permanence.",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=1200&auto=format&fit=crop",
    alt: "LÉVARO Raw Material Study",
  },
  {
    number: "04",
    name: "MONOCHROMATIC SILENCE",
    headline: "THE DISCIPLINE OF SHADOW",
    tagline: "CHROMATIC RESTRAINT & TONAL DEPTH",
    narrative:
      "Color can distract from pure form. LÉVARO adheres to an uncompromising tonal spectrum: Ink Black, Warm Off-White, Smoked Charcoal, and Raw Slate. Garment architecture is revealed strictly through light and shadow.",
    principle: "Form articulated purely through ambient light and shadow.",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=85&w=1400&auto=format&fit=crop",
    alt: "LÉVARO Monochromatic Silence Study",
  },
];

export function AboutDisciplines() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    const setupTriggers = () => {
      if (ctx) ctx.revert();
      ScrollTrigger.refresh();

      ctx = gsap.context(() => {
        // Create scroll trigger for each discipline row to sync activeIndex as user scrolls down
        itemRefs.current.forEach((el, index) => {
          if (!el) return;

          ScrollTrigger.create({
            trigger: el,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          });
        });
      }, sectionRef.current || undefined);
    };

    const isPreloaderDone = (window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
    if (isPreloaderDone) {
      const timer = setTimeout(setupTriggers, 60);
      return () => {
        clearTimeout(timer);
        if (ctx) ctx.revert();
      };
    } else {
      const handlePreloaderDone = () => {
        setTimeout(setupTriggers, 140);
      };

      window.addEventListener("preloaderComplete", handlePreloaderDone, { once: true });
      window.addEventListener("preloaderCurtainLifting", handlePreloaderDone, { once: true });

      return () => {
        window.removeEventListener("preloaderComplete", handlePreloaderDone);
        window.removeEventListener("preloaderCurtainLifting", handlePreloaderDone);
        if (ctx) ctx.revert();
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="disciplines"
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 border-b border-near-black/15"
    >
      <div className="site-container flex flex-col gap-12 sm:gap-16">
        {/* 1. Header Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-near-black/15 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-brand-gray font-semibold">
              CHAPTER 02 / FORM &amp; METHOD
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight text-near-black leading-none">
              THE FOUR <span className="text-brand-gray">DISCIPLINES</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-brand-gray shrink-0">
            <span>ARCHITECTURAL FOUNDATION</span>
            <span className="text-near-black/20">{"//"}</span>
            <span className="text-near-black font-semibold">04 PILLARS</span>
          </div>
        </div>

        {/* 2. Split Stage: Sticky Cinematic Dossier on Left + Expansive Roster on Right */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT STAGE: STICKY CINEMATIC VIEWPORT (VERTICALLY CENTERED) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 sticky top-0 h-screen self-start items-center justify-center">
            <div className="relative w-full aspect-4/5 max-h-130 xl:max-h-140 bg-near-black border border-near-black/15 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              {/* Stacked Images with Signature Cross-Fade */}
              {DISCIPLINES.map((disc, idx) => {
                const isCurrent = activeIndex === idx;
                return (
                  <div
                    key={disc.number}
                    className={`absolute inset-0 transition-opacity duration-700 ease-signature ${
                      isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={disc.image}
                      alt={disc.alt}
                      fill
                      priority={idx === 0}
                      quality={90}
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-center filter grayscale contrast-125 brightness-[0.82] transition-all duration-700 ease-signature group-hover:brightness-[0.92]"
                    />

                    {/* Ambient Atmospheric Gradients */}
                    <div className="absolute inset-0 bg-linear-to-t from-near-black/90 via-near-black/30 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-b from-near-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Stage Badges */}
                    <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-off-white/90">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-off-white rounded-full inline-block" />
                        <span>STUDY [{disc.number} / 04]</span>
                      </div>
                      <span className="border border-off-white/20 px-2.5 py-1 bg-near-black/60 backdrop-blur-xs text-[9px]">
                        {disc.name}
                      </span>
                    </div>

                    {/* Bottom Stage Details */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2.5 border-t border-off-white/15 pt-5">
                      <div className="flex items-center gap-2 text-[9px] uppercase font-mono tracking-[0.22em] text-brand-gray">
                        <span>AXIOM</span>
                        <span>&bull;</span>
                        <span className="text-off-white/70">{disc.headline}</span>
                      </div>
                      <p className="text-xs font-sans uppercase tracking-[0.14em] text-off-white/95 leading-relaxed font-light">
                        &ldquo;{disc.principle}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT ROSTER: EXPANSIVE ARCHITECTURAL CHAPTERS */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col divide-y divide-near-black/10 border-y border-near-black/10">
            {DISCIPLINES.map((disc, idx) => {
              const isCurrent = activeIndex === idx;

              return (
                <div
                  key={disc.number}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative flex flex-col gap-4 py-12 sm:py-16 lg:py-20 px-6 sm:px-10 border-l-2 transition-colors duration-300 cursor-pointer ${
                    isCurrent
                      ? "bg-near-black/[0.035] border-near-black"
                      : "border-transparent hover:bg-near-black/[0.015]"
                  }`}
                >
                  {/* Top Line: Chapter Index & Tagline */}
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.24em] text-brand-gray">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold transition-colors duration-300 ${
                          isCurrent ? "text-near-black font-bold" : "text-brand-gray"
                        }`}
                      >
                        [{disc.number}]
                      </span>
                      <span className="w-5 h-[1px] bg-near-black/25" />
                      <span className="text-near-black/70">{disc.tagline}</span>
                    </div>

                    <span className="hidden sm:inline-block text-[10px] text-brand-gray/60 font-mono tracking-[0.2em]">
                      DISCIPLINE {disc.number}
                    </span>
                  </div>

                  {/* Headline & Main Name */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] uppercase font-mono tracking-[0.22em] text-brand-gray">
                      {disc.headline}
                    </span>
                    <h3
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-light uppercase tracking-tight leading-[0.95] transition-colors duration-300 ${
                        isCurrent
                          ? "text-near-black"
                          : "text-near-black/70 group-hover:text-near-black"
                      }`}
                    >
                      {disc.name}
                    </h3>
                  </div>

                  {/* Narrative Text */}
                  <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-near-black/80 leading-relaxed font-light max-w-2xl pt-1">
                    {disc.narrative}
                  </p>

                  {/* Minimalist Axiom Footer */}
                  <div className="pt-4 mt-2 border-t border-near-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em]">
                    <div className="flex items-center gap-2 text-brand-gray">
                      <span className="w-1.5 h-1.5 bg-near-black/35 rounded-full" />
                      <span>STRUCTURAL AXIOM</span>
                    </div>
                    <span className="text-near-black font-medium text-left sm:text-right">
                      {disc.principle}
                    </span>
                  </div>

                  {/* Mobile-Only Visual (Stacked below on < lg screens) */}
                  <div className="block lg:hidden relative w-full aspect-16/10 bg-near-black border border-near-black/15 overflow-hidden mt-3">
                    <Image
                      src={disc.image}
                      alt={disc.alt}
                      fill
                      quality={85}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center filter grayscale contrast-125 brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-near-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-off-white flex items-center justify-between">
                      <span>STUDY {disc.number}</span>
                      <span className="text-off-white/70">{disc.headline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
