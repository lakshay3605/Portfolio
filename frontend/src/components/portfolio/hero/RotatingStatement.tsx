'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { crossfade } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HERO_STATEMENTS, STATEMENT_INTERVAL_MS } from './constants';

export interface RotatingStatementProps {
  className?: string;
}

export function RotatingStatement({ className }: RotatingStatementProps) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_STATEMENTS.length);
    }, STATEMENT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const statement = HERO_STATEMENTS[index];

  return (
    <div
      className={cn('relative min-h-[1.75rem] sm:min-h-[2rem]', className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={statement}
          variants={crossfade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-base font-medium text-text-primary sm:text-lg"
        >
          {statement}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
