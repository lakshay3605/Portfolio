'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface SectionIntroProps {
  title: string;
  className?: string;
}

/** Flex wrapper — reliable 64px gap between heading and content (no margin collapse). */
export const SECTION_LAYOUT = 'flex flex-col gap-section-sm';

export function SectionIntro({ title, className }: SectionIntroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.header
      className={cn('mx-auto flex w-full max-w-3xl flex-col items-center text-center', className)}
      initial={prefersReducedMotion ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={transition.slow}
    >
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15] xl:text-[2.75rem]">
        {title}
      </h2>
    </motion.header>
  );
}
