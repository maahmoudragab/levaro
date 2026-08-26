import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally merge Tailwind CSS class names without collisions.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
