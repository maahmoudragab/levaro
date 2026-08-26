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
    <header className="flex flex-col gap-2 rounded-2xl bg-[#f7f8f9] p-4 sm:flex-row sm:items-center sm:justify-between border border-black/5 shadow-2xs">
      <div>
        <h1 className="font-bodoni text-2xl sm:text-3xl font-bold text-primary">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-black/60">{description}</p>
      </div>

      {buttonName && (
        <Link href={buttonHref}>
          <Button
            variant="default"
            onClick={onButtonClick}
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
          >
            {buttonName}
          </Button>
        </Link>
      )}
    </header>
  );
}
