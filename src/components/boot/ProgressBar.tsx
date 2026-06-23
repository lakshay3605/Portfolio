'use client';

import { motion, useMotionValue, useReducedMotion, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface ProgressBarProps {
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export function ProgressBar({ duration = 5.5, onComplete, className = '' }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const width = useTransform(progress, (value) => `${value}%`);
  const shimmerX = useTransform(progress, (value) => `${Math.max(value - 12, 0)}%`);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: prefersReducedMotion ? 0.01 : duration,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        onComplete?.();
      }
    });

    const unsubscribe = progress.on('change', (value) => {
      const rounded = Math.round(value);
      setDisplayPercent((current) => (current === rounded ? current : rounded));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [duration, onComplete, prefersReducedMotion, progress]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative h-1.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayPercent}
        aria-label="AI initialization progress"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-boot-progress-fill shadow-boot-progress-glow"
          style={{ width }}
        />
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/25 blur-sm"
          style={{ x: shimmerX }}
          aria-hidden="true"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-right font-mono text-xs tracking-wider text-text-tertiary sm:text-sm"
        aria-live="polite"
      >
        {displayPercent}%
      </motion.p>
    </div>
  );
}
