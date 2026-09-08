"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ShieldCheck, Scissors, Layers, Compass, Mail } from "lucide-react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/storefront/shared/Header";
import { LuxuryCursor } from "@/components/storefront/shared/LuxuryCursor";
import { Preloader } from "@/components/storefront/shared/Preloader";
import { Footer } from "@/components/storefront/sections/Footer";

const FAQ_ITEMS = [
  {
    id: "exhibition-model",
    icon: Compass,
    number: "01",
    question: "IS LÉVARO AN ONLINE STORE OR A DIGITAL ATELIER EXHIBITION?",
    answer:
      "LÉVARO functions primarily as a digital fashion house, architectural design archive, and permanent showcase of limited editions. We do not operate generic automated checkout carts. Every piece is cataloged as an artistic edition with exhaustive fabric compositions, silhouette proportions, and design manifests.",
  },
  {
    id: "production-runs",
    icon: Scissors,
    number: "02",
    question: "HOW ARE LÉVARO EDITIONS CONSTRUCTED & SOURCED?",
    answer:
      "Every edition is constructed in strictly numbered batches utilizing bespoke textiles: 14.5oz shuttle-loom raw selvedge denim woven in Okayama (Japan), 480gsm sculpted virgin wool loomed in Tuscany (Italy), and custom heavyweight mercerized cottons. We reject mass production in favor of meticulous sartorial longevity.",
  },
  {
    id: "sizing-fit",
    icon: Layers,
    number: "03",
    question: "HOW DO I CHOOSE THE CORRECT SILHOUETTE & PROPORTION?",
    answer:
      "Our cuts are engineered around kinetics and volume—predominantly featuring relaxed, boxy architectural fits with dropped shoulders and columnar drape. We recommend selecting your standard size for the intended runway silhouette, or consulting our detailed measurements dossier provided on each edition's showcase page.",
  },
  {
    id: "garment-care",
    icon: ShieldCheck,
    number: "04",
    question: "WHAT ARE THE PRESERVATION & CARE PROTOCOLS FOR RAW TEXTILES?",
    answer:
      "Because our garments feature untreated raw selvedge denim and pure virgin wools, standard washing machine cycles will compromise the fiber structure. We strongly advise specialist luxury dry cleaning only, or spot-cleaning with cold water and natural air-drying away from direct sunlight.",
  },
  {
    id: "private-viewing",
    icon: HelpCircle,
    number: "05",
    question: "CAN SPECIAL PIECES BE VIEWED IN PERSON?",
    answer:
      "Private salon viewings and physical consultations are hosted periodically by private invitation at our Cairo design studio. Curators, stylists, and collectors may submit inquiries through our official correspondence channels.",
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "exhibition-model": true,
    "production-runs": false,
    "sizing-fit": false,
    "garment-care": false,
    "private-viewing": false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Preloader
        title="INQUIRIES"
        tagline="ATELIER CLIENT ARCHIVE — FAQ"
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
                  <span className="text-near-black font-semibold">CLIENT SERVICES &bull; FAQ</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-light uppercase tracking-tight text-near-black leading-tight">
                  FREQUENT INQUIRIES
                </h1>

                <p className="text-xs uppercase font-mono tracking-[0.18em] text-brand-gray">
                  ARCHITECTURAL QUESTIONS &bull; ATELIER PROTOCOLS &bull; AUTUMN 2026
                </p>
              </div>

              {/* Atelier Briefing Note */}
              <div className="p-6 sm:p-8 bg-near-black/[0.03] border border-near-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-near-black font-semibold block">
                    ATELIER INFORMATION DESK
                  </span>
                  <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-near-black/80 leading-relaxed">
                    Essential clarifications regarding our digital exhibition, textile provenance, garment volume, and private showroom consultations.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-xs font-mono tracking-[0.18em] text-near-black border-l-2 border-near-black pl-4">
                  <span>5 PROTOCOLS</span>
                </div>
              </div>

              {/* Interactive Collapsible FAQ Accordions */}
              <div className="space-y-3 divide-y divide-near-black/10">
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openItems[item.id];

                  return (
                    <div key={item.id} className="pt-4 first:pt-0">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 sm:gap-5 pr-4">
                          <span className="text-[11px] font-mono text-brand-gray font-semibold shrink-0">
                            {item.number} —
                          </span>
                          <span className="text-xs sm:text-sm uppercase font-display font-medium tracking-[0.14em] text-near-black group-hover:opacity-70 transition-opacity">
                            {item.question}
                          </span>
                        </div>

                        <div className="p-1 border border-near-black/15 group-hover:border-near-black transition-colors shrink-0">
                          <ChevronDown
                            className={`w-4 h-4 text-near-black transition-transform duration-500 ease-signature ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-signature ${
                          isOpen ? "max-h-[350px] opacity-100 pb-5" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-9 sm:pl-12 border-l border-near-black/15 ml-2">
                          <p className="text-xs sm:text-sm uppercase font-sans tracking-[0.14em] text-near-black/80 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Inquiries Contact Box */}
              <div className="pt-8 border-t border-near-black/10">
                <div className="p-6 sm:p-8 border border-near-black/10 bg-near-black text-off-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-[0.24em] text-brand-gray block">
                      UNANSWERED INQUIRIES
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-light uppercase tracking-tight text-off-white">
                      CONTACT THE CURATORIAL DESK
                    </h3>
                    <p className="text-xs uppercase font-sans tracking-[0.14em] text-off-white/70">
                      Reach our atelier representatives for bespoke inquiries, press, and private exhibition viewings.
                    </p>
                  </div>

                  <a
                    href="mailto:curator@levaro.store"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-off-white text-near-black text-xs uppercase font-sans font-bold tracking-[0.2em] hover:bg-white transition-colors cursor-pointer shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>EMAIL CURATOR</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
