'use client';

import { Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ConversationHeaderProps {
  className?: string;
  subtitle?: string;
  onClose?: () => void;
}

export function ConversationHeader({
  className,
  subtitle = 'AI Twin · Interview mode',
  onClose
}: ConversationHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-10 shrink-0 border-b border-white/8 bg-[#020617]/80 px-4 py-4 backdrop-blur-xl sm:px-6',
        className
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a88a] to-[#141b2d] ring-2 ring-primary/20"
          aria-hidden="true"
        >
          <span className="text-sm font-semibold text-white/90">LM</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#020617] bg-emerald-400" />
        </div>

        <div className="min-w-0 flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="truncate text-base font-semibold tracking-tight text-text-primary sm:text-lg"
          >
            Lakshay Mahajan
          </motion.h1>
          <p className="truncate text-xs text-text-tertiary sm:text-sm">{subtitle}</p>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Minimize assistant"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Minimize2 className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
          <span className="text-xs font-medium text-text-secondary">Live</span>
        </div>
      </div>
    </header>
  );
}
