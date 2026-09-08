"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StorefrontSubCategoryCard } from "@/services/storefront/categories";

interface CollectionsCatalogProps {
  initialSubCategories: StorefrontSubCategoryCard[];
}

interface DepartmentGroup {
  id: string;
  slug: string;
  name: string;
  collections: StorefrontSubCategoryCard[];
}

// Sub-component for each Department section
function DepartmentDossierSection({
  dept,
  deptIndex,
}: {
  dept: DepartmentGroup;
  deptIndex: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const deptNumber = String(deptIndex + 1).padStart(2, "0");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    const setupTriggers = () => {
      if (ctx) ctx.revert();
      ScrollTrigger.refresh();

      ctx = gsap.context(() => {
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
  }, [dept.collections.length]);

  return (
    <section ref={sectionRef} className="w-full flex flex-col gap-10 sm:gap-14">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-near-black/15">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
            <span className="text-near-black font-semibold">[{deptNumber}]</span>
            <span>DISCIPLINE // {dept.name}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-light uppercase tracking-tight text-near-black leading-none">
            {dept.name}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-brand-gray">
            {dept.collections.length} {dept.collections.length === 1 ? "CAPSULE" : "CAPSULES"}
          </span>
          <Link
            href={`/shop?department=${encodeURIComponent(dept.slug)}`}
            className="group/all inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.2em] text-near-black/80 hover:text-near-black transition-colors"
          >
            <span>EXPLORE {dept.name} ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-signature group-hover/all:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 2. SPLIT DOSSIER DISPLAY */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT STAGE: STICKY CINEMATIC VIEWPORT */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 sticky top-28 xl:top-32 self-start flex-col justify-start">
          <div className="relative w-full aspect-4/5 max-h-145 bg-near-black border border-near-black/15 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            {/* Stacked Images with Signature Crossfade */}
            {dept.collections.map((col, idx) => {
              const isCurrent = activeIndex === idx;
              return (
                <div
                  key={`${col.id || col.slug}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-signature ${
                    isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    priority={deptIndex === 0 && idx === 0}
                    quality={92}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-top transition-opacity duration-700"
                  />

                  {/* Ambient Atmospheric Gradients */}
                  <div className="absolute inset-0 bg-linear-to-t from-near-black/90 via-near-black/25 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-linear-to-b from-near-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Top Stage Badges */}
                  <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-off-white/90">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-off-white inline-block" />
                      <span>CAPSULE [{String(idx + 1).padStart(2, "0")} / {String(dept.collections.length).padStart(2, "0")}]</span>
                    </div>
                    <span className="border border-off-white/20 px-2.5 py-1 bg-near-black/60 backdrop-blur-xs text-[9px]">
                      {dept.name}
                    </span>
                  </div>

                  {/* Bottom Stage Details & Action */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-3 border-t border-off-white/15 pt-4">
                    <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-[0.2em] text-brand-gray">
                      <span>{col.product_count > 0 ? `${col.product_count} EDITIONS AVAILABLE` : "CURATED ATELIER CAPSULE"}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-light uppercase tracking-tight text-off-white leading-tight">
                      {col.name}
                    </h3>

                    <Link
                      href={`/shop?department=${encodeURIComponent(dept.slug)}&collection=${encodeURIComponent(col.slug)}`}
                      className="group/cta inline-flex items-center justify-between w-full px-5 py-3 bg-off-white text-near-black hover:bg-white transition-colors text-xs font-sans font-semibold uppercase tracking-[0.2em] cursor-pointer mt-1"
                    >
                      <span>EXPLORE {col.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-signature group-hover/cta:translate-x-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT ROSTER: EXPANSIVE ARCHITECTURAL CHAPTERS */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col divide-y divide-near-black/10 border-y border-near-black/10">
          {dept.collections.map((col, colIdx) => {
            const isCurrent = activeIndex === colIdx;
            const formattedNumber = String(colIdx + 1).padStart(2, "0");
            const targetShopHref = `/shop?department=${encodeURIComponent(dept.slug)}&collection=${encodeURIComponent(col.slug)}`;

            return (
              <div
                key={`${col.id || col.slug}-${colIdx}`}
                ref={(el) => {
                  itemRefs.current[colIdx] = el;
                }}
                role="button"
                tabIndex={0}
                data-cursor-interactive="true"
                onClick={() => setActiveIndex(colIdx)}
                onMouseEnter={() => setActiveIndex(colIdx)}
                className={`group relative flex flex-col gap-4 py-12 sm:py-16 lg:py-20 px-6 sm:px-10 border-l-2 transition-colors duration-300 cursor-pointer ${
                  isCurrent
                    ? "bg-near-black/[0.035] border-near-black"
                    : "border-transparent hover:bg-near-black/1.5"
                }`}
              >
                {/* Top Line: Number & Capsule Indicator */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.24em] text-brand-gray">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold transition-colors duration-300 ${
                        isCurrent ? "text-near-black font-bold" : "text-brand-gray"
                      }`}
                    >
                      [{formattedNumber}]
                    </span>
                    <span className="w-5 h-px bg-near-black/25" />
                    <span className="text-near-black/70">{dept.name} CAPSULE</span>
                  </div>

                  <span className="hidden sm:inline-block text-[10px] text-brand-gray/60 font-mono tracking-[0.2em]">
                    {col.product_count > 0 ? `${col.product_count} EDITIONS` : "CURATED"}
                  </span>
                </div>

                {/* Main Title Row */}
                <Link
                  href={targetShopHref}
                  className="flex items-baseline justify-between gap-4 cursor-pointer pt-1"
                >
                  <h3
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-light uppercase tracking-tight leading-[0.95] transition-colors duration-300 ${
                      isCurrent
                        ? "text-near-black"
                        : "text-near-black/70 group-hover:text-near-black"
                    }`}
                  >
                    {col.name}
                  </h3>

                  <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.2em] text-brand-gray group-hover:text-near-black transition-colors shrink-0">
                    <span className="hidden sm:inline-block">EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-signature group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-near-black/80 leading-relaxed font-light max-w-2xl pt-1">
                  {col.description}
                </p>

                {/* Minimalist Axiom Footer */}
                <div className="pt-4 mt-2 border-t border-near-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em]">
                  <div className="flex items-center gap-2 text-brand-gray">
                    <span className="w-1.5 h-1.5 bg-near-black/35 rounded-full" />
                    <span>CURATORIAL STATUS</span>
                  </div>
                  <span className="text-near-black font-medium text-left sm:text-right">
                    {col.product_count > 0 ? `${col.product_count} PIECES REGISTERED` : "ATELIER ARCHIVE"}
                  </span>
                </div>

                {/* Mobile-Only Visual (Stacked below on < lg screens) */}
                <div className="block lg:hidden relative w-full aspect-4/5 max-h-115 bg-near-black border border-near-black/15 overflow-hidden mt-3">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    quality={88}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-near-black/85 via-near-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-off-white flex items-center justify-between">
                    <span>CAPSULE {formattedNumber}</span>
                    <Link
                      href={targetShopHref}
                      className="px-3 py-1.5 bg-off-white text-near-black font-semibold text-[9px] tracking-[0.16em]"
                    >
                      EXPLORE CAPSULE
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CollectionsCatalog({ initialSubCategories }: CollectionsCatalogProps) {
  // Group collections by parent department
  const departmentGroups: DepartmentGroup[] = useMemo(() => {
    const groupsMap = new Map<string, DepartmentGroup>();

    // Define canonical order for primary departments
    const canonicalOrder = ["men", "women", "accessories"];

    initialSubCategories.forEach((col) => {
      const slug = (col.parent_slug || "other").toLowerCase();
      const name = (col.parent_name || "CURATED ARCHIVE").toUpperCase();
      const id = col.parent_id || slug;

      if (!groupsMap.has(slug)) {
        groupsMap.set(slug, {
          id,
          slug,
          name,
          collections: [],
        });
      }
      groupsMap.get(slug)!.collections.push(col);
    });

    // Sort according to canonical order, followed by any custom added departments
    return Array.from(groupsMap.values()).sort((a, b) => {
      const indexA = canonicalOrder.indexOf(a.slug);
      const indexB = canonicalOrder.indexOf(b.slug);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [initialSubCategories]);

  return (
    <div className="w-full flex flex-col gap-24 sm:gap-36">
      {departmentGroups.map((dept, index) => (
        <DepartmentDossierSection
          key={`${dept.id || dept.slug}-${index}`}
          dept={dept}
          deptIndex={index}
        />
      ))}
    </div>
  );
}

