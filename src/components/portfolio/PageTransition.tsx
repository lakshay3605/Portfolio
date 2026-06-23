'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { transition } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 1, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.page}
      className={cn('min-h-screen', className)}
    >
      {children}
    </motion.div>
  );
}
