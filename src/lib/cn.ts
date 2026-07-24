import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// Mesmo cn dos apps (clsx + tailwind-merge): consumidores sobrescrevem classes
// (ex.: size-8 → h-10 w-10) sem conflito. Bundlado no dist (self-contained).
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
