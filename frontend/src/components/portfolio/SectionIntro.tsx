'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface SectionIntroProps {
  title: string;
  className?: string;
}

/** Flex wrapper — reliable 64px gap between heading and content (no margin collapse). */
export const SECTION_LAYOUT = 'flex flex-col gap-section-sm';

export function SectionIntro({ title, className }: SectionIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  function renderOrnaments() {
    const key = title.toLowerCase();
    // Projects: large violet orb to the right-top, subtle mint accent behind content
    if (key.includes('project')) {
      return (
        <>
          <div className="bg-grid-custom" />
          <div className="orb-projects" aria-hidden="true" />
          <div className="orb-projects-accent" aria-hidden="true" />
        </>
      );
    }

    // Experience: mint orb low-left with a thin violet halo outward
    if (key.includes('experience')) {
      return (
        <>
          <div className="bg-grid-custom" />
          <div className="orb-experience" aria-hidden="true" />
        </>
      );
    }

    // Skills: dual small orbs (left-center violet, right-center mint)
    if (key.includes('skills')) {
      return (
        <>
          <div className="bg-grid-custom" />
          <div className="orb-skills-left" aria-hidden="true" />
          <div className="orb-skills-right" aria-hidden="true" />
        </>
      );
    }

    // Resume: centered subtle violet ring
    if (key.includes('resume')) {
      return (
        <>
          <div className="bg-grid-custom" />
          <div className="orb-resume" aria-hidden="true" />
        </>
      );
    }

    // Leadership, Contact, and default: left subtle mint accent
    return (
      <>
        <div className="bg-grid-custom" />
        <div className="orb-default" aria-hidden="true" />
      </>
    );
  }
  function gradientClassFor(key: string) {
    if (key.includes('project')) return 'text-gradient-projects';
    if (key.includes('experience')) return 'text-gradient-experience';
    if (key.includes('skills')) return 'text-gradient-skills';
    if (key.includes('resume')) return 'text-gradient-resume';
    if (key.includes('leadership')) return 'text-gradient-leadership';
    return 'text-gradient-default';
  }

  const gradientClass = gradientClassFor(title.toLowerCase());

  return (
    <motion.header
      className={cn('relative mx-auto flex w-full max-w-3xl flex-col items-center text-center', className)}
      initial={prefersReducedMotion ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={transition.slow}
    >
      {/* decorative ornaments (varies by section) */}
      <div className="absolute inset-0 pointer-events-none">{renderOrnaments()}</div>

      <h2
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15] xl:text-[2.75rem]',
          gradientClass
        )}
      >
        {title}
      </h2>
    </motion.header>
  );
}
