import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-4 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        active:
          "px-2 bg-blue-100 text-blue-500 text-[10px] font-semibold",
        inactive: "px-2 bg-red-100 text-red-500 text-[10px] font-semibold",
        inStock:
          "px-2 bg-emerald-100 text-emerald-500 text-[10px] font-semibold",
        outOfStock: "px-2 bg-red-100 text-red-500 text-[10px] font-semibold",
        lowStock:
          "px-2 bg-yellow-100 text-yellow-600 ",
        featured: "bg-yellow-100 text-yellow-600 text-[10px] font-semibold",
        notFeatured: "bg-gray-100 text-gray-600 text-[10px] font-semibold",
        changedBy: "px-2 text-[10px] font-semibold bg-primary/10 text-primary ",
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
