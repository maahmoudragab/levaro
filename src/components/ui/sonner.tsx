"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * LÉVARO Unified Toaster Provider.
 * Configured at top-center to render custom Dynamic Island glassmorphic notifications.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group font-sans"
      gap={8}
      {...props}
    />
  );
};

export { Toaster };
