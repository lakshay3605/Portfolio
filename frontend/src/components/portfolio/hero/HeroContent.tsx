'use client';

import { Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useFloatingAssistant } from '@/components/ai-chat/FloatingAssistantProvider';
import { heroReveal, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HERO_DESCRIPTION, HERO_GREETING, HERO_HEADLINE, HERO_OVERLINE } from './constants';
import { AchievementPills } from './AchievementPills';

export interface HeroContentProps {
  className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { open } = useFloatingAssistant();

  return (
    <motion.div
      className="hero-copy"
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      variants={staggerContainer}
    >
      {/* Top Eyebrow Badge */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="eyebrow-custom">
        <span className="pulse" />
        AI Developer &nbsp;•&nbsp; Product Builder
      </motion.div>

      {/* Heading */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal}>
        <h1 className="headline-custom">
          <span className="hi">Hi, I&apos;m</span>
          <span className="name">Lakshay Mahajan.</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal}>
        <p className="tagline-custom">
          Building <span className="accent">production-ready AI products</span> — from concept to deployment.
        </p>
      </motion.div>

      {/* Bio Description */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal}>
        <p className="bio-custom">
          Currently in my fourth year of <b>B.Tech (AI &amp; ML)</b>, I&apos;ve gained <b>7+ months</b> of professional AI development experience building LLM-powered applications, AI automation workflows, and production systems at KVGAI. Beyond engineering, I enjoy leading communities, winning hackathons, and turning ambitious ideas into real products.
        </p>
      </motion.div>

      {/* Buttons Row */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="cta-row-custom">
        <Link
          href="/Lakshay Mahajan Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-custom btn-primary-custom"
        >
          View Résumé &rarr;
        </Link>
        <Link
          href="#contact"
          className="btn-custom btn-secondary-custom"
        >
          Get in touch
        </Link>
      </motion.div>

      {/* Badges/Accomplishments */}
      <motion.div variants={prefersReducedMotion ? undefined : heroReveal} className="badges-custom">
        <span className="badge-custom gold"><span className="ico">🏆</span>National Hackathon Winner</span>
        <span className="badge-custom violet"><span className="ico">💼</span>AI Developer — KVGAI</span>
        <span className="badge-custom mint"><span className="ico">🚀</span>President — THINK AI</span>
        <span className="badge-custom blue"><span className="ico">🌐</span>President — HackSphere IPEC</span>
      </motion.div>
    </motion.div>
  );
}
