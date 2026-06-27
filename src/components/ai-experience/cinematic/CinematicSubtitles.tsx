'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { INTRODUCTION_LINES } from '../introduction/dialogue';

export interface CinematicSubtitlesProps {
  lineIndex: number;
  visible: boolean;
  className?: string;
}

export function CinematicSubtitles({ lineIndex, visible, className }: CinematicSubtitlesProps) {
  const line = lineIndex >= 0 ? INTRODUCTION_LINES[lineIndex] : null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-10 sm:pb-14',
        className
      )}
      role="region"
      aria-live="polite"
      aria-label="Introduction subtitles"
    >
      <AnimatePresence mode="wait">
        {visible && line ? (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl rounded-2xl border border-white/10 bg-black/45 px-6 py-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-8 sm:py-5"
          >
            <p className="text-base leading-relaxed text-white/92 sm:text-lg">{line.text}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
