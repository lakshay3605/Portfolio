'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { THINKING_DELAY_MS, THINKING_LABEL } from '../constants';

export interface ThinkingIndicatorProps {
  className?: string;
  avatarState?: 'thinking';
}

export function ThinkingIndicator({ className, avatarState = 'thinking' }: ThinkingIndicatorProps) {
  const [showDelayedLabel, setShowDelayedLabel] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowDelayedLabel(true);
    }, THINKING_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex items-start gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={showDelayedLabel ? THINKING_LABEL : 'Loading response'}
      data-avatar-state={avatarState}
    >
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a88a] to-[#141b2d] ring-1 ring-white/10"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold text-white/90">LM</span>
      </div>

      <div className="rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.04] px-4 py-3">
        {showDelayedLabel ? (
          <p className="text-sm text-text-secondary">{THINKING_LABEL}</p>
        ) : (
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-2 w-2 rounded-full bg-primary/80"
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: dot * 0.15,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </span>
        )}
      </div>
    </motion.div>
  );
}
