import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/storefront/shared/SectionHeader";
import { SectionFooter } from "@/components/storefront/shared/SectionFooter";
import { FEATURED_COLLECTIONS } from "@/data/storefront";
import type { CuratedCollectionCard } from "@/services/storefront/categories";

interface CollectionsProps {
  collections?: CuratedCollectionCard[];
}

export function Collections({ collections }: CollectionsProps) {
  const collectionsData =
    collections && collections.length > 0
      ? collections
      : FEATURED_COLLECTIONS.map((col) => ({
          id: col.id,
          title: col.title,
          subtitle: col.subtitle,
          href: col.href,
          imagePrimary: col.imagePrimary,
          season: col.season,
        }));

  return (
    <section
      id="collections"
      className="relative w-full bg-near-black text-off-white site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="CURATED"
        titleAccent="COLLECTIONS"
        subtitle="Explorations in proportion, drape, and shadow."
        theme="dark"
        action={{
          label: "VIEW ALL",
          href: "/collections",
        }}
      />

      {/* 2. REFINED 2-COLUMN EXHIBITION GRID (COMPACT LUXURY HEIGHT) */}
      <div className="site-container grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 my-6 sm:my-8">
        {collectionsData.map((col, index) => (
          <Link
            key={col.id}
            href={col.href}
            className="group relative w-full aspect-4/3 sm:aspect-square bg-charcoal border border-off-white/15 hover:border-off-white/40 transition-colors duration-500 overflow-hidden flex flex-col justify-end p-5 sm:p-7 cursor-pointer"
          >
            {/* Static Image Shell */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={col.imagePrimary}
                alt={col.title}
                fill
                priority={index === 0}
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top filter grayscale contrast-110 brightness-[0.78] group-hover:brightness-[0.92] transition-all duration-500"
              />
            </div>

            {/* Ambient Gradients for Typography Contrast */}
            <div className="absolute inset-0 bg-linear-to-t from-near-black via-near-black/45 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-b from-near-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Card Typography & Explore Action */}
            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light uppercase tracking-tight text-off-white leading-none group-hover:translate-x-1 transition-transform duration-300">
                  {col.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] text-off-white/90 group-hover:text-off-white transition-colors shrink-0">
                  <span className="hidden sm:inline-block font-medium">EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              <p className="text-[11px] sm:text-xs uppercase font-sans tracking-[0.14em] text-off-white/70 max-w-sm leading-relaxed">
                {col.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. SECTION FOOTER */}
      <SectionFooter
        theme="dark"
        action={{
          label: "VIEW ALL COLLECTIONS",
          href: "/collections",
        }}
        className="mt-6 sm:mt-8"
      />
    </section>
  );
}
