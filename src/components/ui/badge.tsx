import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5.5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-white border-transparent [a]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent [a]:hover:bg-secondary/80",
        destructive:
          "bg-rose-50 text-rose-700 border-rose-200/80 [a]:hover:bg-rose-100",
        outline:
          "border-black/10 bg-white text-zinc-700 [a]:hover:bg-zinc-50",
        ghost:
          "border-transparent hover:bg-zinc-100 hover:text-zinc-900",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
        active:
          "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 font-medium",
        inactive:
          "bg-zinc-100 text-zinc-600 border-zinc-200 font-medium",
        inStock:
          "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 font-medium",
        outOfStock:
          "bg-rose-500/10 text-rose-700 border-rose-500/20 font-medium",
        lowStock:
          "bg-amber-500/10 text-amber-800 border-amber-500/20 font-medium",
        featured:
          "bg-amber-500/10 text-amber-800 border-amber-500/25 font-medium",
        notFeatured:
          "bg-zinc-100 text-zinc-500 border-zinc-200/80 font-medium",
        changedBy:
          "bg-primary/10 text-primary border-primary/20 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
