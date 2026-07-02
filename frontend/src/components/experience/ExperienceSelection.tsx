'use client';

import { motion } from 'framer-motion';
import { BackgroundEffects } from '@/components/boot/BackgroundEffects';
import { ExperienceCard } from './ExperienceCard';

const EXPERIENCES = [
  {
    icon: '🤖',
    title: 'Experience the AI Twin',
    description:
      'Have a conversation with my AI twin. Ask about projects, experience, leadership, technical decisions, and interview questions.',
    estimatedTime: '10–15 minutes',
    ctaLabel: 'Enter AI Experience',
    href: '/portfolio?ai=open',
    accent: 'cyan' as const
  },
  {
    icon: '📄',
    title: 'Traditional Portfolio',
    description:
      'Prefer browsing? Explore my work, resume, projects, and experience in a familiar format.',
    estimatedTime: '2–3 minutes',
    ctaLabel: 'Browse Portfolio',
    href: '/portfolio',
    accent: 'violet' as const
  }
] as const;

const fadeTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const
};

export function ExperienceSelection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:py-16">
        <div className="w-full max-w-5xl">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition}
            className="mb-10 text-center sm:mb-14"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fadeTransition, delay: 0.08 }}
              className="mb-4 text-xs font-medium tracking-[0.22em] text-text-tertiary uppercase sm:text-sm"
            >
              Two paths. One portfolio.
            </motion.p>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              Choose Your Experience
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Both are fully polished. Pick the way you&apos;d like to explore Lakshay&apos;s work.
            </p>
          </motion.header>

          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8"
            role="list"
            aria-label="Experience options"
          >
            {EXPERIENCES.map((experience, index) => (
              <div key={experience.href} role="listitem">
                <ExperienceCard {...experience} delay={0.15 + index * 0.12} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
