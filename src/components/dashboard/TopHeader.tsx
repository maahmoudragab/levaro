import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopHeaderProps {
  title: string;
  description: string;
  buttonName?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

/**
 * Reusable top header component for admin dashboard views.
 * Displays page title, subtitle description, and optional action button.
 */
export default function TopHeader({
  title,
  description,
  buttonName,
  buttonHref = "/admin/products/create",
  onButtonClick,
}: TopHeaderProps) {
  return (
    <header className="flex flex-col gap-3 rounded-2xl bg-[#f7f8f9] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between border border-black/5 shadow-2xs">
      <div>
        <h1 className="font-bodoni text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {buttonName && (
        <Link href={buttonHref} className="shrink-0">
          <Button
            variant="default"
            onClick={onButtonClick}
            className="h-9.5 px-4 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs active:scale-[0.98]"
          >
            {buttonName}
          </Button>
        </Link>
      )}
    </header>
  );
}
