"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";
import { SectionHeader } from "@/components/storefront/shared/SectionHeader";
import { SectionFooter } from "@/components/storefront/shared/SectionFooter";
import { registerGyroscope } from "@/lib/gyroscope";
import { DEPARTMENTS } from "@/data/storefront";

gsap.registerPlugin(ScrollTrigger);

export function Departments() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = DEPARTMENTS[activeChapterIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const parallaxLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const isVisibleRef = useRef(false);
  const activeChapterIndexRef = useRef(activeChapterIndex);
  activeChapterIndexRef.current = activeChapterIndex;

  // Auto-advance active department button every 5 seconds ONLY when section is visible in viewport
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isVisibleRef.current) return;
      setActiveChapterIndex((prev) => (prev + 1) % DEPARTMENTS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 144Hz Smooth Multi-Axis Parallax Engine + Scroll Entrance
  useEffect(() => {
    registerSignatureEase();

    const portal = portalRef.current;
    const section = sectionRef.current;
    if (!portal || !section) return;

    const ctx = gsap.context(() => {
      // 1. Subtle, Pure Scroll Entrance Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: SIGNATURE_EASE }
        );
      }

      tl.fromTo(
        portal,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: SIGNATURE_EASE },
        "-=0.55"
      );

      if (trackContainerRef.current && trackContainerRef.current.children.length > 0) {
        tl.fromTo(
          Array.from(trackContainerRef.current.children),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: SIGNATURE_EASE },
          "-=0.5"
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: SIGNATURE_EASE },
          "-=0.4"
        );
      }

      // 2. Scroll-Driven Vertical Parallax Scrub (-4% -> +4%)
      parallaxLayersRef.current.forEach((layer) => {
        if (!layer) return;
        gsap.fromTo(
          layer,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // 3. Viewport observer to pause off-screen computations
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(section);

      const xSetters = parallaxLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "x", { duration: 0.3, ease: "power2.out" }) : null
      );
      const ySetters = parallaxLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "y", { duration: 0.3, ease: "power2.out" }) : null
      );

      const handleMouseMove = (e: MouseEvent) => {
        if (!isVisibleRef.current) return;
        const rect = portal.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        const activeIdx = activeChapterIndexRef.current;
        xSetters[activeIdx]?.(normX * 22);
        ySetters[activeIdx]?.(normY * 16);
      };

      const handleMouseLeave = () => {
        const activeIdx = activeChapterIndexRef.current;
        xSetters[activeIdx]?.(0);
        ySetters[activeIdx]?.(0);
      };

      const unregisterGyro = registerGyroscope(({ normX, normY }) => {
        if (!isVisibleRef.current) return;
        const activeIdx = activeChapterIndexRef.current;
        xSetters[activeIdx]?.(normX * 26);
        ySetters[activeIdx]?.(normY * 20);
      });

      portal.addEventListener("mousemove", handleMouseMove, { passive: true });
      portal.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        observer.disconnect();
        portal.removeEventListener("mousemove", handleMouseMove);
        portal.removeEventListener("mouseleave", handleMouseLeave);
        unregisterGyro();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="departments"
      ref={sectionRef}
      data-light-section="true"
      className="relative w-full min-h-screen flex flex-col justify-between bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. COMPACT 100VH HEADER */}
      <SectionHeader
        ref={headerRef}
        title="EXPLORE"
        titleAccent="LÉVARO"
        subtitle="Essential disciplines shaped for daily movement."
        theme="light"
        className="pb-4"
      />

      {/* 2. FIXED CINEMATIC AD-BANNER STAGE */}
      <div className="site-container my-auto py-2 sm:py-3 flex-none">
        <div
          ref={portalRef}
          className="relative w-full aspect-[2.1/1] sm:aspect-[2.3/1] md:aspect-[2.4/1] max-h-[420px] bg-near-black border border-near-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden group cursor-crosshair"
        >
          {DEPARTMENTS.map((ch, index) => {
            const isCurrent = activeChapterIndex === index;
            return (
              <div
                key={ch.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Parallax Image Shell */}
                <div
                  ref={(el) => {
                    parallaxLayersRef.current[index] = el;
                  }}
                  className="absolute -top-16 -bottom-16 -left-16 -right-16 w-[calc(100%+128px)] h-[calc(100%+128px)] will-change-transform gpu"
                >
                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    priority={index === 0}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 1400px"
                    className="object-cover object-[center_35%] filter grayscale contrast-115 brightness-90 scale-105"
                  />
                </div>
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-near-black/35 to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Bottom Narrative & Action */}
          <div className="absolute bottom-3 sm:bottom-6 left-3.5 sm:left-7 right-3.5 sm:right-7 z-20 flex items-end justify-between gap-3 sm:gap-4">
            <div className="max-w-[62%] sm:max-w-xl flex flex-col gap-0.5 sm:gap-1.5">
              <h3 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light uppercase tracking-tight text-off-white leading-none truncate sm:overflow-visible">
                {activeChapter.title}
              </h3>

              <p className="text-[9px] sm:text-xs uppercase font-sans tracking-[0.14em] text-off-white/85 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-2 max-w-lg">
                {activeChapter.narrative}
              </p>
            </div>

            <Link
              href={activeChapter.href}
              className="group/btn inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-6 py-2 sm:py-3 bg-off-white text-near-black text-[9px] sm:text-[11px] uppercase font-sans tracking-[0.2em] sm:tracking-[0.24em] font-semibold transition-all duration-300 hover:bg-off-white/90 shadow-xl cursor-pointer w-fit shrink-0"
            >
              <span>EXPLORE</span>
              <span className="hidden sm:inline">{activeChapter.title}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 100VH BOTTOM 3-CHAPTER TRACK */}
      <div ref={trackContainerRef} className="site-container grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 shrink-0 pb-3 sm:pb-4">
        {DEPARTMENTS.map((ch, index) => {
          const isCurrent = activeChapterIndex === index;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChapterIndex(index)}
              onMouseEnter={() => setActiveChapterIndex(index)}
              className={`group relative text-left p-4 sm:p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isCurrent
                  ? "bg-near-black text-off-white border-near-black shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                  : "bg-transparent text-near-black border-near-black/15 hover:border-near-black/40 hover:bg-near-black/5"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <h4 className={`text-xl sm:text-2xl font-display uppercase tracking-tight leading-none ${isCurrent ? "font-normal text-off-white" : "font-light text-near-black"}`}>
                  {ch.title}
                </h4>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 shrink-0 ${isCurrent ? "text-off-white translate-x-1" : "text-brand-gray group-hover:translate-x-1"}`} />
              </div>

              <p className={`text-[10px] sm:text-[11px] uppercase font-sans tracking-[0.14em] leading-relaxed transition-colors duration-300 line-clamp-1 ${
                isCurrent ? "text-off-white/70" : "text-brand-gray"
              }`}>
                {ch.tagline}
              </p>

              {/* 5-second progress indicator line for active button */}
              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-off-white/20 overflow-hidden">
                  <div
                    key={`bar-${activeChapterIndex}`}
                    className="h-full bg-off-white w-full animate-progress-5s"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. SECTION FOOTER */}
      <SectionFooter
        ref={footerRef}
        theme="light"
        nextSection={{
          label: "NEXT: CURATED COLLECTIONS",
          href: "#collections",
        }}
        className="pt-3 sm:pt-4"
      />
    </section>
  );
}
