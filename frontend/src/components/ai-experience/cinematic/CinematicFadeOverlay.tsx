'use client';

import { cn } from '@/lib/cn';

export interface CinematicFadeOverlayProps {
  opacity: number;
  className?: string;
}

export function CinematicFadeOverlay({ opacity, className }: CinematicFadeOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-40 bg-black', className)}
      style={{ opacity }}
    />
  );
}
