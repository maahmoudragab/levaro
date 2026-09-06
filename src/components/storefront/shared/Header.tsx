"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuOverlay } from "./MenuOverlay";

export interface HeaderProps {
  theme?: "dark" | "light";
}

export function Header({ theme = "dark" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLight = theme === "light";

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 w-full site-padding-x py-8 flex items-center justify-between">
        <div className="site-container flex items-center justify-between w-full">
          {/* Brand Wordmark (Left) */}
          <Link
            href="/"
            className={`text-lg md:text-xl font-display font-bold tracking-[0.28em] uppercase hover:opacity-85 transition-opacity ${
              isLight ? "text-near-black" : "text-off-white"
            }`}
          >
            LÉVARO
          </Link>

          {/* Menu Trigger (Right) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={`group flex items-center gap-3 text-xs uppercase tracking-[0.25em] transition-colors cursor-pointer ${
              isLight ? "text-near-black hover:text-brand-gray" : "text-off-white hover:text-brand-gray"
            }`}
            aria-label="Open Navigation Menu"
          >
            <span className="relative overflow-hidden inline-block">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                MENU
              </span>
              <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-brand-gray">
                MENU
              </span>
            </span>
            <div className="w-5 flex flex-col items-end gap-1.5">
              <span
                className={`h-[1px] w-5 group-hover:w-3 transition-all duration-300 ${
                  isLight ? "bg-near-black" : "bg-off-white"
                }`}
              />
              <span
                className={`h-[1px] w-3 group-hover:w-5 transition-all duration-300 ${
                  isLight ? "bg-near-black" : "bg-off-white"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
