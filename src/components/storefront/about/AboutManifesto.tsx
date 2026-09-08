"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MANIFESTO_TEXT =
  "WE REJECT GARMENTS AS STATIC COVERS. EVERY PIECE IS CONCEIVED AS A HABITABLE VOLUME IN KINETIC RELATION TO GRAVITY AND MOTION. ARCHITECTURE SCULPTED NOT FOR IDLE REPOSE, BUT FOR THE LIVING VELOCITY OF SILHOUETTES IN TRANSIT. WE ELIMINATE SUPERFLUOUS ORNAMENT TO REVEAL UNCOMPROMISING GEOMETRIES, TECTONIC DROP SHOULDERS, AND THE RAW TACTILE MASS OF DENSE FIBERS. A MONOLITHIC STUDY IN FORM, SHADOW, AND SILENCE.";

const MANIFESTO_TENETS = [
  {
    roman: "01",
    title: "GRAVITY AS CO-DESIGNER",
    tagline: "KINETIC VOLUME & DOWNTURN FLOW",
    description:
      "We do not fight the downward pull of heavy textiles; we calibrate hem breaks, pleat depth, and seam geometry to orchestrate fluid kinetic drape as the body moves through space.",
  },
  {
    roman: "02",
    title: "THE SILENT JOINERY",
    tagline: "ELIMINATION OF SUPERFLUOUS ORNAMENT",
    description:
      "Zero decorative hardware, zero external logos, zero distracting exterior stitching. Structural integrity is engineered invisibly from within—reinforced shoulders, bonded margins, and hand-tailored interfacings.",
  },
  {
    roman: "03",
    title: "PERMANENCE OF WEIGHT",
    tagline: "RAW DENSITY & ENDURING TACTILITY",
    description:
      "Fast fashion celebrates featherweight impermanence. We construct clothing as enduring artifacts—relying exclusively on 14.5oz shuttle-loom raw selvedge, 480gsm virgin wools, and monolithic presence.",
  },
];

export function AboutManifesto() {
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const words = MANIFESTO_TEXT.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    const setupScrollAnimation = () => {
      const quoteEl = quoteRef.current;
      if (!quoteEl) return;

      const chars = quoteEl.querySelectorAll(".manifesto-char");
      if (!chars.length) return;

      if (ctx) ctx.revert();

      ScrollTrigger.refresh();

      ctx = gsap.context(() => {
        gsap.to(chars, {
          opacity: 1,
          stagger: 0.012,
          ease: "none",
          scrollTrigger: {
            trigger: quoteEl,
            start: "top 50%",
            end: "bottom 50%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }, quoteEl);
    };

    const isPreloaderDone = (window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
    if (isPreloaderDone) {
      const timer = setTimeout(setupScrollAnimation, 50);
      return () => {
        clearTimeout(timer);
        if (ctx) ctx.revert();
      };
    } else {
      const handlePreloaderDone = () => {
        setTimeout(setupScrollAnimation, 120);
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
      id="manifesto"
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden border-b border-near-black/15"
    >
      <div className="site-container flex flex-col gap-12 sm:gap-16">
        {/* 1. Collections-Style Editorial Header & Breadcrumb */}
        <div className="flex flex-col gap-4 border-b border-near-black/15 pb-8">
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
            <Link href="/" className="hover:text-near-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-near-black font-semibold">THE HOUSE</span>
            <span className="hidden sm:inline text-near-black/20">•</span>
            <span className="hidden sm:inline text-brand-gray">ATELIER MANIFESTO</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight leading-none text-near-black">
                THE STRUCTURAL THESIS
              </h2>
              <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.16em] text-brand-gray max-w-xl leading-relaxed">
                The philosophical foundation of form, momentum, and architectural volume. Every garment is drafted for the human body in motion.
              </p>
            </div>

            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-brand-gray shrink-0">
              CHAPTER 01 // DOCTRINE
            </span>
          </div>
        </div>

        {/* 2. Scroll-Triggered Letter-by-Letter Illuminating Manifesto (Full Width) */}
        <div className="py-4 sm:py-8 w-full flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-near-black/30" />
            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.28em] text-brand-gray">
              MANIFESTO // KINETIC DRAPERY
            </span>
          </div>

          <p
            ref={quoteRef}
            className="w-full text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light uppercase tracking-[-0.02em] leading-relaxed text-near-black select-none text-left"
          >
            {words.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em]">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="manifesto-char inline-block opacity-5 will-change-opacity"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </p>

        </div>

        {/* 3. The Three Architectural Pillars (Triptych Grid) */}
        <div className="pt-10 sm:pt-14 border-t border-near-black/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {MANIFESTO_TENETS.map((tenet) => (
              <div
                key={tenet.roman}
                className="flex flex-col gap-4 group"
              >
                {/* Index & Tagline */}
                <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.24em] text-brand-gray">
                  <span className="font-semibold text-near-black">[{tenet.roman}]</span>
                  <span className="w-5 h-[1px] bg-near-black/25" />
                  <span className="text-near-black/60 truncate">{tenet.tagline}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-display font-light uppercase tracking-tight text-near-black leading-tight">
                  {tenet.title}
                </h3>

                {/* Narrative */}
                <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-near-black/75 leading-relaxed font-light">
                  {tenet.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
