"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerRef = useRef<HTMLElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const colsGridRef = useRef<HTMLDivElement>(null);
  const bottomWordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSignatureEase();

    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 85%",
          once: true,
        },
      });

      if (topRowRef.current) {
        tl.fromTo(
          topRowRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: SIGNATURE_EASE }
        );
      }

      if (colsGridRef.current) {
        tl.fromTo(
          Array.from(colsGridRef.current.children),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: SIGNATURE_EASE },
          "-=0.5"
        );
      }

      if (bottomWordmarkRef.current) {
        tl.fromTo(
          bottomWordmarkRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: SIGNATURE_EASE },
          "-=0.4"
        );
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative w-full bg-near-black text-off-white site-padding-x section-py border-t border-off-white/10 transition-colors duration-500 overflow-hidden"
    >
      <div className="site-container flex flex-col gap-16 sm:gap-24">
        
        {/* 1. TOP ROW: ARCHIVE NOTIFICATIONS & DIRECT WHATSAPP CONCIERGE */}
        <div ref={topRowRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-off-white/10 items-start">
          {/* Left Column: Private Releases */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-brand-gray font-semibold">
              EARLY ACCESS
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-light uppercase tracking-tight text-off-white leading-tight">
              NEVER MISS <br />
              <span className="font-light text-off-white">A NEW DROP</span>
            </h3>

            <p className="text-xs uppercase font-sans tracking-[0.16em] text-brand-gray max-w-md leading-relaxed">
              Get direct notification when new pieces and seasonal collections go live.
            </p>

            {/* Minimal Input Line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you. You are enrolled for new drop notifications.");
              }}
              className="mt-4 flex items-center border-b border-off-white/30 max-w-md pb-2 focus-within:border-off-white transition-colors"
            >
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-transparent text-xs uppercase font-sans tracking-[0.2em] text-off-white placeholder:text-brand-gray/60 outline-none"
              />
              <button
                type="submit"
                className="text-xs uppercase font-sans tracking-[0.25em] text-off-white hover:text-brand-gray font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>JOIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Column: WhatsApp Concierge Inquiries */}
          <div className="lg:col-span-6 flex flex-col gap-6 justify-between lg:pl-10">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-brand-gray font-semibold">
                CUSTOMER CARE &bull; WHATSAPP
              </span>
              <p className="text-xs uppercase font-sans tracking-[0.16em] text-off-white/80 leading-relaxed max-w-md">
                Have questions about sizing, fit, or orders? Our concierge team is ready on WhatsApp with direct support.
              </p>
            </div>

            <a
              href="https://wa.me/?text=Hello%20L%C3%89VARO,%20I%20have%20a%20question%20about%20your%20pieces."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-8 py-4 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.26em] font-semibold transition-all duration-300 hover:bg-off-white/90 shadow-xl cursor-pointer w-fit"
            >
              <MessageSquare className="w-4 h-4" />
              <span>MESSAGE ON WHATSAPP</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 2. MIDDLE ROW: NAVIGATION & ESSENTIAL COLUMNS */}
        <div ref={colsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 pb-16 border-b border-off-white/10 text-xs font-sans tracking-[0.2em]">
          {/* Col 1: Shop */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              SHOP
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <Link href="/shop?department=men" className="hover:text-off-white transition-colors">
                  MEN
                </Link>
              </li>
              <li>
                <Link href="/shop?department=women" className="hover:text-off-white transition-colors">
                  WOMEN
                </Link>
              </li>
              <li>
                <Link href="/shop?department=accessories" className="hover:text-off-white transition-colors">
                  ACCESSORIES
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-off-white transition-colors">
                  ALL EDITIONS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Collections */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              COLLECTIONS
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <Link href="/about" className="hover:text-off-white transition-colors">
                  THE HOUSE &amp; MANIFESTO
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-off-white transition-colors">
                  MOTION &amp; SHIFT
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-off-white transition-colors">
                  VIEW ALL COLLECTIONS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Relations */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              HELP &amp; INFO
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-off-white transition-colors">
                  WHATSAPP CONCIERGE
                </a>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-off-white transition-colors">
                  SHIPPING &amp; TRANSIT
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-off-white transition-colors">
                  ATELIER DASHBOARD
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social & Presence */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              CONNECT
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors">
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors">
                  <span>THREADS</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM ROW: MONUMENTAL LÉVARO WORDMARK */}
        <div ref={bottomWordmarkRef} className="flex flex-col gap-8">
          {/* Monumental Architectural Wordmark */}
          <div className="w-full text-center overflow-hidden">
            <span className="text-[16vw] font-display font-light uppercase tracking-[0.08em] leading-none text-off-white/90 block hover:text-off-white transition-colors">
              LÉVARO
            </span>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-off-white/10 text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.26em] text-brand-gray">
            <span>&copy; {currentYear} LÉVARO. ALL RIGHTS RESERVED.</span>

            <div className="flex items-center gap-6">
              <span>MADE FOR PEOPLE IN MOTION</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
