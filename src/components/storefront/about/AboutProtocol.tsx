import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageSquare, Mail, ShieldCheck } from "lucide-react";

const PROTOCOL_STEPS = [
  {
    step: "01",
    phase: "PHASE 01 // SELECTION",
    title: "ARCHIVE SELECTION",
    narrative:
      "Explore current editions within our digital showcase. Review tactile fiber compositions, silhouette measurements, and limited batch numbering.",
  },
  {
    step: "02",
    phase: "PHASE 02 // CONSULTATION",
    title: "CONCIERGE CONSULTATION",
    narrative:
      "Connect directly with the atelier concierge via WhatsApp. Confirm individual sizing, shoulder drape preferences, and silhouette calibration before reserve.",
  },
  {
    step: "03",
    phase: "PHASE 03 // DISPATCH",
    title: "BESPOKE TRANSIT",
    narrative:
      "Each garment is hand-inspected, packed in archival matte protective casing, and dispatched via complimentary insured courier across Egypt and worldwide.",
  },
];

export function AboutProtocol() {
  return (
    <section
      id="protocol"
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      <div className="site-container flex flex-col gap-12 sm:gap-16">
        {/* 1. Header Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-near-black/15 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-brand-gray font-semibold">
              CHAPTER 04 / ACQUISITION &amp; ACCESS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-light uppercase tracking-tight text-near-black">
              THE ATELIER <span className="text-brand-gray">PROTOCOL</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.2em] text-brand-gray">
            <ShieldCheck className="w-3.5 h-3.5 text-near-black" />
            <span className="text-near-black font-medium">DISCIPLINED CONCIERGE ONLY</span>
          </div>
        </div>

        {/* 2. 3-Step Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROTOCOL_STEPS.map((s) => (
            <div
              key={s.step}
              className="p-6 sm:p-8 bg-[#EFECE6] border border-near-black/15 flex flex-col justify-between gap-6 hover:border-near-black/40 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-near-black tracking-[0.2em]">
                    {s.step}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-gray">
                    {s.phase}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-near-black mt-2">
                  {s.title}
                </h3>

                <p className="text-xs font-sans uppercase tracking-[0.14em] text-near-black/80 leading-relaxed">
                  {s.narrative}
                </p>
              </div>

              <div className="pt-4 border-t border-near-black/10 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-brand-gray">
                <span>PROTOCOL {s.step}</span>
                <span className="text-near-black font-medium">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Concierge Desk Card Takeover */}
        <div className="bg-near-black text-off-white border border-near-black p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mt-4 shadow-xl">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.26em] text-brand-gray font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-off-white/80" />
              <span>CONCIERGE DESK ACTIVE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light uppercase tracking-tight text-off-white leading-tight">
              COMMENCE ATELIER <br />
              <span className="text-brand-gray">CONSULTATION OR ACQUISITION.</span>
            </h3>

            <p className="text-xs uppercase font-sans tracking-[0.14em] text-off-white/70 leading-relaxed">
              Connect directly with our curatorial team to discuss sizing, private viewings, or current edition availability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 bg-off-white text-near-black text-xs uppercase font-sans tracking-[0.22em] font-semibold transition-all duration-300 hover:bg-white cursor-pointer"
            >
              <span>EXPLORE ALL PIECES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href="https://wa.me/201000000000?text=Hello%20L%C3%89VARO%20Atelier%2C%20I%20would%20like%20to%20inquire%20regarding%20an%20edition."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-transparent border border-off-white/20 text-off-white text-xs uppercase font-sans tracking-[0.22em] transition-all duration-300 hover:border-off-white cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-brand-gray group-hover:text-off-white transition-colors" />
              <span>WHATSAPP CONCIERGE</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="mailto:curator@levaro.store"
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-transparent border border-off-white/20 text-off-white text-xs uppercase font-sans tracking-[0.22em] transition-all duration-300 hover:border-off-white cursor-pointer"
            >
              <Mail className="w-4 h-4 text-brand-gray group-hover:text-off-white transition-colors" />
              <span>EMAIL CURATOR</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
