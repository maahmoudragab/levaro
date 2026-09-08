import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative w-full bg-near-black text-off-white site-padding-x section-py border-t border-off-white/10 transition-colors duration-500 overflow-hidden"
    >
      <div className="site-container flex flex-col gap-16 sm:gap-24">
        
        {/* 1. TOP ROW: ATELIER IDENTITY & CURATORIAL INQUIRIES */}
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

          {/* Right Column: Curatorial Inquiries */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between lg:pl-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-brand-gray font-semibold">
                CURATORIAL DESK &bull; INQUIRIES
              </span>
              <p className="text-xs uppercase font-sans tracking-[0.16em] text-off-white/80 leading-relaxed max-w-md">
                Inquire regarding architectural specifications, private salon viewings, or curatorial collaborations.
              </p>
            </div>

            <a
              href="mailto:curator@levaro.store"
              className="group inline-flex items-center gap-3.5 px-7 py-3.5 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.24em] font-semibold transition-all duration-300 hover:bg-white cursor-pointer w-fit"
            >
              <Mail className="w-4 h-4" />
              <span>EMAIL CURATORIAL DESK</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 2. MIDDLE ROW: NAVIGATION & CLIENT SERVICES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 pb-16 border-b border-off-white/10 text-xs font-sans tracking-[0.2em]">
          {/* Col 1: Shop */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              SHOP &amp; ARCHIVE
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <Link href="/new-arrivals" className="hover:text-off-white transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
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

          {/* Col 2: The House */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              THE HOUSE
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <Link href="/about" className="hover:text-off-white transition-colors">
                  THE HOUSE &amp; MANIFESTO
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-off-white transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/men-noir-collection" className="hover:text-off-white transition-colors">
                  MEN NOIR COLLECTION
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-off-white transition-colors">
                  COLLECTIONS &amp; SUB-CATEGORIES
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-off-white transition-colors">
                  COMPLETE ARCHIVE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Services & Legal (Zero Admin Link) */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              CLIENT &amp; LEGAL
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80">
              <li>
                <Link href="/faq" className="hover:text-off-white transition-colors">
                  FREQUENT INQUIRIES (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-off-white transition-colors">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-off-white transition-colors">
                  TERMS &amp; CONDITIONS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Presence & Direct Contact */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-gray font-semibold">
              PRESENCE &amp; ATELIER
            </span>
            <ul className="flex flex-col gap-2.5 text-off-white/80 text-[11px] font-sans">
              <li>
                <a
                  href="https://www.instagram.com/maahmoudragab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/maahmoudragab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1BnB3opvXz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors"
                >
                  <span>FACEBOOK</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/maahmoudragab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors"
                >
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:maaahmoudragab@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-off-white transition-colors"
                >
                  <span>DIRECT DESK</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/201158480351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-off-white hover:underline transition-colors"
                >
                  <span>TEL: 01158480351</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM ROW: MONUMENTAL LÉVARO EMBLEM, WORDMARK & LEGAL LINKS */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 pt-4">
          {/* Centered Transparent Luxury Emblem */}
          <Link
            href="/"
            className="group relative w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-500 ease-signature hover:scale-105 cursor-pointer"
            aria-label="LÉVARO Home"
          >
            <Image
              src="/images/logo-without-background.png"
              alt="LÉVARO Emblem"
              fill
              sizes="(max-width: 640px) 64px, 80px"
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>

          {/* Monumental Architectural Wordmark */}
          <div className="w-full text-center overflow-hidden">
            <span className="text-[16vw] font-display font-light uppercase tracking-[0.08em] leading-none text-off-white/90 block hover:text-off-white transition-colors select-none">
              LÉVARO
            </span>
          </div>

          {/* Bottom Copyright & Direct Legal Shortcuts */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-off-white/10 text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.22em] text-brand-gray">
            <span>&copy; {currentYear} LÉVARO. FOUNDED BY MAHMOUD RAGAB. ALL RIGHTS RESERVED.</span>

            <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-[9px] tracking-[0.2em]">
              <Link href="/privacy" className="hover:text-off-white transition-colors">
                PRIVACY
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-off-white transition-colors">
                TERMS
              </Link>
              <span>&bull;</span>
              <Link href="/faq" className="hover:text-off-white transition-colors">
                FAQ
              </Link>
              <span>&bull;</span>
              <span>PEOPLE IN MOTION</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
