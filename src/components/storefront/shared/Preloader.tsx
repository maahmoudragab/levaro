"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { SIGNATURE_EASE, registerSignatureEase } from "@/lib/motion";

interface PreloaderProps {
  onComplete?: () => void;
  images?: string[];
  title?: string;
  tagline?: string;
}

export function Preloader({
  onComplete,
  images = [],
  title,
  tagline,
}: PreloaderProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamically resolve title based on destination page or explicit prop
  const displayTitle = useMemo(() => {
    if (title && title !== "LÉVARO") {
      return title;
    }
    if (!pathname || pathname === "/") {
      return "LÉVARO";
    }
    if (pathname.startsWith("/about")) {
      return "THE HOUSE";
    }
    if (pathname.startsWith("/shop/") && pathname !== "/shop") {
      return title || "EDITION";
    }
    if (pathname.startsWith("/shop")) {
      return "CATALOG";
    }
    return title || "LÉVARO";
  }, [pathname, title]);

  // Dynamically resolve tagline based on destination page or explicit prop
  const displayTagline = useMemo(() => {
    if (tagline && tagline !== "INITIALIZING ENVIRONMENT") {
      return tagline;
    }
    if (!pathname || pathname === "/") {
      return "INITIALIZING ENVIRONMENT";
    }
    if (pathname.startsWith("/about")) {
      return "ATELIER MANIFESTO";
    }
    if (pathname.startsWith("/shop/") && pathname !== "/shop") {
      return tagline || "ATELIER SPECIFICATION";
    }
    if (pathname.startsWith("/shop")) {
      return "COMPLETE CATALOG";
    }
    return tagline || "INITIALIZING ENVIRONMENT";
  }, [pathname, tagline]);

  useEffect(() => {
    registerSignatureEase();

    const container = containerRef.current;
    const counter = counterRef.current;
    const line = lineRef.current;
    const brand = brandRef.current;

    if (!container || !counter || !line || !brand) return;

    let isMounted = true;
    const progress = { value: 0 };
    let targetProgress = 15; // Initial starting baseline

    // Smooth UI updater without React re-renders
    const updateUI = (val: number) => {
      const rounded = Math.floor(val);
      if (counter) {
        counter.textContent = rounded.toString().padStart(2, "0");
      }
      if (line) {
        line.style.width = `${rounded}%`;
      }
    };

    // Smooth GSAP tween that continuously interpolates towards targetProgress
    const progressTween = gsap.to(progress, {
      value: () => targetProgress,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => updateUI(progress.value),
    });

    // 1. Gather all critical images
    const allImagesToLoad = new Set<string>(images);
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      allImagesToLoad.add("/images/hero background.jpg");
    }

    const imageList = Array.from(allImagesToLoad);

    // Total units: 1 (Fonts) + 1 (Window load) + N (URL images) + M (DOM images)
    let completedUnits = 0;
    const totalEstimatedUnits = 2 + Math.max(1, imageList.length);

    const markUnitDone = () => {
      if (!isMounted) return;
      completedUnits++;
      const pct = Math.min(94, Math.round((completedUnits / totalEstimatedUnits) * 94));
      if (pct > targetProgress) {
        targetProgress = pct;
        progressTween.invalidate().restart();
      }
    };

    // Task 1: Document DOM & Stylesheet readiness (checks interactive/complete)
    const documentReadyPromise = new Promise<void>((resolve) => {
      if (typeof document !== "undefined" && (document.readyState === "complete" || document.readyState === "interactive")) {
        markUnitDone();
        resolve();
      } else if (typeof window !== "undefined") {
        const onReady = () => {
          window.removeEventListener("DOMContentLoaded", onReady);
          window.removeEventListener("load", onReady);
          markUnitDone();
          resolve();
        };
        window.addEventListener("DOMContentLoaded", onReady);
        window.addEventListener("load", onReady);
      } else {
        resolve();
      }
    });

    // Task 2: Strict Brand Typography Readiness (Supreme & Clash Display)
    const fontsReadyPromise = (async () => {
      try {
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }
      } catch {
        // Fallback safely if browser blocks
      } finally {
        markUnitDone();
      }
    })();

    // Task 3: Deep GPU Bitmap Image Decoding for critical images (capped at 900ms per image)
    const explicitImagesPromise = (async () => {
      if (imageList.length === 0) {
        markUnitDone();
        return;
      }

      const decodeUrl = (src: string) =>
        new Promise<void>((resolve) => {
          if (typeof window === "undefined") {
            resolve();
            return;
          }
          let finished = false;
          const done = () => {
            if (finished) return;
            finished = true;
            markUnitDone();
            resolve();
          };

          // Per-image safety timeout so slow CDN never freezes preloader
          const timer = setTimeout(done, 900);

          const img = new window.Image();
          img.src = src;
          if (img.decode) {
            img
              .decode()
              .then(() => {
                clearTimeout(timer);
                done();
              })
              .catch(() => {
                clearTimeout(timer);
                done();
              });
          } else {
            img.onload = () => {
              clearTimeout(timer);
              done();
            };
            img.onerror = () => {
              clearTimeout(timer);
              done();
            };
          }
        });

      await Promise.all(imageList.map(decodeUrl));
    })();

    // Task 4: Decode all critical <img> elements currently present in the DOM
    const domImagesPromise = (async () => {
      if (typeof document === "undefined") return;
      const domImgs = Array.from(document.querySelectorAll<HTMLImageElement>("img")).slice(0, 4);
      if (domImgs.length === 0) return;

      const decodeElement = (el: HTMLImageElement) =>
        new Promise<void>((resolve) => {
          let finished = false;
          const done = () => {
            if (finished) return;
            finished = true;
            resolve();
          };
          const timer = setTimeout(done, 800);

          if (el.complete && el.naturalWidth > 0) {
            if (el.decode) {
              el.decode().then(() => {
                clearTimeout(timer);
                done();
              }).catch(() => {
                clearTimeout(timer);
                done();
              });
            } else {
              clearTimeout(timer);
              done();
            }
          } else {
            const onEnd = () => {
              el.removeEventListener("load", onEnd);
              el.removeEventListener("error", onEnd);
              if (el.decode) {
                el.decode().then(() => {
                  clearTimeout(timer);
                  done();
                }).catch(() => {
                  clearTimeout(timer);
                  done();
                });
              } else {
                clearTimeout(timer);
                done();
              }
            };
            el.addEventListener("load", onEnd);
            el.addEventListener("error", onEnd);
          }
        });

      await Promise.all(domImgs.map(decodeElement));
    })();

    // Task 5: Snappy minimum duration (400ms) + fast safety ceiling (1500ms max)
    const minTimePromise = new Promise<void>((res) => setTimeout(res, 400));
    const safetyTimeoutPromise = new Promise<void>((res) => setTimeout(res, 1500));

    // Wait for all conditions OR safety timeout
    const assetsAllReady = Promise.all([
      documentReadyPromise,
      fontsReadyPromise,
      explicitImagesPromise,
      domImagesPromise,
      minTimePromise,
    ]);

    Promise.race([assetsAllReady, safetyTimeoutPromise]).then(() => {
      if (!isMounted) return;

      progressTween.kill();

      // Final finishing timeline: smooth ramp to 100%, hold 100% visible, lift curtain
      const finishTl = gsap.timeline({
        onComplete: () => {
          gsap.to(container, {
            yPercent: -100,
            duration: 0.9,
            ease: SIGNATURE_EASE,
            force3D: true,
            onStart: () => {
              window.dispatchEvent(new CustomEvent("preloaderCurtainLifting"));
            },
            onComplete: () => {
              if (typeof window !== "undefined") {
                (window as unknown as { __preloaderDone: boolean }).__preloaderDone = true;
              }
              window.dispatchEvent(new CustomEvent("preloaderComplete"));
              setIsFinished(true);
              onComplete?.();
            },
          });
        },
      });

      // Smooth completion to 100% (counter remains fully visible at 100)
      finishTl.to(progress, {
        value: 100,
        duration: 0.22,
        ease: "power2.out",
        onUpdate: () => updateUI(progress.value),
      });

      // Brief hold (160ms) so 100% is clearly seen before the whole curtain rides up
      finishTl.to({}, { duration: 0.16 });
    });

    return () => {
      isMounted = false;
      progressTween.kill();
    };
  }, [images, onComplete]);

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-near-black text-off-white flex flex-col justify-between p-8 md:p-20 select-none gpu"
      style={{ willChange: "transform" }}
    >
      {/* Top telemetry */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-brand-gray font-mono">
        <span>LÉVARO ARCHIVE</span>
        <span>{displayTagline}</span>
      </div>

      {/* Center Brand Title */}
      <div className="my-auto text-center">
        <h1
          ref={brandRef}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.35em] uppercase text-off-white"
          style={{ willChange: "transform, opacity" }}
        >
          {displayTitle}
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
