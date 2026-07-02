'use client';

import { Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useFloatingAssistant } from '@/components/ai-chat/FloatingAssistantProvider';
import { heroReveal, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HERO_DESCRIPTION, HERO_GREETING, HERO_HEADLINE } from './constants';
import { AchievementPills } from './AchievementPills';

export interface HeroContentProps {
  className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { open } = useFloatingAssistant();

  return (
    <motion.div
      className={cn('flex flex-col', className)}
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal}>
        <Typography variant="overline" className="text-text-secondary">
          {HERO_GREETING}
        </Typography>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-[1.06] lg:text-[3.35rem]">
          {HERO_HEADLINE}
        </h1>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md max-w-xl">
        <Typography variant="body-lg">{HERO_DESCRIPTION}</Typography>
      </motion.div>

      <motion.div
        variants={prefersReducedMotion ? undefined : heroReveal}
        className="mt-content-lg flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button
          type="button"
          size="lg"
          onClick={open}
          className="shadow-[0_0_32px_rgba(0,217,255,0.18)] transition-shadow hover:shadow-[0_0_40px_rgba(0,217,255,0.28)]"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Meet My AI Twin
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#projects">View My Work</Link>
        </Button>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="mt-content-md">
        <AchievementPills />
      </motion.div>
    </motion.div>
  );
}
