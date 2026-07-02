'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { transition } from '@/lib/motion';
import { HERO_PHOTO } from './constants';

export interface HeroPortraitProps {
  className?: string;
}

export function HeroPortrait({ className }: HeroPortraitProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...transition.slow, delay: 0.12 }}
      className="photo-col-custom"
    >
      <div className="photo-glow-custom" />
      <div className="photo-frame-custom">
        {HERO_PHOTO.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            className="select-none transition-transform duration-700 hover:scale-105"
          />
        )}
      </div>
    </motion.div>
  );
}
