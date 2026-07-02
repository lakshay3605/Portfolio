'use client';

import { cn } from '@/lib/cn';
import { AI_TWIN_MODAL_PROMPT_CARDS } from './constants';

export interface AiTwinModalPromptCardsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export function AiTwinModalPromptCards({
  onSelect,
  disabled = false,
  className
}: AiTwinModalPromptCardsProps) {
  return (
    <div className={cn('mt-4', className)}>
      <div
        className="flex flex-wrap gap-2"
        role="list"
        aria-label="Suggested prompts"
      >
        {AI_TWIN_MODAL_PROMPT_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            role="listitem"
            disabled={disabled}
            onClick={() => onSelect(card.prompt)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04]',
              'px-3 py-1.5 text-left text-xs font-medium text-text-secondary sm:text-[13px]',
              'transition-[border-color,background-color,box-shadow,transform,color] duration-200',
              'hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/[0.07] hover:text-text-primary',
              'hover:shadow-[0_0_20px_rgba(59,130,246,0.18),0_0_0_1px_rgba(139,92,246,0.15)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <span aria-hidden="true">{card.emoji}</span>
            <span>{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
