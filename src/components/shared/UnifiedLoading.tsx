import { cn } from "@/lib/utils";

interface UnifiedLoadingProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

/**
 * Unified Luxury Loading Indicator for LÉVARO dashboard.
 * Designed with minimalist elegance, subtle spinning concentric rings, and refined typography.
 */
export function UnifiedLoading({
  message = "Loading...",
  subMessage,
  className,
}: UnifiedLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[55vh] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in-50 duration-300 select-none",
        className,
      )}
    >
      {/* Luxury Concentric Spinner */}
      <div className="relative flex size-12 items-center justify-center mb-3.5">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-sm" />

        {/* Outer base track */}
        <div className="size-10 rounded-full border-2 border-black/10" />

        {/* Main spinning ring */}
        <div className="absolute size-10 rounded-full border-2 border-transparent border-t-primary animate-spin" />

        {/* Center refined pulse dot */}
        <div className="absolute size-2 rounded-full bg-primary/60 animate-pulse" />
      </div>

      {/* Brand & Loading Status Typography */}
      <div className="space-y-0.5">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-800 font-sans">
          {message}
        </p>
        {subMessage && (
          <p className="text-[11px] font-medium text-zinc-400">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default UnifiedLoading;
