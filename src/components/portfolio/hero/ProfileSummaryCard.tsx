'use client';

import {
  ArrowRight,
  Bot,
  Brain,
  Database,
  Layers,
  Search,
  Server
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { heroReveal, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { ENGINEERING_PROFILE } from './constants';

const SPECIALIZATION_ICONS = {
  'LLM Engineering': Brain,
  'Agentic AI': Bot,
  'RAG Systems': Search,
  'Vector Databases': Database,
  FastAPI: Server,
  LLMOps: Layers
} as const;

export interface ProfileSummaryCardProps {
  className?: string;
}

export function ProfileSummaryCard({ className }: ProfileSummaryCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      variants={heroReveal}
      transition={{ ...transition.slow, delay: 0.2 }}
      className={className}
    >
      <div
        className={cn(
          'group flex flex-col rounded-card border border-border-primary/80 bg-surface/50 p-content-lg shadow-card backdrop-blur-sm transition-all duration-300 sm:p-6',
          'hover:-translate-y-0.5 hover:border-border-secondary hover:shadow-card-hover'
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <Typography variant="overline" className="text-text-tertiary">
            {ENGINEERING_PROFILE.label}
          </Typography>
        </div>

        <h2 className="mt-content-md text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {ENGINEERING_PROFILE.title}
        </h2>

        <div
          className="my-content-md border-t border-border-primary/60"
          role="separator"
          aria-hidden="true"
        />

        <Typography variant="overline" className="mb-content-sm text-text-tertiary">
          {ENGINEERING_PROFILE.specializationsSection}
        </Typography>

        <ul
          className="space-y-3.5"
          role="list"
          aria-label={ENGINEERING_PROFILE.specializationsSection}
        >
          {ENGINEERING_PROFILE.specializations.map((area) => {
            const Icon = SPECIALIZATION_ICONS[area];

            return (
              <li key={area}>
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-4 w-4 shrink-0 text-text-tertiary"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-text-primary">{area}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-content-md border-t border-border-primary/60 pt-content-sm">
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-between px-0 py-2 text-sm text-text-secondary transition-colors hover:bg-transparent hover:text-text-primary"
            aria-label="Explore with AI — coming soon"
          >
            <span>{ENGINEERING_PROFILE.cta}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
