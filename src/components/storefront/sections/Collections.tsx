"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";
import { SectionHeader, SectionFooter } from "@/components/storefront/shared";
import { registerGyroscope } from "@/lib/gyroscope";
import { FEATURED_COLLECTIONS } from "@/data/storefront";

gsap.registerPlugin(ScrollTrigger);

export function Collections() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    registerSignatureEase();

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Subtle, Quiet Luxury Scroll Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: SIGNATURE_EASE }
        );
      }

      if (cardsGridRef.current) {
        tl.fromTo(
          Array.from(cardsGridRef.current.children),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: SIGNATURE_EASE },
          "-=0.5"
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: SIGNATURE_EASE },
          "-=0.4"
        );
      }

      // 2. Parallax Image Scrub
      imageLayersRef.current.forEach((layer) => {
        if (!layer) return;
        gsap.fromTo(
          layer,
          { yPercent: -3 },
          {
            yPercent: 3,
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

      // 3. Subtle Mobile Gyroscope Drift (2D)
      let isVisible = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(section);

      const colXSetters = imageLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "x", { duration: 0.3, ease: "power2.out" }) : null
      );
      const colYSetters = imageLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "y", { duration: 0.3, ease: "power2.out" }) : null
      );

      const unregisterGyro = registerGyroscope(({ normX, normY }) => {
        if (!isVisible) return;
        colXSetters.forEach((setX) => setX && setX(normX * 24));
        colYSetters.forEach((setY) => setY && setY(normY * 18));
      });

      return () => {
        observer.disconnect();
        unregisterGyro();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative w-full bg-near-black text-off-white site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. SECTION HEADER */}
      <SectionHeader
        ref={headerRef}
        title="CURATED"
        titleAccent="COLLECTIONS"
        subtitle="Explorations in proportion, drape, and shadow."
        theme="dark"
        action={{
          label: "VIEW COLLS",
          href: "/collections",
        }}
      />

      {/* 2. REFINED 2-COLUMN EXHIBITION GRID */}
      <div
        ref={cardsGridRef}
        className="site-container grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 my-8 sm:my-10 lg:my-12"
      >
        {FEATURED_COLLECTIONS.map((col, index) => (
          <Link
            key={col.id}
            href={col.href}
            className="group relative w-full h-[340px] sm:h-[380px] lg:h-[430px] bg-charcoal border border-off-white/15 hover:border-off-white/40 transition-colors duration-500 overflow-hidden flex flex-col justify-end p-5 sm:p-6 lg:p-7 cursor-pointer"
          >
            {/* Parallax Image Shell */}
            <div
              ref={(el) => {
                imageLayersRef.current[index] = el;
              }}
              className="absolute -top-16 -bottom-16 -left-14 -right-14 w-[calc(100%+112px)] h-[calc(100%+128px)] will-change-transform gpu overflow-hidden"
            >
              <Image
                src={col.imagePrimary}
                alt={col.title}
                fill
                priority={index === 0}
                quality={95}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top filter grayscale contrast-110 brightness-[0.78] group-hover:brightness-[0.92] group-hover:scale-104 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
              />
            </div>

            {/* Ambient Gradients for Typography Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/45 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-near-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Card Typography & Explore Action */}
            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light uppercase tracking-tight text-off-white leading-none group-hover:translate-x-1 transition-transform duration-300">
                  {col.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] text-off-white/90 group-hover:text-off-white transition-colors shrink-0">
                  <span className="hidden sm:inline-block font-medium">EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              <p className="text-[11px] sm:text-xs uppercase font-sans tracking-[0.14em] text-off-white/70 max-w-sm leading-relaxed">
                {col.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. SECTION FOOTER */}
      <SectionFooter
        ref={footerRef}
        theme="dark"
        nextSection={{
          label: "NEXT: THE MANIFESTO",
          href: "#manifesto",
        }}
        action={{
          label: "VIEW ALL ARCHIVES",
          href: "/collections",
        }}
        className="mt-6 sm:mt-8"
      />
    </section>
  );
}
