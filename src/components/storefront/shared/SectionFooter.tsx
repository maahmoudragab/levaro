"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

export interface SectionFooterAction {
  label: string;
  href: string;
}

export interface SectionFooterNext {
  label: string;
  href: string;
}

export interface SectionFooterProps {
  theme?: "light" | "dark";
  nextSection?: SectionFooterNext;
  action?: SectionFooterAction;
  showBackToTop?: boolean;
  className?: string;
}

/**
 * Shared Architectural Section Footer for LÉVARO Storefront.
 * Enforces cohesive section boundaries, next-section transitions, and secondary actions.
 */
export const SectionFooter = forwardRef<HTMLDivElement, SectionFooterProps>(
  (
    {
      theme = "dark",
      nextSection,
      action,
      showBackToTop = false,
      className = "",
    },
    ref
  ) => {
    const isLight = theme === "light";

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <div
        ref={ref}
        className={`site-container flex flex-col sm:flex-row sm:items-center justify-between pt-5 sm:pt-6 border-t gap-4 shrink-0 transition-colors duration-300 ${
          isLight
            ? "border-near-black/15 text-near-black"
            : "border-off-white/15 text-off-white"
        } ${className}`}
      >
        {/* Left: Next Section Jump Navigation */}
        {nextSection ? (
          <Link
            href={nextSection.href}
            className={`group/next inline-flex items-center gap-2.5 text-[10px] sm:text-xs uppercase font-sans tracking-[0.24em] font-medium transition-colors duration-300 cursor-pointer w-fit ${
              isLight
                ? "text-near-black/75 hover:text-near-black"
                : "text-off-white/75 hover:text-off-white"
            }`}
          >
            <span>{nextSection.label}</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/next:translate-y-1" />
          </Link>
        ) : (
          <div />
        )}

        {/* Right: Actions (Secondary CTA and/or Back to Top) */}
        <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
          {action && (
            <Link
              href={action.href}
              className={`group/btn inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] font-semibold transition-colors duration-300 cursor-pointer ${
                isLight
                  ? "text-near-black hover:opacity-70"
                  : "text-off-white hover:opacity-70"
              }`}
            >
              <span>{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          )}

          {showBackToTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className={`group/top inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] transition-colors duration-300 cursor-pointer ${
                isLight
                  ? "text-brand-gray hover:text-near-black"
                  : "text-brand-gray hover:text-off-white"
              }`}
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover/top:-translate-y-1" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SectionFooter.displayName = "SectionFooter";
