import Image from "next/image";

export function AboutArchiveGallery() {
  return (
    <section
      id="archive"
      className="relative w-full bg-near-black text-off-white site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      <div className="site-container flex flex-col gap-12 sm:gap-16">
        {/* 1. Header Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-off-white/15 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-brand-gray font-semibold">
              CHAPTER 04 / CURATORIAL DOSSIER
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-light uppercase tracking-tight text-off-white">
              VISUAL <span className="text-brand-gray">ARCHIVE</span>
            </h2>
          </div>

          <span className="text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray">
            FIGURES / PROPORTION / LIGHT
          </span>
        </div>

        {/* 2. Asymmetric Editorial Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Large Column (7 Cols) */}
          <div className="md:col-span-7 relative aspect-3/4 bg-charcoal border border-off-white/15 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1400&auto=format&fit=crop"
              alt="LÉVARO Archetype Monolith Coat Study"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-top filter grayscale contrast-125 brightness-85 group-hover:brightness-95 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-near-black/85 via-transparent to-near-black/30 pointer-events-none" />

            {/* In-Frame Curatorial Inspection Plate */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-off-white bg-near-black/85 backdrop-blur-xs px-3 py-2.5 border border-off-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-off-white/70" />
                <span>STUDY 01 // CANTILEVER MONOLITH</span>
              </div>
              <span className="text-brand-gray">PLATE NO. 26.01</span>
            </div>
          </div>

          {/* Secondary Stack (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* Top Frame */}
            <div className="relative aspect-16/11 bg-charcoal border border-off-white/15 overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=1000&auto=format&fit=crop"
                alt="LÉVARO Structural Pleated Wool Study"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center filter grayscale contrast-125 brightness-80 group-hover:brightness-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-near-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-off-white bg-near-black/85 backdrop-blur-xs px-3 py-2 border border-off-white/10">
                <span>STUDY 02 // SEAM TENSION</span>
                <span className="text-brand-gray">PLATE NO. 26.02</span>
              </div>
            </div>

            {/* Bottom Frame */}
            <div className="relative aspect-16/11 bg-charcoal border border-off-white/15 overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1000&auto=format&fit=crop"
                alt="LÉVARO Drop-Shoulder High Break Study"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top filter grayscale contrast-125 brightness-80 group-hover:brightness-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-near-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-off-white bg-near-black/85 backdrop-blur-xs px-3 py-2 border border-off-white/10">
                <span>STUDY 03 // ANATOMICAL SILENCE</span>
                <span className="text-brand-gray">PLATE NO. 26.03</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Exhibition Colophon Footnote */}
        <div className="pt-6 border-t border-off-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] uppercase font-sans tracking-[0.22em] text-brand-gray">
          <span>LÉVARO CURATORIAL ARCHIVE // PERMANENT COLLECTION</span>
          <span>ALL PHOTOGRAPHY RESTRICTED TO RAW DENSITY</span>
        </div>
      </div>
    </section>
  );
}
