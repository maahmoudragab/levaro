"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSignatureEase, SIGNATURE_EASE } from "@/lib/motion";
import { SectionHeader } from "@/components/storefront/shared/SectionHeader";
import { SectionFooter } from "@/components/storefront/shared/SectionFooter";
import { registerGyroscope } from "@/lib/gyroscope";
import { CURATED_EDITIONS } from "@/data/storefront";
import type { ProductItem } from "@/types/storefront";

gsap.registerPlugin(ScrollTrigger);

export function SelectedEditions({ products }: { products?: ProductItem[] } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<(HTMLDivElement | null)[]>([]);

  const editions = useMemo(() => {
    if (products && products.length > 0) {
      const featured = products.filter((p) => p.is_featured);
      const chosen = featured.length >= 4 ? featured.slice(0, 4) : products.slice(0, 4);
      return chosen.map((p) => ({
        id: p.id,
        code: p.code,
        discipline: (p.department || "ATELIER").toUpperCase(),
        name: p.name,
        material: p.material,
        price: p.priceFormatted || `EGP ${p.price}`,
        image: p.images[0] || "/placeholder.jpg",
        href: `/shop/${p.slug}`,
      }));
    }
    return CURATED_EDITIONS;
  }, [products]);

  useEffect(() => {
    registerSignatureEase();

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Subtle, Quiet Luxury Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: SIGNATURE_EASE }
        );
      }

      if (gridRef.current && gridRef.current.children.length > 0) {
        tl.fromTo(
          Array.from(gridRef.current.children),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: SIGNATURE_EASE },
          "-=0.5"
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: SIGNATURE_EASE },
          "-=0.4"
        );
      }

      // 2. Parallax Image Scrub
      imageLayersRef.current.forEach((layer) => {
        if (!layer) return;
        gsap.fromTo(
          layer,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // 3. Subtle Mobile Gyroscope Parallax (2D)
      let isVisible = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(section);

      const prodXSetters = imageLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "x", { duration: 0.3, ease: "power2.out" }) : null
      );
      const prodYSetters = imageLayersRef.current.map((layer) =>
        layer ? gsap.quickTo(layer, "y", { duration: 0.3, ease: "power2.out" }) : null
      );

      const unregisterGyro = registerGyroscope(({ normX, normY }) => {
        if (!isVisible) return;
        prodXSetters.forEach((setX) => setX && setX(normX * 20));
        prodYSetters.forEach((setY) => setY && setY(normY * 15));
      });

      return () => {
        observer.disconnect();
        unregisterGyro();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="editions"
      ref={sectionRef}
      data-light-section="true"
      className="relative w-full bg-off-white text-near-black site-padding-x section-py transition-colors duration-500 overflow-hidden"
    >
      {/* 1. SECTION HEADER */}
      <SectionHeader
        ref={headerRef}
        title="CURATED"
        titleAccent="EDITIONS"
        subtitle="Individual works of form, texture, and substance."
        theme="light"
        action={{
          label: "VIEW ALL PIECES",
          href: "/shop",
        }}
      />

      {/* 2. 4-COLUMN ARCHITECTURAL PRODUCT SHOWCASE */}
      <div
        ref={gridRef}
        className="site-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 my-10 sm:my-14 lg:my-16"
      >
        {editions.map((product, index) => {
          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between border-b border-near-black/15 pb-6 transition-colors duration-300"
            >
              {/* Product Visual Container */}
              <div className="relative w-full aspect-3/4 bg-charcoal overflow-hidden border border-near-black/10 group-hover:border-near-black/30 transition-colors duration-500 mb-4">
                {/* Product Detail Link */}
                <Link
                  href={product.href}
                  className="absolute inset-0 z-0 block cursor-pointer"
                  aria-label={`View ${product.name}`}
                >
                  {/* Parallax Image Shell */}
                  <div
                    ref={(el) => {
                      imageLayersRef.current[index] = el;
                    }}
                    className="absolute -top-14 -bottom-14 -left-12 -right-12 w-[calc(100%+96px)] h-[calc(100%+112px)] will-change-transform gpu overflow-hidden"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      quality={95}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top brightness-[0.98] group-hover:brightness-100 group-hover:scale-104 transition-all duration-700 ease-signature"
                    />
                  </div>

                  {/* Ambient Subtle Vignette */}
                  <div className="absolute inset-0 bg-linear-to-t from-near-black/40 via-transparent to-transparent pointer-events-none" />
                </Link>
              </div>

              {/* Product Metadata & Price */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <Link href={product.href} className="block">
                    <h3 className="text-sm sm:text-base font-display font-normal uppercase tracking-tight text-near-black leading-tight group-hover:translate-x-1 hover:opacity-75 transition-all duration-300">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-xs uppercase font-sans tracking-[0.18em] text-near-black font-semibold shrink-0">
                    {product.price}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.16em] text-brand-gray">
                  <span>{product.material}</span>
                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-1 text-near-black/70 hover:text-near-black transition-colors font-medium cursor-pointer"
                  >
                    <span>VIEW PIECE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SECTION FOOTER */}
      <SectionFooter
        ref={footerRef}
        theme="light"
        nextSection={{
          label: "CONTINUE TO ATELIER & CARE",
          href: "#footer",
        }}
        showBackToTop={true}
        className="mt-12 sm:mt-14 lg:mt-16"
      />
    </section>
  );
}
