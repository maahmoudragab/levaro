"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";

export function NotFoundActions() {
  const triggerCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 w-full">
      {/* 1. Explore Complete Archive */}
      <Link
        href="/shop"
        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.24em] font-semibold hover:bg-white transition-all duration-300 shadow-xl cursor-pointer w-full sm:w-auto"
      >
        <span>EXPLORE COMPLETE ARCHIVE</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* 2. Instant Search Command Palette Trigger */}
      <button
        type="button"
        onClick={triggerCommandPalette}
        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-charcoal/60 border border-off-white/30 text-off-white text-xs uppercase font-sans tracking-[0.24em] hover:border-off-white hover:bg-charcoal transition-all duration-300 cursor-pointer w-full sm:w-auto"
        aria-label="Search archive editions"
      >
        <Search className="w-3.5 h-3.5 text-brand-gray group-hover:text-off-white transition-colors" />
        <span>SEARCH EDITIONS</span>
        <kbd className="px-1.5 py-0.5 border border-off-white/20 text-[9px] font-mono tracking-widest text-brand-gray group-hover:border-off-white/40 group-hover:text-off-white transition-colors">
          ⌘K
        </kbd>
      </button>

      {/* 3. The House Manifesto */}
      <Link
        href="/about"
        className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent border border-off-white/20 text-off-white text-xs uppercase font-sans tracking-[0.24em] hover:border-off-white transition-all duration-300 cursor-pointer w-full sm:w-auto"
      >
        <span>HOUSE MANIFESTO</span>
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>
    </div>
  );
}
