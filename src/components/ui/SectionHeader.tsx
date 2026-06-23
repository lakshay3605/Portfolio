'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Typography } from './Typography';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  animate?: boolean;
  className?: string;
}

const alignmentStyles = {
  left: 'text-left items-start',
  center: 'text-center items-center mx-auto'
} as const;

export function SectionHeader({
  title,
  subtitle,
  alignment = 'left',
  animate = true,
  className
}: SectionHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  const content = (
    <div className={cn('flex max-w-2xl flex-col gap-content-sm', alignmentStyles[alignment], className)}>
      <Typography variant="h2">{title}</Typography>
      {subtitle ? (
        <Typography variant="body-lg" className="max-w-xl">
          {subtitle}
        </Typography>
      ) : null}
    </div>
  );

  if (!shouldAnimate) {
    return content;
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={transition.slow}
    >
      {content}
    </motion.div>
  );
}
