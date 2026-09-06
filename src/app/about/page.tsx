import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";

export const metadata: Metadata = {
  title: "THE HOUSE — LÉVARO",
  description: "The architectural manifesto, material philosophy, and atelier vision of LÉVARO.",
};

export default function AboutPage() {
  return (
    <>
      {/* Functional Real Asset & Font Preloader */}
      <Preloader
        title="THE HOUSE"
        tagline="INITIALIZING MANIFESTO"
        images={[
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1000&auto=format&fit=crop",
        ]}
      />

      <LuxuryCursor />

      <SmoothScroll>
        <main className="min-h-screen bg-near-black text-off-white">
          <Header />

          {/* 1. HOUSE HERO MANIFESTO */}
          <section className="relative w-full min-h-[85vh] flex flex-col justify-end site-padding-x pt-36 sm:pt-44 pb-16 sm:pb-20 bg-near-black overflow-hidden border-b border-off-white/15">
            {/* Background Editorial Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-25 filter grayscale contrast-125">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1800&auto=format&fit=crop"
                alt="LÉVARO Atelier Study"
                fill
                priority
                quality={90}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/70 to-near-black/40" />
            </div>

            <div className="site-container relative z-10">
              <div className="flex flex-col gap-6 sm:gap-8 max-w-5xl">
                {/* Top Tag */}
                <div className="inline-flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-off-white/60" />
                  <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-brand-gray font-medium">
                    THE HOUSE OF LÉVARO / MANIFESTO
                  </span>
                </div>

                {/* Master Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light uppercase tracking-[-0.03em] leading-[0.92] text-off-white">
                  THE ARCHITECTURE <br />
                  <span className="font-light text-brand-gray">OF MOVEMENT.</span>
                </h1>

                {/* Philosophical Summary */}
                <p className="text-sm sm:text-base md:text-lg font-sans uppercase tracking-[0.16em] text-off-white/85 leading-relaxed max-w-2xl font-light">
                  LÉVARO is an atelier of structural fashion, tectonic silhouettes, and kinetic drapery.
                  We reject garments conceived as static covers—every piece is engineered as a habitable
                  volume that responds to gravity, shadow, and the human body in transit.
                </p>
              </div>
            </div>
          </section>

          {/* 2. THE THREE FOUNDATIONAL PILLARS */}
          <section className="w-full bg-charcoal text-off-white site-padding-x section-py border-b border-off-white/10">
            <div className="site-container">
              {/* Header Label */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-off-white/15 gap-4 mb-12 sm:mb-16">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-display font-light uppercase tracking-tight">
                    THE THREE <span className="font-light text-brand-gray">DISCIPLINES</span>
                  </h2>
                  <p className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.24em] text-brand-gray mt-1.5">
                    Structure, kinetics, and tactile substance.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-off-white/40">
                  SECTION 01 / PRINCIPLES
                </span>
              </div>

              {/* 3-Column Architectural Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                {/* Pillar 01 */}
                <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-off-white/15 pb-8 md:pb-0 md:pr-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs uppercase font-sans tracking-[0.26em] text-brand-gray font-semibold">
                      01 / TECTONIC SILHOUETTE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-off-white">
                      CLOTH AS ARCHITECTURE
                    </h3>
                    <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-off-white/75 leading-relaxed">
                      Every seam is engineered as a structural joint. We eliminate superfluous ornament
                      in favor of reinforced shoulders, cantilever lapels, and razor-sharp geometries that
                      give the human silhouette undeniable physical mass and architectural presence.
                    </p>
                  </div>
                  <div className="pt-6 text-[10px] uppercase font-sans tracking-[0.2em] text-brand-gray">
                    VOLUME &amp; PROPORTION
                  </div>
                </div>

                {/* Pillar 02 */}
                <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-off-white/15 pb-8 md:pb-0 md:pr-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs uppercase font-sans tracking-[0.26em] text-brand-gray font-semibold">
                      02 / KINETIC DRAPING
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-off-white">
                      DESIGNED IN TRANSIT
                    </h3>
                    <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-off-white/75 leading-relaxed">
                      Clothing only achieves its intended expression in motion. Our patterns are drafted
                      not on idle mannequins, but for walking velocity—calculating the fluid shear of
                      heavy virgin wool coatings and the sculpted breaks of high-density denim.
                    </p>
                  </div>
                  <div className="pt-6 text-[10px] uppercase font-sans tracking-[0.2em] text-brand-gray">
                    MOMENTUM &amp; FLOW
                  </div>
                </div>

                {/* Pillar 03 */}
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs uppercase font-sans tracking-[0.26em] text-brand-gray font-semibold">
                      03 / MATERIAL PURITY
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-off-white">
                      SUBSTANCE OVER NOVELTY
                    </h3>
                    <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.14em] text-off-white/75 leading-relaxed">
                      We work exclusively with unyielding raw fibers: 14.5oz shuttle-loomed Japanese selvedge,
                      dense 480gsm Italian virgin wool, and hand-cut custom cured acetate. Materials chosen
                      not for seasonal trends, but for permanent weight, durability, and raw tactile integrity.
                    </p>
                  </div>
                  <div className="pt-6 text-[10px] uppercase font-sans tracking-[0.2em] text-brand-gray">
                    ORIGIN &amp; TEXTURE
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ATELIER GALLERY (EDITORIAL VISUAL STUDY) */}
          <section className="w-full bg-near-black text-off-white site-padding-x section-py border-b border-off-white/10">
            <div className="site-container">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-off-white/15 mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-tight">
                  ATELIER <span className="text-brand-gray">VISUAL ARCHIVE</span>
                </h2>
                <span className="text-[10px] uppercase font-sans tracking-[0.24em] text-brand-gray">
                  FORM / DRAPE / SUBSTANCE
                </span>
              </div>

              {/* Asymmetrical Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
                {/* Large Main Feature */}
                <div className="md:col-span-7 relative aspect-[4/5] bg-charcoal overflow-hidden border border-off-white/15 group">
                  <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop"
                    alt="LÉVARO Silhouette Study"
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-top filter grayscale contrast-115 brightness-90 group-hover:brightness-95 transition-all duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-10 text-[9px] uppercase font-sans tracking-[0.24em] text-off-white/90 bg-near-black/80 px-3 py-1.5 border border-off-white/10">
                    STUDY 01 — MONOLITHIC COAT IN TRANSIT
                  </div>
                </div>

                {/* Right Stack */}
                <div className="md:col-span-5 flex flex-col gap-6 sm:gap-8">
                  <div className="relative aspect-[16/10] bg-charcoal overflow-hidden border border-off-white/15 group">
                    <Image
                      src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1000&auto=format&fit=crop"
                      alt="LÉVARO Fabric Texture"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-center filter grayscale contrast-110 brightness-85 group-hover:brightness-95 transition-all duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-10 text-[9px] uppercase font-sans tracking-[0.24em] text-off-white/90 bg-near-black/80 px-2.5 py-1 border border-off-white/10">
                      STUDY 02 — FLUID PLEATED TAILORING
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] bg-charcoal overflow-hidden border border-off-white/15 group">
                    <Image
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1000&auto=format&fit=crop"
                      alt="LÉVARO Structural Denim"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top filter grayscale contrast-115 brightness-85 group-hover:brightness-95 transition-all duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-10 text-[9px] uppercase font-sans tracking-[0.24em] text-off-white/90 bg-near-black/80 px-2.5 py-1 border border-off-white/10">
                      STUDY 03 — HEAVY DENIM TENSION
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. THE SPECIFICATIONS & CODE */}
          <section className="w-full bg-charcoal text-off-white site-padding-x section-py border-b border-off-white/10">
            <div className="site-container">
              <div className="max-w-4xl flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-sans tracking-[0.26em] text-brand-gray font-semibold">
                    SPECIFICATIONS &amp; PROTOCOL
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-tight">
                    THE ATELIER BLUEPRINT
                  </h2>
                </div>

                {/* Data Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-off-white/15 pt-6 text-xs font-sans uppercase tracking-[0.16em]">
                  <div className="p-4 bg-near-black/50 border border-off-white/10 flex flex-col gap-1.5">
                    <span className="text-brand-gray text-[10px] tracking-[0.22em]">DISCIPLINE</span>
                    <span className="text-off-white font-medium">ARCHITECTURAL PRÊT-À-PORTER</span>
                  </div>

                  <div className="p-4 bg-near-black/50 border border-off-white/10 flex flex-col gap-1.5">
                    <span className="text-brand-gray text-[10px] tracking-[0.22em]">CORE FOCUS</span>
                    <span className="text-off-white font-medium">FORM, MASS, KINETIC VOLUME</span>
                  </div>

                  <div className="p-4 bg-near-black/50 border border-off-white/10 flex flex-col gap-1.5">
                    <span className="text-brand-gray text-[10px] tracking-[0.22em]">PALETTE TOKENS</span>
                    <span className="text-off-white font-medium">INK BLACK, OFF-WHITE, CHARCOAL, RAW SLATE</span>
                  </div>

                  <div className="p-4 bg-near-black/50 border border-off-white/10 flex flex-col gap-1.5">
                    <span className="text-brand-gray text-[10px] tracking-[0.22em]">ACQUISITION</span>
                    <span className="text-off-white font-medium">DIRECT CONCIERGE VIA WHATSAPP</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. EPILOGUE & TRANSITION TO STOREFRONT */}
          <section className="w-full bg-near-black text-off-white site-padding-x section-py text-center">
            <div className="site-container flex flex-col items-center justify-center gap-6 sm:gap-8 py-8 sm:py-12">
              <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-brand-gray font-medium">
                EXPLORE THE CURRENT BODY OF WORK
              </span>

              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight text-off-white max-w-3xl leading-[0.95]">
                FORM IN MOTION. <br />
                <span className="text-brand-gray">AVAILABLE IN LIMITED EDITIONS.</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.24em] font-semibold hover:bg-off-white/90 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span>EXPLORE ALL PIECES</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-off-white/30 text-off-white text-xs uppercase font-sans tracking-[0.24em] hover:border-off-white transition-all duration-300 cursor-pointer"
                >
                  <span>RETURN TO STOREFRONT</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
