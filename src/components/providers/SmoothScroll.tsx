"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register GSAP ScrollTrigger & Signature Luxury Easing
    gsap.registerPlugin(ScrollTrigger);
    registerSignatureEase();

    // Lightweight responsive Lenis: direct tracking while scrolling, smooth glide after release
    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.0,
      allowNestedScroll: true,
    });

    // Expose lenis instance globally for frictionless menu freeze/unfreeze
    window.__lenis = lenis;

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    // Automatically update scroll dimensions and limits when dynamic content expands (e.g. infinite scroll pagination)
    let resizeTimer: number | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined" && document.body) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimer) {
        cancelAnimationFrame(resizeTimer);
      }
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      window.__lenis = undefined;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
