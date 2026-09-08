import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";

export const metadata: Metadata = {
  title: "TERMS & CONDITIONS — ATELIER USAGE — LÉVARO",
  description: "Terms and conditions governing the digital exhibition, intellectual property, and archival showcase of LÉVARO Atelier.",
};

export default function TermsPage() {
  return (
    <>
      {/* Functional Real Asset Preloader */}
      <Preloader
        title="TERMS"
        tagline="CONDITIONS OF EXHIBITION"
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
                  <span className="text-near-black font-semibold">LEGAL &amp; GOVERNANCE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-light uppercase tracking-tight text-near-black leading-tight">
                  TERMS &amp; CONDITIONS
                </h1>

                <p className="text-xs uppercase font-mono tracking-[0.18em] text-brand-gray">
                  PUBLISHED ARCHIVE PROTOCOL &bull; AUTUMN 2026
                </p>
              </div>

              {/* Atelier Notice Banner */}
              <div className="p-6 sm:p-8 bg-near-black/[0.03] border border-near-black/10 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-near-black font-semibold block">
                  ARCHIVAL EXHIBITION NOTICE
                </span>
                <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-near-black/80 leading-relaxed">
                  LÉVARO operates this platform as a curated digital showroom, design manifesto, and permanent archival gallery. Access to this platform is governed by the architectural guidelines, intellectual property protections, and digital usage terms outlined below.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12 divide-y divide-near-black/10 text-xs sm:text-sm font-sans uppercase tracking-[0.14em] leading-relaxed">
                
                {/* 01 — DIGITAL ARCHIVE STATUS */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    01 — DIGITAL ARCHIVE NATURE
                  </span>
                  <p className="text-near-black/75">
                    This website serves as an artistic and structural portfolio of limited garment editions, bespoke fabric compositions, and sculptural tailoring. The display of editions, codes, or textile studies does not constitute an automated commercial offering or binding public sales contract.
                  </p>
                </section>

                {/* 02 — INTELLECTUAL PROPERTY */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    02 — INTELLECTUAL PROPERTY &amp; ATELIER PATENTS
                  </span>
                  <p className="text-near-black/75">
                    All visual materials, lookbook photography, editorial compositions, graphic typography, code architectures, and bespoke silhouettes appearing under the LÉVARO brand are exclusive intellectual property protected under domestic and international copyright laws. Reproduction, commercial harvesting, or unauthorized editorial mirroring without formal written consent is strictly prohibited.
                  </p>
                </section>

                {/* 03 — SPECIFICATION INTEGRITY */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    03 — ATELIER SPECIFICATION INTEGRITY
                  </span>
                  <p className="text-near-black/75">
                    We exert extreme rigor to depict fabric weights (GSM), Japanese shuttle-loom weaves, raw selvedge textures, and tailoring proportions with complete photographic fidelity. However, as our editions incorporate artisan dyeing and raw textiles, slight natural variations in tone and texture are celebrated characteristics of bespoke craft.
                  </p>
                </section>

                {/* 04 — LIMITATION OF LIABILITY */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    04 — LIMITATION OF LIABILITY
                  </span>
                  <p className="text-near-black/75">
                    LÉVARO shall not be held liable for incidental, indirect, or consequential damages arising from the use of this digital showcase, intermittent downtime during architectural updates, or network latencies beyond our direct control.
                  </p>
                </section>

                {/* 05 — JURISDICTION */}
                <section className="pt-8 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-[0.24em] text-near-black font-semibold block">
                    05 — GOVERNING LAW &amp; ATELIER JURISDICTION
                  </span>
                  <p className="text-near-black/75">
                    These conditions and all related matters shall be governed exclusively by the laws governing fashion house archives and intellectual property registries in Cairo, Egypt, without giving effect to conflicts of law principles.
                  </p>
                  <div className="p-4 border border-near-black/10 bg-near-black/[0.02] font-mono text-xs uppercase tracking-[0.18em] text-near-black">
                    LEGAL INQUIRIES &bull; LÉVARO ATELIER <br />
                    EMAIL: <span className="text-brand-gray">LEGAL@LEVARO.STORE</span>
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
