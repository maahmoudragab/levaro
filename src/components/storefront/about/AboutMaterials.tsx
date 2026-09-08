import Image from "next/image";

interface MaterialItem {
  number: string;
  origin: string;
  name: string;
  provenance: string;
  gauge: string;
  composition: string;
  narrative: string;
  image: string;
  alt: string;
}

const MATERIALS: MaterialItem[] = [
  {
    number: "01",
    origin: "OKAYAMA // JAPAN",
    name: "14.5 OZ RAW SELVEDGE DENIM",
    provenance: "KURASHIKI ATELIER // TOYODA SHUTTLE LOOMS",
    gauge: "14.5 OZ (490 GSM)",
    composition: "100% UNTREATED NATURAL COTTON",
    narrative:
      "Cut from rigid vintage shuttle-loom selvedge. Free from artificial washes or pre-softening chemicals, allowing the fabric to hold crisp columnar breaks and mold organically to the wearer over decades.",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=85&w=900&auto=format&fit=crop",
    alt: "14.5oz Japanese Selvedge Denim Weave Texture",
  },
  {
    number: "02",
    origin: "BIELLA // ITALY",
    name: "480 GSM COMPACT VIRGIN WOOL",
    provenance: "PIEDMONT ALPINE REGION // DOUBLE-FACED MELTON",
    gauge: "480 GSM MELTON",
    composition: "100% COMPACT VIRGIN FLEECE",
    narrative:
      "Felted high-density double-faced fleece engineered for structural mass. Yields a monolithic downward fall with razor-sharp lapel edges that preserve tailored lines against wind and movement.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=85&w=900&auto=format&fit=crop",
    alt: "480gsm Compact Virgin Wool Melton Texture",
  },
  {
    number: "03",
    origin: "NILE BASIN // EGYPT",
    name: "320 GSM ARCHITECTURAL POPLIN",
    provenance: "GIZA LONG-STAPLE ATELIER // HIGH-TENSION YARN",
    gauge: "320 GSM COMPACT",
    composition: "EXTRA-LONG STAPLE COMBED COTTON",
    narrative:
      "Tightly twisted extra-long staple combed yarns produce a paper-crisp architectural drape with deep matte obsidian dye absorption and an audible tactile rustle during movement.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=900&auto=format&fit=crop",
    alt: "320gsm High-Tension Combed Poplin Weave",
  },
  {
    number: "04",
    origin: "ATELIER ARCHIVE",
    name: "8MM HAND-BEVELED ACETATE",
    provenance: "HARDENED PLANT-DERIVED BIO-POLYMER",
    gauge: "8.0 MM SOLID SLAB",
    composition: "PURIFIED CELLULOSE DERIVATIVE",
    narrative:
      "Cured from natural cotton seed and wood pulp, hand-beveled and tumble-polished for 72 hours. Yields deep sculptural heft, organic tactile warmth, and optical permanence without petroleum.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=900&auto=format&fit=crop",
    alt: "8mm Hand-Beveled Cellulose Acetate Monolith",
  },
];

export function AboutMaterials() {
  return (
    <section
      id="materials"
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 border-b border-near-black/15"
    >
      <div className="site-container flex flex-col gap-12 sm:gap-16">
        {/* 1. Header Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-near-black/15 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-brand-gray font-semibold">
              CHAPTER 03 / TACTILE SCIENCE
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-light uppercase tracking-tight text-near-black leading-none">
              THE TEXTILE <span className="text-brand-gray">LEXICON</span>
            </h2>
          </div>

          <p className="text-xs uppercase font-sans tracking-[0.16em] text-brand-gray max-w-sm leading-relaxed">
            Raw natural fibers engineered for unyielding structural mass, tactile presence, and decades of patina.
          </p>
        </div>

        {/* 2. Four Atelier Fabric Monoliths (Museum Pedestal Gallery) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8">
          {MATERIALS.map((mat) => (
            <div
              key={mat.number}
              className="group flex flex-col justify-between"
            >
              <div className="flex flex-col">
                {/* Generous Macro Texture Frame */}
                <div className="relative aspect-3/4 w-full bg-near-black border border-near-black/15 overflow-hidden">
                  <Image
                    src={mat.image}
                    alt={mat.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:brightness-100 transition-all duration-700 ease-signature"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-near-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Floating Index */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.22em] text-off-white/90">
                    <span className="font-semibold">[{mat.number}]</span>
                    <span className="text-off-white/70">{mat.origin}</span>
                  </div>

                  {/* Bottom Image Inset */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-[9px] font-mono uppercase tracking-[0.18em] text-off-white/80">
                    <span>{mat.gauge}</span>
                  </div>
                </div>

                {/* Material Headline & Provenance */}
                <div className="flex flex-col gap-1.5 pt-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray">
                    {mat.provenance}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-light uppercase tracking-tight text-near-black leading-tight group-hover:text-near-black transition-colors">
                    {mat.name}
                  </h3>
                </div>

                {/* Tactile Behavior Narrative */}
                <p className="text-xs font-sans uppercase tracking-[0.14em] text-near-black/75 leading-relaxed font-light mt-3.5">
                  {mat.narrative}
                </p>
              </div>

              {/* Minimalist Hairline Specification Footer */}
              <div className="pt-4 mt-6 border-t border-near-black/15 flex flex-col gap-1.5 text-[10px] font-mono uppercase tracking-[0.16em]">
                <div className="flex items-center justify-between">
                  <span className="text-brand-gray">COMPOSITION</span>
                  <span className="text-near-black font-semibold truncate max-w-[170px] text-right">
                    {mat.composition}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
