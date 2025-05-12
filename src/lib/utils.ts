import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single className string using clsx and tailwind-merge
 * Used by Shadcn UI components for conditional class application
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 