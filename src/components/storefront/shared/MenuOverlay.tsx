"use client";

import { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [isRendered, setIsRendered] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsRendered(true);
    }
  }

  const overlayRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const sublinksPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  // Mount/Unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      window.__lenis?.stop();
    }
  }, [isOpen]);

  // Synchronous layout effect for GSAP entrance
  useIsomorphicLayoutEffect(() => {
    if (!isRendered || isClosingRef.current || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const sublinksPanel = sublinksPanelRef.current;
    const navElements = navItemsRef.current.filter(Boolean);

    // Initial GPU state
    gsap.set(overlay, {
      clipPath: "circle(0% at calc(100% - 80px) 45px)",
      force3D: true,
    });

    if (header && footer) {
      gsap.set([header, footer], { opacity: 0, force3D: true });
    }

    if (sublinksPanel) {
      gsap.set(sublinksPanel, { opacity: 0, x: 15, force3D: true });
    }

    if (navElements.length > 0) {
      gsap.set(navElements, { y: 20, opacity: 0, force3D: true });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
    });

    // 1. Bubble Expansion
    tl.to(overlay, {
      clipPath: "circle(160% at calc(100% - 80px) 45px)",
      duration: 0.65,
      ease: "power4.inOut",
      force3D: true,
    });

    // 2. Header reveal
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

    // 4. Sublinks panel & Footer reveal
    if (sublinksPanel) {
      tl.to(
        sublinksPanel,
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
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
    const sublinksPanel = sublinksPanelRef.current;
    const navElements = navItemsRef.current.filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRendered(false);
        isClosingRef.current = false;
        window.__lenis?.start();
        onClose();
      },
    });

    tl.to([navElements, sublinksPanel, header, footer], {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      force3D: true,
    });

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

  // Gentle hover switch for right-side sublinks
  const handleHover = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        setActiveIndex(index);
        if (sublinksPanelRef.current) {
          gsap.fromTo(
            sublinksPanelRef.current,
            { opacity: 0.5, y: 6 },
            { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }
          );
        }
      }
    },
    [activeIndex]
  );

  if (!isRendered) return null;

  const currentItem = MENU_ITEMS[activeIndex] || MENU_ITEMS[0];

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
      {/* Top Header */}
      <div
        ref={headerRef}
        className="w-full site-padding-x py-6 sm:py-8 relative z-20 opacity-0"
        style={{ willChange: "opacity" }}
      >
        <div className="site-container flex items-center justify-between w-full">
          <Link
            href="/"
            onClick={handleClose}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
            aria-label="LÉVARO Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-500 ease-signature group-hover:scale-105">
              <Image
                src="/images/logo-without-background.png"
                alt="LÉVARO"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="text-lg md:text-xl font-display font-bold tracking-[0.28em] text-off-white uppercase hover:opacity-85 transition-opacity">
              LÉVARO
            </span>
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

      {/* Main Content: Left Main Chapters + Right Pure Sublinks */}
      <div className="w-full site-padding-x my-auto py-4 overflow-y-auto max-h-[78vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center site-container">
          
          {/* Left Side: Primary Navigation Chapters */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <nav className="flex flex-col space-y-3 sm:space-y-4">
              {MENU_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div key={item.id} className="flex flex-col">
                    <Link
                      ref={(el) => {
                        navItemsRef.current[index] = el;
                      }}
                      href={item.href}
                      onClick={(e) => {
                        if (item.href === "#search") {
                          e.preventDefault();
                          handleClose();
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent("open-command-palette"));
                          }, 350);
                          return;
                        }
                        handleClose();
                      }}
                      onMouseEnter={() => handleHover(index)}
                      className="group relative flex items-baseline justify-between py-1 transition-colors duration-200 cursor-pointer opacity-0 gpu"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span
                          className={`text-xs font-mono tracking-[0.2em] transition-colors duration-200 ${
                            isActive ? "text-off-white" : "text-brand-gray/40 group-hover:text-brand-gray"
                          }`}
                        >
                          {item.number}
                        </span>
                        <span
                          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight uppercase transition-all duration-200 ${
                            isActive
                              ? "text-off-white translate-x-2 font-normal"
                              : "text-off-white/35 group-hover:text-off-white/80 group-hover:translate-x-1"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>

                    {/* Mobile Sublinks: simple clean list under active/tapped item on small screens */}
                    <div className="flex lg:hidden flex-col space-y-2 pt-2 pb-3 pl-8 sm:pl-10">
                      {item.sublinks?.map((sub, sIdx) => {
                        if (sub.isAction) {
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                handleClose();
                                setTimeout(() => {
                                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                                }, 350);
                              }}
                              className="text-[10px] uppercase font-sans tracking-[0.2em] text-off-white/70 hover:text-off-white text-left cursor-pointer"
                            >
                              &rarr; {sub.label}
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            onClick={handleClose}
                            className="text-[10px] uppercase font-sans tracking-[0.2em] text-off-white/70 hover:text-off-white"
                          >
                            &rarr; {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Ultra-Clean Typographic Sublinks (Zero Boxes, Pure Space) */}
          <div
            ref={sublinksPanelRef}
            className="hidden lg:flex lg:col-span-5 flex-col justify-center pl-10 xl:pl-16 border-l border-off-white/10 min-h-[340px] opacity-0 gpu"
            style={{ willChange: "opacity, transform" }}
          >
            {/* Active Chapter indicator */}
            <div className="text-[10px] font-mono tracking-[0.28em] text-brand-gray uppercase mb-8">
              {`${currentItem.number} // ${currentItem.label}`}
            </div>

            {/* Clean Vertical Sublinks List */}
            <div className="flex flex-col space-y-4">
              {currentItem.sublinks?.map((sub, i) => {
                if (sub.isAction) {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handleClose();
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent("open-command-palette"));
                        }, 350);
                      }}
                      className="group flex items-center justify-between py-1 text-left cursor-pointer w-full text-off-white/60 hover:text-off-white transition-colors"
                    >
                      <span className="text-sm font-sans tracking-[0.22em] uppercase">
                        {sub.label}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-brand-gray group-hover:text-off-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  );
                }

                return (
                  <Link
                    key={i}
                    href={sub.href}
                    onClick={handleClose}
                    className="group flex items-center justify-between py-1 text-off-white/60 hover:text-off-white transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-sans tracking-[0.22em] uppercase">
                      {sub.label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-gray group-hover:text-off-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Minimal Footer */}
      <div
        ref={footerRef}
        className="w-full site-padding-x py-6 border-t border-charcoal/80 text-[10px] uppercase font-sans tracking-[0.22em] text-brand-gray opacity-0"
        style={{ willChange: "opacity" }}
      >
        <div className="site-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <span>ATELIER ARCHIVE &bull; CURATORIAL DESK</span>
          <div className="flex items-center gap-6 text-[9.5px]">
            <Link href="/faq" onClick={handleClose} className="hover:text-off-white transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" onClick={handleClose} className="hover:text-off-white transition-colors">
              PRIVACY
            </Link>
            <Link href="/terms" onClick={handleClose} className="hover:text-off-white transition-colors">
              TERMS
            </Link>
            <span>&copy; {new Date().getFullYear()} LÉVARO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
