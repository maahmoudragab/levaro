"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LuxuryCursorProps {
  isMenuOpen?: boolean;
}

export function LuxuryCursor({ isMenuOpen = false }: LuxuryCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // High-performance GSAP quickTo for 144fps tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      xTo(clientX);
      yTo(clientY);

      // Check if mouse is hovering inside white section OR menu is open
      const target = e.target as HTMLElement | null;
      const insideLightSection = !!target?.closest(
        "[data-light-section='true'], .bg-off-white, #departments, #collection"
      );
      const insideMenu = isMenuOpen || !!target?.closest("[data-cursor-menu='true']");

      if (insideMenu || insideLightSection) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if hovering interactive link/button
      const isInteractive = !!target?.closest("a, button, [role='button'], input, select");
      setIsHoveringLink(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMenuOpen]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[999] mix-blend-difference select-none transition-all duration-300 ease-out hidden sm:block ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
    >
      {/* Luxury Inverted Geometric Box */}
      <div
        className={`bg-white transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isHoveringLink
            ? "w-12 h-12 rounded-none opacity-80 rotate-45"
            : "w-8 h-8 rounded-none opacity-100 rotate-0"
        }`}
      />
    </div>
  );
}
