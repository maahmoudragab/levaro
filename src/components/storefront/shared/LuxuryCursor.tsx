"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LuxuryCursorProps {
  isMenuOpen?: boolean;
}

export function LuxuryCursor({ isMenuOpen = false }: LuxuryCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    // High-performance GSAP quickTo for 144fps tracking without layout thrashing
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });

    let isVisible = false;
    let isHovering = false;

    const setVisibility = (visible: boolean) => {
      if (visible === isVisible) return;
      isVisible = visible;
      if (isVisible) {
        cursor.classList.remove("opacity-0", "scale-50");
        cursor.classList.add("opacity-100", "scale-100");
      } else {
        cursor.classList.remove("opacity-100", "scale-100");
        cursor.classList.add("opacity-0", "scale-50");
      }
    };

    const setHovering = (hovering: boolean) => {
      if (hovering === isHovering) return;
      isHovering = hovering;
      if (isHovering) {
        inner.classList.add("w-12", "h-12", "opacity-80", "rotate-45");
        inner.classList.remove("w-8", "h-8", "opacity-100", "rotate-0");
      } else {
        inner.classList.remove("w-12", "h-12", "opacity-80", "rotate-45");
        inner.classList.add("w-8", "h-8", "opacity-100", "rotate-0");
      }
    };

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          const target = e.target as HTMLElement | null;
          if (!target) return;

          const insideLightSection = !!target.closest(
            "[data-light-section='true'], .bg-off-white, #departments, #collection"
          );
          const insideMenu = isMenuOpen || !!target.closest("[data-cursor-menu='true']");

          setVisibility(insideMenu || insideLightSection);
          setHovering(!!target.closest("a, button, [role='button'], input, select"));
        });
      }
    };

    const handleMouseLeave = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      setVisibility(false);
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
      className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[999] mix-blend-difference select-none transition-all duration-300 ease-out hidden sm:block opacity-0 scale-50"
    >
      {/* Luxury Inverted Geometric Box */}
      <div
        ref={innerRef}
        className="bg-white transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] w-8 h-8 rounded-none opacity-100 rotate-0"
      />
    </div>
  );
}
