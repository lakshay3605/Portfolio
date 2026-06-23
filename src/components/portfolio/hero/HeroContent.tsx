'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { heroReveal, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import {
  HERO_DESCRIPTION,
  HERO_HEADLINE,
  HERO_OVERLINE
} from './constants';
import { AchievementPills } from './AchievementPills';
import { RotatingStatement } from './RotatingStatement';

export interface HeroContentProps {
  className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn('flex flex-col', className)}
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal}>
        <Typography variant="overline">{HERO_OVERLINE}</Typography>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-[1.06] lg:text-[3.5rem]">
          {HERO_HEADLINE[0]}
          <br />
          {HERO_HEADLINE[1]}
        </h1>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md">
        <RotatingStatement />
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md max-w-xl">
        <Typography variant="body-lg">{HERO_DESCRIPTION}</Typography>
      </motion.div>

      <motion.div
        variants={prefersReducedMotion ? undefined : heroReveal}
        className="mt-content-md flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button asChild size="lg">
          <Link href="#projects">View Featured Work</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-primary/25 text-text-primary hover:border-primary/40 hover:bg-primary/[0.06]"
        >
          <Link href="/ai" className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary/80" aria-hidden="true" />
            Meet my AI Twin
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md">
        <AchievementPills />
      </motion.div>
    </motion.div>
  );
}
