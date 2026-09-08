import Link from "next/link";
import { MANIFESTO_ITEMS } from "@/data/storefront";

export function BrandStory() {
  return (
    <section
      id="manifesto"
      className="relative w-full bg-charcoal text-off-white py-10 sm:py-14 md:py-16 border-y border-off-white/10 overflow-hidden transition-colors duration-500"
    >
      <Link
        href="/about"
        className="group block w-full cursor-pointer focus:outline-none"
        aria-label="Explore The House Manifesto"
      >
        <div className="overflow-hidden select-none">
          <div className="animate-marquee-glide flex items-center">
            {/* First sequence */}
            <div className="flex shrink-0 items-center gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16">
              {MANIFESTO_ITEMS.map((item, index) => (
                <div key={`m1-${index}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                  <span
                    className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-light uppercase tracking-[-0.03em] whitespace-nowrap transition-colors duration-300 ${
                      item.highlight
                        ? "text-brand-gray group-hover:text-off-white"
                        : "text-off-white group-hover:text-brand-gray"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="text-2xl sm:text-4xl md:text-5xl text-off-white/20 font-display font-light">
                    —
                  </span>
                </div>
              ))}
            </div>

            {/* Cloned sequence for seamless infinite loop */}
            <div
              className="flex shrink-0 items-center gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16"
              aria-hidden="true"
            >
              {MANIFESTO_ITEMS.map((item, index) => (
                <div key={`m2-${index}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                  <span
                    className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-light uppercase tracking-[-0.03em] whitespace-nowrap transition-colors duration-300 ${
                      item.highlight
                        ? "text-brand-gray group-hover:text-off-white"
                        : "text-off-white group-hover:text-brand-gray"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="text-2xl sm:text-4xl md:text-5xl text-off-white/20 font-display font-light">
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
