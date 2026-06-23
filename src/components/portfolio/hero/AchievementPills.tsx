'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { pillReveal, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HERO_ACHIEVEMENTS } from './constants';

export interface AchievementPillsProps {
  className?: string;
}

export function AchievementPills({ className }: AchievementPillsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <ul className={cn('flex flex-wrap gap-2 sm:gap-2.5', className)} role="list" aria-label="Key achievements">
        {HERO_ACHIEVEMENTS.map((achievement) => (
          <li key={achievement.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-primary/70 bg-surface/50 px-3 py-1.5 text-xs text-text-secondary backdrop-blur-sm">
              <span aria-hidden="true">{achievement.icon}</span>
              <span>{achievement.label}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className={cn('flex flex-wrap gap-2 sm:gap-2.5', className)}
      role="list"
      aria-label="Key achievements"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {HERO_ACHIEVEMENTS.map((achievement) => (
        <motion.li key={achievement.label} variants={pillReveal}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-primary/70 bg-surface/50 px-3 py-1.5 text-xs text-text-secondary backdrop-blur-sm">
            <span aria-hidden="true">{achievement.icon}</span>
            <span>{achievement.label}</span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
