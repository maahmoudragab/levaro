"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";
import { registerGyroscope } from "@/lib/gyroscope";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSignatureEase();

    const container = containerRef.current;
    const img = imageRef.current;
    const content = contentRef.current;
    if (!container || !img) return;

    let hasRevealed = false;

    // 1. Initial State: Content starts hidden
    if (content) gsap.set(content.children, { y: 22, opacity: 0 });

    // 2. Smooth reveal when preloader curtain lifts
    const revealEntrance = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      if (content) {
        gsap.to(content.children, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.07,
          ease: SIGNATURE_EASE,
          force3D: true,
        });
      }
    };

    const isPreloaderDone = (window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
    if (isPreloaderDone) {
      revealEntrance();
    } else {
      window.addEventListener("preloaderCurtainLifting", revealEntrance, { once: true });
      window.addEventListener("preloaderComplete", revealEntrance, { once: true });
    }

    // 3. Scroll-driven parallax scrub
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        gsap.to(img, {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      if (content) {
        gsap.to(content, {
          y: -20,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "center top",
            end: "bottom top",
            scrub: 1.0,
          },
        });
      }

      // 4. Subtle, butter-smooth mobile gyroscope parallax
      let isVisible = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      const heroX = gsap.quickTo(img, "x", { duration: 0.3, ease: "power2.out" });
      const heroY = gsap.quickTo(img, "y", { duration: 0.3, ease: "power2.out" });

      const unregisterGyro = registerGyroscope(({ normX, normY }) => {
        if (!isVisible) return;
        heroX(normX * 24);
        heroY(normY * 18);
      });

      return () => {
        mm.revert();
        observer.disconnect();
        unregisterGyro();
      };
    }, container);

    return () => {
      window.removeEventListener("preloaderCurtainLifting", revealEntrance);
      window.removeEventListener("preloaderComplete", revealEntrance);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen md:h-screen flex flex-col justify-between bg-near-black text-off-white site-padding-x overflow-hidden"
    >
      {/* 1. Full-Bleed High-Fashion Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          ref={imageRef}
          className="absolute -top-24 -bottom-16 -left-12 -right-12 md:inset-0 z-0 gpu will-change-transform"
        >
          <Image
            src="/images/hero background.jpg"
            alt="LÉVARO — Move Your Way"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-top md:object-[center_top]"
          />
          {/* Responsive Atmospheric Gradients */}
          <div className="absolute inset-0 bg-near-black/25" />
          <div className="absolute inset-0 bg-linear-to-t from-near-black via-near-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-near-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-near-black/40 via-transparent to-transparent hidden md:block" />
        </div>
      </div>

      {/* 2. Responsive Top Clearance */}
      <div className="pt-24 sm:pt-28 md:pt-32" />
      <div className="my-auto py-2 sm:py-4" />

      {/* 3. Main Editorial Composition */}
      <div
        ref={contentRef}
        className="relative z-20 w-full site-container pb-12 sm:pb-14 lg:pb-16 flex flex-col justify-end"
      >
        {/* Master Headline: MOVE YOUR WAY. (Solid, No Italic) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-light uppercase tracking-[-0.03em] leading-[0.88] text-off-white mb-6 sm:mb-8">
          MOVE YOUR <br />
          <span className="font-light text-off-white">
            WAY.
          </span>
        </h1>

        {/* Supporting Statement & Direct Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end pt-5 sm:pt-6 border-t border-off-white/15">
          {/* Supporting text */}
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.16em] text-off-white/85 leading-relaxed font-sans max-w-sm sm:max-w-md lg:max-w-lg font-medium">
              Contemporary fashion made for people in motion.
            </p>
          </div>

          {/* Action Links */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-start lg:justify-end gap-4 sm:gap-6 md:gap-8">
            <Link
              href="#departments"
              className="group inline-flex items-center justify-between sm:justify-start gap-3 text-xs uppercase tracking-[0.24em] sm:tracking-[0.26em] text-off-white hover:text-brand-gray transition-colors border-b border-off-white pb-1 font-sans font-semibold cursor-pointer"
            >
              <span>EXPLORE DEPARTMENTS</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#collections"
              className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-brand-gray hover:text-off-white transition-colors border-b border-transparent hover:border-off-white pb-1 font-sans cursor-pointer"
            >
              <span>EXPLORE COLLECTIONS</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
