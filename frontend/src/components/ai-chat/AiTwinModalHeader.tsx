'use client';

import { Minus, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AiTwinModalHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  className?: string;
}

export function AiTwinModalHeader({ onClose, onMinimize, className }: AiTwinModalHeaderProps) {
  return (
    <header
      className={cn(
        'relative shrink-0 border-b border-white/[0.08] px-6 py-5 sm:px-8',
        className
      )}
    >
      <div className="flex items-start gap-4 pr-16">
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a88a] to-[#141b2d] ring-2 ring-primary/20 shadow-[0_0_24px_rgba(0,217,255,0.15)]"
          aria-hidden="true"
        >
          <span className="text-sm font-semibold text-white/90">LM</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0f1e] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.65)]" />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
              Lakshay AI
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Online
            </span>
          </div>
          <p className="mt-1 text-sm text-text-tertiary">
            AI Twin · Built &amp; Trained by Lakshay
          </p>
        </div>
      </div>

      <div className="absolute right-5 top-5 flex items-center gap-1.5 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize Lakshay AI"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-text-secondary transition-colors hover:border-white/20 hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
