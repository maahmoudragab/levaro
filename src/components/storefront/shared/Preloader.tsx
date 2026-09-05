"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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
      allImagesToLoad.add("/images/hero background.jpg");
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

      const finishTl = gsap.timeline({
        onComplete: () => {
          // Luxury curtain reveal once 100% is reached
          gsap.to(container, {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
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

      // Rapid smooth completion to 100%
      finishTl.to(progress, {
        value: 100,
        duration: 0.25,
        ease: "power2.out",
        onUpdate: () => updateUI(progress.value),
      });

      // Fade out brand text right before curtain lifts
      finishTl.to(
        [brand, counter],
        {
          opacity: 0,
          y: -15,
          duration: 0.2,
          ease: "power2.in",
          force3D: true,
        },
        "-=0.1"
      );
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
