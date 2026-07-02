'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { heroReveal, transition } from '@/lib/motion';
import { HERO_CREDENTIALS, HERO_PHOTO } from './constants';

export interface HeroPortraitProps {
  className?: string;
}

export function HeroPortrait({ className }: HeroPortraitProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transition.slow, delay: 0.12 }}
      className={cn('relative mx-auto w-full max-w-md lg:max-w-none', className)}
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative mx-auto aspect-[4/5] w-full max-w-[320px] sm:max-w-[360px]"
      >
        <div
          className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),rgba(139,92,246,0.12)_45%,transparent_72%)] blur-2xl"
          aria-hidden="true"
        />

        <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,15,30,0.35)] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          {HERO_PHOTO.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              className="h-full w-full object-cover object-[center_20%]"
            />
          ) : (
            <div className="flex h-full w-full items-end justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.15),rgba(2,6,23,0.9))]">
              <div className="mb-10 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-4xl font-semibold tracking-tight text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                LM
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.slow, delay: 0.28 }}
        className="relative z-10 mx-auto mt-5 w-full max-w-[320px] rounded-[1.5rem] border border-white/10 bg-[rgba(10,15,30,0.55)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:max-w-[360px]"
      >
        <ul className="space-y-3" role="list" aria-label="Professional highlights">
          {HERO_CREDENTIALS.map((item, index) => (
            <motion.li
              key={item}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition.normal, delay: 0.34 + index * 0.08 }}
              className="flex items-center gap-3 text-sm text-text-primary"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
