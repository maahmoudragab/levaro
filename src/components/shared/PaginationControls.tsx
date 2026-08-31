"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getVisiblePages(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5];
  if (current >= total - 2)
    return [total - 4, total - 3, total - 2, total - 1, total];
  return [current - 2, current - 1, current, current + 1, current + 2];
}

/**
 * Reusable Pagination Controls bar adhering to Lévaro luxury UI guidelines.
 */
export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 pt-4",
        className,
      )}
    >
      <p className="text-xs text-zinc-500 order-2 sm:order-1">
        Page{" "}
        <span className="font-semibold text-zinc-900 tabular-nums">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-zinc-900 tabular-nums">
          {totalPages}
        </span>
      </p>

      <Pagination className="mx-0 w-auto order-1 sm:order-2">
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              onClick={(event) => {
                event.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={cn(
                "flex h-8.5 items-center rounded-xl border border-zinc-200/90 bg-white px-3 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900",
                currentPage === 1 && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(page);
                }}
                size="icon"
                className={cn(
                  "flex h-8.5 w-8.5 items-center justify-center rounded-xl border text-xs font-medium tabular-nums transition-colors shadow-2xs",
                  currentPage === page
                    ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                    : "border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              onClick={(event) => {
                event.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={cn(
                "flex h-8.5 items-center rounded-xl border border-zinc-200/90 bg-white px-3 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900",
                currentPage === totalPages && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PaginationControls;
