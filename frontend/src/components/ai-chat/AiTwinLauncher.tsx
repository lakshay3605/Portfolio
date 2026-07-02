'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useFloatingAssistant } from './FloatingAssistantProvider';

export function AiTwinLauncher() {
  const { isOpen, open } = useFloatingAssistant();

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          key="ai-twin-launcher"
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-4 z-[90] sm:bottom-6 sm:right-6"
        >
          <motion.button
            type="button"
            layoutId="ai-twin-shell"
            onClick={open}
            aria-label="Open Lakshay AI"
            className={cn(
              'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full',
              'border border-white/15 bg-[rgba(10,15,30,0.72)] px-4 py-3 text-sm font-medium text-text-primary',
              'shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(139,92,246,0.12)] backdrop-blur-[20px]',
              'transition-[transform,box-shadow,border-color] duration-300',
              'hover:scale-[1.03] hover:border-violet-400/30 hover:shadow-[0_16px_48px_rgba(59,130,246,0.22),0_0_0_1px_rgba(139,92,246,0.2)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            )}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_65%)]"
              aria-hidden="true"
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-primary/10"
              animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/25">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            </span>
            <span className="relative hidden sm:inline">Ask Lakshay AI</span>
            <span className="relative sm:hidden">Ask AI</span>
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
