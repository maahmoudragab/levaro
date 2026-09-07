import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";

export const metadata: Metadata = {
  title: "PRIVACY POLICY // DATA GOVERNANCE — LÉVARO",
  description: "Architectural data governance, privacy protocols, and client confidentiality standards of LÉVARO Atelier.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Functional Real Asset Preloader */}
      <Preloader
        title="PRIVACY"
        tagline="DATA GOVERNANCE PROTOCOLS"
      />

      <LuxuryCursor />

      <SmoothScroll>
        <main className="min-h-screen bg-[#FBF9F6] text-near-black flex flex-col justify-between">
          <Header theme="light" />

          {/* PAGE CONTENT */}
          <div className="w-full site-padding-x pt-28 sm:pt-36 pb-20 sm:pb-28">
            <div className="site-container max-w-4xl space-y-12 sm:space-y-16">
              
              {/* Top Header */}
              <div className="border-b border-near-black/10 pb-8 space-y-3">
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
                  <Link href="/" className="hover:text-near-black transition-colors">
                    HOME
                  </Link>
                  <span>/</span>
                  <span className="text-near-black font-semibold">LEGAL &amp; DATA GOVERNANCE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-light uppercase tracking-tight text-near-black leading-tight">
                  PRIVACY POLICY
                </h1>

                <p className="text-xs uppercase font-mono tracking-[0.18em] text-brand-gray">
                  REVISED ARCHIVE EDITION &bull; AUTUMN 2026
                </p>
              </div>

              {/* Manifesto Introduction */}
              <div className="p-6 sm:p-8 bg-near-black/[0.03] border border-near-black/10 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-near-black font-semibold block">
                  ATELIER CONFIDENTIALITY STATEMENT
                </span>
                <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-near-black/80 leading-relaxed">
                  LÉVARO operates as an architectural design house and curated digital exhibition. We respect the confidentiality of every visitor and collector. This document outlines our disciplined, non-invasive approach to digital data collection, storage, and rights.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="space-y-12 divide-y divide-near-black/10 text-xs sm:text-sm font-sans uppercase tracking-[0.14em] leading-relaxed">
                
                {/* 01 // DATA COLLECTION */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    01 // DATA GOVERNANCE &amp; ACQUISITION
                  </span>
                  <p className="text-near-black/75">
                    We only collect minimal technical data necessary to deliver high-performance visual experiences, typography rendering, and image decoding. We do not sell, license, or monetize visitor information to advertising brokers or commercial data networks.
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-brand-gray text-xs font-mono tracking-[0.12em]">
                    <li>Hardware-accelerated viewport specifications for responsive lookbook scaling.</li>
                    <li>Anonymous session metrics to optimize preloader and image caching sequences.</li>
                    <li>Voluntary correspondence submitted directly through our atelier contact channels.</li>
                  </ul>
                </section>

                {/* 02 // COOKIES & STORAGE */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    02 // DIGITAL STORAGE &amp; COOKIES
                  </span>
                  <p className="text-near-black/75">
                    Our digital catalog utilizes standard browser local storage and essential session cookies strictly to preserve your selected filter criteria, preferred department views, and smooth scroll states. You may clear your browser cache or disable cookies at any time without compromising visual exploration.
                  </p>
                </section>

                {/* 03 // NON-COMMERCIAL EXHIBITION */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    03 // THIRD-PARTY INFRASTRUCTURE
                  </span>
                  <p className="text-near-black/75">
                    Our website is powered by world-class edge infrastructure (Supabase, Vercel, Unsplash CDN) adhering to strict enterprise-grade security protocols, end-to-end encryption (TLS/HTTPS), and GDPR/CCPA regulatory standards.
                  </p>
                </section>

                {/* 04 // VISITOR RIGHTS */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    04 // YOUR RIGHTS &amp; DATA FREEDOM
                  </span>
                  <p className="text-near-black/75">
                    Visitors hold unconstrained rights to request information regarding any stored data, demand immediate erasure of correspondence history, or object to digital analytics. We honor all privacy inquiries without delay.
                  </p>
                </section>

                {/* 05 // CONTACT & INQUIRIES */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    05 // PRIVACY DESK CONTACT
                  </span>
                  <p className="text-near-black/75">
                    For questions regarding data ethics, archive rights, or confidentiality policies, please reach our administrative team at:
                  </p>
                  <div className="p-4 border border-near-black/10 bg-near-black/[0.02] font-mono text-xs uppercase tracking-[0.18em] text-near-black">
                    LÉVARO ATELIER &bull; LEGAL ARCHIVE <br />
                    EMAIL: <span className="text-brand-gray">LEGAL@LEVARO.STORE</span> <br />
                    CAIRO // PRIVATE APPOINTMENT ARCHIVE
                  </div>
                </section>

              </div>

            </div>
          </div>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
