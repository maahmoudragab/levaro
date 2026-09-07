import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative w-full bg-near-black text-off-white site-padding-x section-py border-t border-off-white/10 transition-colors duration-500 overflow-hidden"
    >
      <div className="site-container flex flex-col gap-16 sm:gap-24">
        
        {/* 1. TOP ROW: ATELIER IDENTITY & DIRECT WHATSAPP CONCIERGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-off-white/10 items-start">
          {/* Left Column: Brand Philosophy */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-brand-gray font-semibold">
              ATELIER ARCHIVE
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-light uppercase tracking-tight text-off-white leading-tight">
              SCULPTURAL FORM. <br />
              <span className="font-light text-brand-gray">DISCIPLINED LUXURY.</span>
            </h3>

            <p className="text-xs uppercase font-sans tracking-[0.16em] text-brand-gray max-w-md leading-relaxed">
              Every edition is produced in numbered runs with bespoke textiles and architectural silhouettes.
            </p>
          </div>

          {/* Right Column: Direct WhatsApp Concierge */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between lg:pl-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-brand-gray font-semibold">
                DIRECT CONCIERGE &bull; WHATSAPP
              </span>
              <p className="text-xs uppercase font-sans tracking-[0.16em] text-off-white/80 leading-relaxed max-w-md">
                Inquire about sizing, fit specifications, or private appointments directly with the atelier team.
              </p>
            </div>

            <a
              href="https://wa.me/?text=Hello%20L%C3%89VARO,%20I%20have%20an%20inquiry%20regarding%20your%20pieces."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3.5 px-7 py-3.5 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.24em] font-semibold transition-all duration-300 hover:bg-white cursor-pointer w-fit"
            >
              <MessageSquare className="w-4 h-4" />
              <span>MESSAGE ON WHATSAPP</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 2. MIDDLE ROW: NAVIGATION & ESSENTIAL COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 pb-16 border-b border-off-white/10 text-xs font-sans tracking-[0.2em]">
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
                <Link href="/shop?collection=motion" className="hover:text-off-white transition-colors">
                  MOTION (AW26)
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=shift" className="hover:text-off-white transition-colors">
                  SHIFT (W26)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-off-white transition-colors">
                  COMPLETE ARCHIVE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Relations */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              ATELIER
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-off-white transition-colors">
                  CONCIERGE DESK
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-off-white transition-colors">
                  MATERIALS &amp; CRAFT
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-off-white transition-colors">
                  ADMINISTRATION
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social & Presence */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              PRESENCE
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
        <div className="flex flex-col gap-8">
          {/* Monumental Architectural Wordmark */}
          <div className="w-full text-center overflow-hidden">
            <span className="text-[16vw] font-display font-light uppercase tracking-[0.08em] leading-none text-off-white/90 block hover:text-off-white transition-colors select-none">
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
