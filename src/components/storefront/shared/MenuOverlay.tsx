"use client";

import { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

import { MENU_ITEMS } from "@/data/storefront";

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRendered, setIsRendered] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const imagePreviewRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  // Mount/Unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      isClosingRef.current = false;
      window.__lenis?.stop();
    }
  }, [isOpen]);

  // Synchronous layout effect for 100% flicker-free GSAP entrance
  useIsomorphicLayoutEffect(() => {
    if (!isRendered || isClosingRef.current || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const imageContainer = imagePreviewRef.current;
    const navElements = navItemsRef.current.filter(Boolean);

    // Initial GPU state
    gsap.set(overlay, {
      clipPath: "circle(0% at calc(100% - 80px) 45px)",
      force3D: true,
    });

    if (header && footer) {
      gsap.set([header, footer], { opacity: 0, force3D: true });
    }

    if (imageContainer) {
      gsap.set(imageContainer, { opacity: 0, scale: 0.98, force3D: true });
    }

    if (navElements.length > 0) {
      gsap.set(navElements, { y: 20, opacity: 0, force3D: true });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
    });

    // 1. Bubble Expansion originating exactly from the Menu/Close button
    tl.to(overlay, {
      clipPath: "circle(160% at calc(100% - 80px) 45px)",
      duration: 0.65,
      ease: "power4.inOut",
      force3D: true,
    });

    // 2. Header reveal immediately
    if (header) {
      tl.to(
        header,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.55"
      );
    }

    // 3. Stagger Navigation Links
    tl.to(
      navElements,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.035,
        ease: "power3.out",
        force3D: true,
      },
      "-=0.35"
    );

    // 4. Image preview & Footer reveal
    if (imageContainer) {
      tl.to(
        imageContainer,
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          force3D: true,
        },
        "-=0.4"
      );
    }

    if (footer) {
      tl.to(
        footer,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.4"
      );
    }

    return () => {
      tl.kill();
    };
  }, [isRendered]);

  // Smooth Closing Bubble Deflation
  const handleClose = useCallback(() => {
    if (isClosingRef.current || !overlayRef.current) return;
    isClosingRef.current = true;

    const overlay = overlayRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const imageContainer = imagePreviewRef.current;
    const navElements = navItemsRef.current.filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRendered(false);
        isClosingRef.current = false;
        window.__lenis?.start();
        onClose();
      },
    });

    // Fade content out immediately
    tl.to([navElements, imageContainer, header, footer], {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      force3D: true,
    });

    // Bubble shrink back into button position
    tl.to(
      overlay,
      {
        clipPath: "circle(0% at calc(100% - 80px) 45px)",
        duration: 0.4,
        ease: "power4.inOut",
        force3D: true,
      },
      "-=0.06"
    );
  }, [onClose]);

  // Instant 0ms hover response
  const handleHover = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  if (!isRendered) return null;

  const currentItem = MENU_ITEMS[activeIndex];

  return (
    <div
      ref={overlayRef}
      data-cursor-menu="true"
      className="fixed inset-0 z-50 bg-near-black text-off-white flex flex-col justify-between overflow-hidden gpu"
      style={{
        clipPath: "circle(0% at calc(100% - 80px) 45px)",
        willChange: "clip-path",
      }}
    >
      {/* Top Header inside overlay */}
      <div
        ref={headerRef}
        className="w-full site-padding-x py-8 relative z-20 opacity-0"
        style={{ willChange: "opacity" }}
      >
        <div className="site-container flex items-center justify-between w-full">
          <Link
            href="/"
            onClick={handleClose}
            className="text-lg md:text-xl font-display font-bold tracking-[0.28em] text-off-white uppercase hover:opacity-85 transition-opacity"
          >
            LÉVARO
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-off-white hover:text-brand-gray transition-colors duration-200 cursor-pointer"
            aria-label="Close Menu"
          >
            <span className="relative overflow-hidden inline-block">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                CLOSE
              </span>
              <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-brand-gray">
                CLOSE
              </span>
            </span>
            <div className="w-5 h-5 flex items-center justify-center">
              <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Links + Right Image Showcase */}
      <div className="w-full site-padding-x my-auto py-2 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center site-container">
          {/* Left Side: Navigation Links */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <nav className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
              {MENU_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={item.id}
                    ref={(el) => {
                      navItemsRef.current[index] = el;
                    }}
                    href={item.href}
                    onClick={handleClose}
                    onMouseEnter={() => handleHover(index)}
                    className="group relative flex items-baseline justify-between border-b border-charcoal/40 pb-3 sm:pb-4 transition-colors duration-200 hover:border-off-white/40 cursor-pointer opacity-0 gpu"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="text-xs uppercase font-sans tracking-[0.2em] text-brand-gray group-hover:text-off-white transition-colors duration-200">
                        {item.number}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight uppercase transition-transform duration-200 ${
                            isActive
                              ? "text-off-white translate-x-2 font-normal"
                              : "text-off-white/50 group-hover:text-off-white group-hover:translate-x-2"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.25em] text-brand-gray mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ArrowUpRight
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isActive
                            ? "opacity-100 translate-x-0 translate-y-0 text-off-white"
                            : "opacity-0 -translate-x-2 translate-y-2 text-brand-gray group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: High-Performance Single-Node Showcase */}
          <div
            ref={imagePreviewRef}
            className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative opacity-0 gpu"
            style={{ willChange: "opacity, transform" }}
          >
            <div className="relative w-full aspect-[4/5] max-w-sm bg-charcoal overflow-hidden border border-off-white/10">
              {/* Single Native Image Node (Zero Re-renders / Zero Duplicate DOM) */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/hero background.jpg"
                  alt="LÉVARO Archive Preview"
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 1200px) 50vw, 500px"
                  className="object-cover object-top transition-transform duration-500 ease-out hover:scale-102"
                />
                {/* Subtle grading overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/20 to-transparent" />
              </div>

              {/* Dynamic Metadata Card */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1 z-20 border-t border-off-white/10 bg-near-black/90">
                <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.25em] text-brand-gray">
                  <span>{currentItem.category}</span>
                  <span>{currentItem.season}</span>
                </div>
                <h4 className="text-xs sm:text-sm uppercase font-sans tracking-[0.2em] font-medium text-off-white">
                  {currentItem.label} — {currentItem.number}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info inside overlay */}
      <div
        ref={footerRef}
        className="w-full site-padding-x py-8 border-t border-charcoal/80 text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] text-brand-gray opacity-0"
        style={{ willChange: "opacity" }}
      >
        <div className="site-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-off-white/80" />
            <span>DIRECT ORDERS &amp; INQUIRIES VIA WHATSAPP</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            <span>MEN / WOMEN / ACCESSORIES</span>
            <span>&copy; {new Date().getFullYear()} LÉVARO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
