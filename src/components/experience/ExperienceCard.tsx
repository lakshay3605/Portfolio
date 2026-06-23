'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface ExperienceCardProps {
  icon: string;
  title: string;
  description: string;
  estimatedTime: string;
  ctaLabel: string;
  href: string;
  accent?: 'cyan' | 'violet';
  delay?: number;
}

const accentStyles = {
  cyan: {
    hoverBorder: 'group-hover:border-cyan-400/30',
    hoverGlow: 'group-hover:shadow-experience-card-cyan',
    iconBg: 'bg-cyan-400/10',
    ctaText: 'text-cyan-300/90 group-hover:text-cyan-200',
    shine: 'from-cyan-400/10 via-transparent to-transparent'
  },
  violet: {
    hoverBorder: 'group-hover:border-violet-400/30',
    hoverGlow: 'group-hover:shadow-experience-card-violet',
    iconBg: 'bg-violet-400/10',
    ctaText: 'text-violet-300/90 group-hover:text-violet-200',
    shine: 'from-violet-400/10 via-transparent to-transparent'
  }
} as const;

const cardTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const
};

export function ExperienceCard({
  icon,
  title,
  description,
  estimatedTime,
  ctaLabel,
  href,
  accent = 'cyan',
  delay = 0
}: ExperienceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const styles = accentStyles[accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...cardTransition, delay }}
      className="h-full"
    >
      <Link
        href={href}
        className={`group relative flex h-full flex-col rounded-[20px] border border-white/10 bg-boot-glass-bg p-6 shadow-boot-glass backdrop-blur-xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-boot-bg group-hover:-translate-y-1 sm:p-8 ${styles.hoverBorder} ${styles.hoverGlow}`}
        aria-label={`${title}. ${description} Estimated time: ${estimatedTime}.`}
      >
        <span
          className={`pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${styles.shine}`}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div
            className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-2xl ${styles.iconBg}`}
            aria-hidden="true"
          >
            {icon}
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h2>

          <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs tracking-wide text-text-tertiary">
              {estimatedTime}
            </span>
          </div>

          <div
            className={`mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${styles.ctaText}`}
          >
            <span>{ctaLabel}</span>
            <motion.span
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
