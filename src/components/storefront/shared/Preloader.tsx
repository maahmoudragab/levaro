"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";

interface PreloaderProps {
  onComplete?: () => void;
  images?: string[];
  title?: string;
  tagline?: string;
}

export function Preloader({
  onComplete,
  images = [],
  title = "LÉVARO",
  tagline = "INITIALIZING ENVIRONMENT",
}: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const counter = counterRef.current;
    const line = lineRef.current;
    const brand = brandRef.current;

    if (!container || !counter || !line || !brand) return;

    registerSignatureEase();

    gsap.set(container, {
      transformOrigin: "top center",
      force3D: true,
    });

    const mainEl = document.querySelector("main") as HTMLElement | null;
    if (mainEl) {
      // Position the underlying section directly beneath the curtain
      gsap.set(mainEl, { y: () => window.innerHeight, force3D: true });
    }
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";

    let isMounted = true;
    const progress = { value: 0 };
    let targetProgress = 12; // Initial state

    // Function to smoothly update UI values
    const updateUI = (val: number) => {
      if (counter) {
        counter.textContent = Math.floor(val).toString().padStart(2, "0");
      }
      if (line) {
        line.style.width = `${val}%`;
      }
    };

    // Smooth tween that constantly interpolates towards targetProgress
    const progressTween = gsap.to(progress, {
      value: () => targetProgress,
      duration: 0.35,
      ease: "power1.out",
      onUpdate: () => updateUI(progress.value),
    });

    // 1. Collect all critical images (explicit prop + page hero + DOM images)
    const allImagesToLoad = new Set<string>(images);
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      allImagesToLoad.add("/images/hero-background.jpg");
    }
    if (typeof document !== "undefined") {
      const domImages = document.querySelectorAll("img[src]");
      domImages.forEach((img) => {
        const src = (img as HTMLImageElement).src;
        if (src && !src.startsWith("data:") && !src.startsWith("blob:")) {
          allImagesToLoad.add(src);
        }
      });
    }

    const imageList = Array.from(allImagesToLoad);

    // Total tasks: 1 (Window load/ready) + 1 (Fonts) + N (Images decode)
    const totalTasks = 2 + Math.max(1, imageList.length);
    let completedTasks = 0;

    const onTaskComplete = () => {
      if (!isMounted) return;
      completedTasks++;
      // Scale real progress between 15% and 95% based on actual completed assets
      const calculated = Math.min(95, 15 + Math.round((completedTasks / totalTasks) * 80));
      if (calculated > targetProgress) {
        targetProgress = calculated;
        progressTween.invalidate().restart();
      }
    };

    // Task A: Window Load & Subresources (Scripts, Stylesheets, API requests)
    const windowLoadPromise = new Promise<void>((resolve) => {
      if (typeof document !== "undefined" && document.readyState === "complete") {
        onTaskComplete();
        resolve();
      } else if (typeof window !== "undefined") {
        const handleLoad = () => {
          window.removeEventListener("load", handleLoad);
          onTaskComplete();
          resolve();
        };
        window.addEventListener("load", handleLoad);
      } else {
        resolve();
      }
    });

    // Task B: Fonts Readiness (Supreme & Clash Display)
    const fontsPromise = (async () => {
      try {
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }
      } catch {
        // Fallback safely
      } finally {
        onTaskComplete();
      }
    })();

    // Task C: Real Bitmap Image Decoding into GPU Memory
    const imagesPromise = (async () => {
      if (imageList.length === 0) {
        onTaskComplete();
        return;
      }

      const decodeImage = (src: string) =>
        new Promise<void>((resolve) => {
          if (typeof window === "undefined") {
            resolve();
            return;
          }
          const img = new window.Image();
          img.src = src;
          if (img.decode) {
            img
              .decode()
              .then(() => {
                onTaskComplete();
                resolve();
              })
              .catch(() => {
                onTaskComplete();
                resolve();
              });
          } else {
            img.onload = () => {
              onTaskComplete();
              resolve();
            };
            img.onerror = () => {
              onTaskComplete();
              resolve();
            };
          }
        });

      await Promise.all(imageList.map(decodeImage));
    })();

    // Task D: Minimum aesthetic duration (800ms) to ensure smooth transition even if cached
    const minTimePromise = new Promise<void>((resolve) => setTimeout(resolve, 800));

    // Wait for ALL real assets + window load + fonts + images + minimum timer
    Promise.all([windowLoadPromise, fontsPromise, imagesPromise, minTimePromise]).then(() => {
      if (!isMounted) return;

      progressTween.kill();

      const finishTl = gsap.timeline();

      // 1. Rapid smooth completion to 100%
      finishTl.to(progress, {
        value: 100,
        duration: 0.25,
        ease: "power2.out",
        onUpdate: () => updateUI(progress.value),
      });

      // 2. Brief visual hold on 100%
      finishTl.to({}, { duration: 0.08 });

      // 3. Fade out progress line & counter
      finishTl.to([counter, line], {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });

      // 4. Fire curtain lifting event right before push begins
      finishTl.add(() => {
        window.dispatchEvent(new CustomEvent("preloaderCurtainLifting"));
      });

      // 5. THE MASTER SHRINK & PUSH REVEAL:
      // The top of the curtain remains pinned at top: 0.
      // The bottom of the curtain collapses/shrinks upwards onto the top (scaleY: 0),
      // while the section below rises from 100vh to 0vh in exact physical synchrony.
      const pushDuration = 1.15;

      // Curtain collapses/shrinks upwards to top edge
      finishTl.to(
        container,
        {
          scaleY: 0,
          duration: pushDuration,
          ease: SIGNATURE_EASE,
          force3D: true,
        },
        "push"
      );

      // Section below pushes upwards in exact lockstep
      if (mainEl) {
        finishTl.to(
          mainEl,
          {
            y: 0,
            duration: pushDuration,
            ease: SIGNATURE_EASE,
            force3D: true,
          },
          "push"
        );
      }

      // Brand title fades cleanly as the curtain compresses into the ceiling
      finishTl.to(
        brand,
        {
          opacity: 0,
          y: -25,
          duration: pushDuration * 0.45,
          ease: "power2.in",
          force3D: true,
        },
        "push"
      );

      // 6. Complete and clean up
      finishTl.add(() => {
        if (mainEl) {
          gsap.set(mainEl, { clearProps: "transform" });
        }
        document.body.style.overflow = "";
        if (typeof window !== "undefined") {
          (window as unknown as { __preloaderDone: boolean }).__preloaderDone = true;
          window.__lenis?.start();
          gsap.registerPlugin(ScrollTrigger);
          ScrollTrigger.refresh();
        }
        window.dispatchEvent(new CustomEvent("preloaderComplete"));
        setIsFinished(true);
        onComplete?.();
      });
    });

    return () => {
      isMounted = false;
      progressTween.kill();
      if (mainEl) {
        gsap.set(mainEl, { clearProps: "transform" });
      }
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [images, onComplete]);

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-near-black text-off-white flex flex-col justify-between p-8 md:p-20 select-none gpu border-b border-off-white/15 shadow-2xl origin-top overflow-hidden"
      style={{ willChange: "transform" }}
    >
      {/* Top telemetry */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-brand-gray font-mono">
        <span>LÉVARO ARCHIVE</span>
        <span>{tagline}</span>
      </div>

      {/* Center Brand Title */}
      <div className="my-auto text-center">
        <h1
          ref={brandRef}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.35em] uppercase text-off-white"
          style={{ willChange: "transform, opacity" }}
        >
          {title}
        </h1>
      </div>

      {/* Bottom Progress Bar & Counter */}
      <div className="flex flex-col gap-4">
        <div className="w-full h-[1px] bg-charcoal relative overflow-hidden">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 bg-off-white w-0"
            style={{ willChange: "width" }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-mono tracking-[0.25em] text-brand-gray uppercase">
          <span>DECODING ASSETS &amp; ENVIRONMENT</span>
          <div>
            <span ref={counterRef} className="text-off-white">
              00
            </span>
            <span>%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
