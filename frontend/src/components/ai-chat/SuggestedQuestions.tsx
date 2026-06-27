'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { SuggestedQuestion } from './types';

export interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
  className
}: SuggestedQuestionsProps) {
  return (
    <div className={cn('w-full', className)}>
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-text-tertiary">
        Suggested questions
      </p>
      <div
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        role="list"
        aria-label="Suggested questions"
      >
        {questions.map((question, index) => (
          <motion.button
            key={question.id}
            type="button"
            role="listitem"
            disabled={disabled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={disabled ? undefined : { y: -2 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            onClick={() => onSelect(question.prompt)}
            className={cn(
              'group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left',
              'transition-colors duration-200',
              'hover:border-primary/30 hover:bg-primary/[0.06]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <span className="block text-sm font-medium text-text-primary transition-colors group-hover:text-white">
              {question.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
