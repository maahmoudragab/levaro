import { forwardRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface SectionAction {
  label: string;
  href: string;
}

export interface SectionHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  theme?: "light" | "dark";
  action?: SectionAction;
  className?: string;
}

/**
 * Shared Architectural Section Header for LÉVARO Storefront.
 * Standardizes typography, spacing, border rhythm, and optional action buttons.
 */
export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      title,
      titleAccent,
      subtitle,
      theme = "dark",
      action,
      className = "",
    },
    ref
  ) => {
    const isLight = theme === "light";

    return (
      <div
        ref={ref}
        className={`site-container flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-8 border-b gap-4 shrink-0 ${
          isLight
            ? "border-near-black/15 text-near-black"
            : "border-off-white/15 text-off-white"
        } ${className}`}
      >
        {/* Title & Creative Abstract Subtitle */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-light uppercase tracking-[-0.03em] leading-none">
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="font-light">{titleAccent}</span>
              </>
            )}
          </h2>

          {subtitle && (
            <p
              className={`text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] ${
                isLight ? "text-near-black/60" : "text-off-white/60"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Optional Action Button */}
        {action && (
          <Link
            href={action.href}
            className={`group/btn inline-flex items-center gap-2.5 px-6 py-3 text-[10px] sm:text-[11px] uppercase font-sans tracking-[0.24em] font-semibold transition-all duration-300 shadow-md cursor-pointer shrink-0 ${
              isLight
                ? "bg-near-black text-off-white hover:bg-near-black/90"
                : "bg-off-white text-near-black hover:bg-off-white/90"
            }`}
          >
            <span>{action.label}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
