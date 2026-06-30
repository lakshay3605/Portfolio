'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { EMPTY_STATE } from './constants';
import { SuggestedQuestions } from './SuggestedQuestions';
import type { SuggestedQuestion } from './types';

export interface ConversationEmptyStateProps {
  questions: SuggestedQuestion[];
  onSelectQuestion: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ConversationEmptyState({
  questions,
  onSelectQuestion,
  disabled = false,
  className
}: ConversationEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mx-auto flex w-full max-w-2xl flex-col items-center text-center', className)}
    >
      <div className="mb-8 max-w-lg">
        <p className="text-lg font-medium text-text-primary sm:text-xl">{EMPTY_STATE.greeting}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
          {EMPTY_STATE.body}
        </p>
      </div>

      <SuggestedQuestions
        questions={questions}
        onSelect={onSelectQuestion}
        disabled={disabled}
        className="w-full"
      />
    </motion.div>
  );
}
