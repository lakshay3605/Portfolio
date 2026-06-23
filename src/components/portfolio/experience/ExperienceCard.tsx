'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { ExperienceData } from './types';

export interface ExperienceCardProps {
  experience: ExperienceData;
  className?: string;
}

export function ExperienceCard({ experience, className }: ExperienceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = `experience-${experience.id}-title`;

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
        {experience.company}
      </Typography>

      <div className="mt-content-xs flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
        <Typography variant="body-lg" as="p" className="font-medium text-text-primary">
          {experience.role}
        </Typography>
        <span className="hidden text-text-disabled sm:inline" aria-hidden="true">
          ·
        </span>
        <Typography variant="caption" as="p" className="text-text-tertiary">
          {experience.duration}
        </Typography>
      </div>

      <Typography variant="body-lg" className="mt-content-sm max-w-2xl">
        {experience.description}
      </Typography>

      <ul
        className="mt-content-md flex flex-wrap gap-2"
        role="list"
        aria-label={`${experience.company} technologies`}
      >
        {experience.technologies.map((tech) => (
          <li key={tech}>
            <span className="inline-flex rounded-full border border-border-primary/70 bg-background/40 px-3 py-1.5 text-xs text-text-secondary">
              {tech}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
