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

    // Ultra-lightweight, snappy Lenis: instant response, zero heavy drag
    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
      allowNestedScroll: true,
    });

    // Expose lenis instance globally for frictionless menu freeze/unfreeze
    window.__lenis = lenis;

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Refresh ScrollTrigger and resize Lenis as soon as Preloader curtain lifts
    const onPreloaderDone = () => {
      setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 100);
    };
    window.addEventListener("preloaderComplete", onPreloaderDone);

    // Debounced window resize handler for safe, loop-free recalibration
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onWindowResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("preloaderComplete", onPreloaderDone);
      lenis.destroy();
      window.__lenis = undefined;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
