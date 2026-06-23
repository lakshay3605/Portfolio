'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { SkillCategory } from './types';

export interface SkillCategoryCardProps {
  category: SkillCategory;
  className?: string;
}

export function SkillCategoryCard({ category, className }: SkillCategoryCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = `skills-${category.id}-title`;

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
      <Typography variant="h2" as="h3" id={titleId} className="text-xl sm:text-2xl">
        {category.title}
      </Typography>

      <ul
        className="mt-content-md flex flex-wrap gap-2"
        role="list"
        aria-label={`${category.title} skills`}
      >
        {category.skills.map((skill) => (
          <li key={skill}>
            <span className="inline-flex rounded-full border border-border-primary/70 bg-background/40 px-3 py-1.5 text-xs text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-text-primary hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
