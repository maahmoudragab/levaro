import type { Metadata } from "next";
import { NotFoundActions } from "@/components/storefront/search/NotFoundActions";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";

export const metadata: Metadata = {
  title: "404 — ARCHIVE VOID | LÉVARO",
  description: "The requested coordinate is unavailable or has returned to the atelier archive.",
};

export default function NotFound() {
  return (
    <>
      {/* Functional Real Asset Preloader */}
      <Preloader
        title="404"
        tagline="ARCHIVE VOID"
        images={["/images/hero background.jpg"]}
      />

      <LuxuryCursor />

      <SmoothScroll>
        <main className="min-h-screen bg-near-black text-off-white flex flex-col justify-between">
          <Header />

          {/* 404 ARCHITECTURAL VOID STAGE */}
          <section className="relative w-full my-auto site-padding-x section-py pt-36 sm:pt-44 flex flex-col items-center justify-center text-center">
            <div className="site-container flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-3xl">
              {/* Top Status Tag */}
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-off-white/60" />
                <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.3em] text-brand-gray font-medium">
                  ERROR 404 / UNLOCATED COORDINATE
                </span>
                <span className="w-8 h-[1px] bg-off-white/60" />
              </div>

              {/* Master Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light uppercase tracking-[-0.03em] leading-[0.92] text-off-white">
                THE ARCHIVE VOID. <br />
                <span className="font-light text-brand-gray">PAGE NOT FOUND.</span>
              </h1>

              {/* Philosophical Summary */}
              <p className="text-xs sm:text-sm md:text-base font-sans uppercase tracking-[0.14em] text-off-white/80 leading-relaxed max-w-xl font-light">
                The garment, coordinate, or edition you requested is unavailable or has returned to the atelier archive. Structure and form continue across the active collection.
              </p>

              {/* Luxury CTAs */}
              <NotFoundActions />
            </div>
          </section>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
