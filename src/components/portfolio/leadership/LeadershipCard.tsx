'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { LeadershipData } from './types';

export interface LeadershipCardProps {
  leadership: LeadershipData;
  className?: string;
}

export function LeadershipCard({ leadership, className }: LeadershipCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = `leadership-${leadership.id}-title`;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      transition={transition.slow}
      className={cn(
        'rounded-card border border-border-primary/80 bg-surface/40 p-content-md shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-secondary hover:shadow-card-hover sm:p-content-lg',
        className
      )}
      aria-labelledby={titleId}
    >
      <Typography variant="h2" as="h3" id={titleId} className="text-2xl sm:text-3xl">
        {leadership.organization}
      </Typography>

      <Typography
        variant="body-lg"
        as="p"
        className="mt-content-xs font-medium text-text-primary"
      >
        {leadership.role}
      </Typography>

      <Typography variant="body-lg" className="mt-content-sm max-w-2xl">
        {leadership.description}
      </Typography>
    </motion.article>
  );
}
