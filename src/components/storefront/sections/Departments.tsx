"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/storefront/shared/SectionHeader";
import type { DepartmentChapter } from "@/types/storefront";

interface DepartmentsProps {
  departments?: DepartmentChapter[];
}

export function Departments({ departments = [] }: DepartmentsProps) {
  const items = departments || [];
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const activeChapter = items[activeChapterIndex] || items[0];

  // Auto-advance active department button every 5 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveChapterIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section
      id="departments"
      data-light-section="true"
      className="relative w-full flex flex-col justify-between bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. COMPACT 100VH HEADER */}
      <SectionHeader
        title="EXPLORE"
        titleAccent="LÉVARO"
        subtitle="Essential disciplines shaped for daily movement."
        theme="light"
        className="pb-4"
      />

      {/* 2. FIXED CINEMATIC AD-BANNER STAGE */}
      <div className="site-container my-auto py-2 sm:py-3 flex-none">
        <div className="relative w-full aspect-[2.1/1] sm:aspect-[2.3/1] md:aspect-[2.4/1] max-h-105 bg-near-black border border-near-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden group">
          {items.map((ch, index) => {
            const isCurrent = activeChapterIndex === index;
            return (
              <div
                key={ch.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-signature ${
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Static Image Shell */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    priority={index === 0}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 1400px"
                    className="object-cover object-[center_35%] filter grayscale contrast-115 brightness-90"
                  />
                </div>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-near-black/90 via-near-black/35 to-transparent pointer-events-none" />
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

      {/* 3. 100VH BOTTOM CHAPTER TRACK */}
      <div
        className={`site-container grid grid-cols-1 ${
          items.length === 2
            ? "sm:grid-cols-2"
            : items.length === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : items.length > 4
            ? "sm:grid-cols-3 lg:grid-cols-4"
            : "sm:grid-cols-3"
        } gap-3 sm:gap-4 shrink-0 pb-3 sm:pb-4`}
      >
        {items.map((ch, index) => {
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
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-off-white/20 overflow-hidden">
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
    </section>
  );
}
