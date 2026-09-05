"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";
import { MANIFESTO_ITEMS } from "@/data/storefront";

gsap.registerPlugin(ScrollTrigger);

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSignatureEase();

    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    if (!section || !marquee) return;

    const ctx = gsap.context(() => {
      // Smooth subtle entrance reveal
      gsap.fromTo(
        marquee,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: SIGNATURE_EASE,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full bg-charcoal text-off-white py-10 sm:py-14 md:py-16 border-y border-off-white/10 overflow-hidden transition-colors duration-500"
    >
      <Link
        href="/about"
        className="group block w-full cursor-pointer focus:outline-none"
        aria-label="Explore The House Manifesto"
      >
        <div ref={marqueeRef} className="overflow-hidden select-none">
          <div className="animate-marquee-glide flex items-center">
            {/* First sequence */}
            <div className="flex shrink-0 items-center gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16">
              {MANIFESTO_ITEMS.map((item, index) => (
                <div key={`m1-${index}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                  <span
                    className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-light uppercase tracking-[-0.03em] whitespace-nowrap transition-colors duration-300 ${
                      item.highlight
                        ? "text-brand-gray group-hover:text-off-white"
                        : "text-off-white group-hover:text-brand-gray"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="text-2xl sm:text-4xl md:text-5xl text-off-white/20 font-display font-light">
                    —
                  </span>
                </div>
              ))}
            </div>

            {/* Cloned sequence for seamless infinite loop */}
            <div
              className="flex shrink-0 items-center gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16"
              aria-hidden="true"
            >
              {MANIFESTO_ITEMS.map((item, index) => (
                <div key={`m2-${index}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                  <span
                    className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-light uppercase tracking-[-0.03em] whitespace-nowrap transition-colors duration-300 ${
                      item.highlight
                        ? "text-brand-gray group-hover:text-off-white"
                        : "text-off-white group-hover:text-brand-gray"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="text-2xl sm:text-4xl md:text-5xl text-off-white/20 font-display font-light">
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
