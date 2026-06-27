'use client';

import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ConversationEmptyState } from './ConversationEmptyState';
import { AssistantMessage } from './messages/AssistantMessage';
import { ThinkingIndicator } from './messages/ThinkingIndicator';
import { UserMessage } from './messages/UserMessage';
import type { ChatMessage, ChatPhase, SuggestedQuestion } from './types';

export interface MessageListProps {
  messages: ChatMessage[];
  phase: ChatPhase;
  suggestedQuestions: SuggestedQuestion[];
  onSelectQuestion: (prompt: string) => void;
  isBusy: boolean;
  className?: string;
}

export function MessageList({
  messages,
  phase,
  suggestedQuestions,
  onSelectQuestion,
  isBusy,
  className
}: MessageListProps) {
  const showEmptyState = messages.length === 0;

  return (
    <div
      className={cn(
        'flex flex-1 flex-col',
        showEmptyState ? 'justify-center' : 'justify-start',
        className
      )}
    >
      {showEmptyState ? (
        <ConversationEmptyState
          questions={suggestedQuestions}
          onSelectQuestion={onSelectQuestion}
          disabled={isBusy}
        />
      ) : (
        <div className="flex flex-col gap-5 py-2" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message) =>
            message.role === 'user' ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AssistantMessage key={message.id} message={message} />
            )
          )}

          <AnimatePresence>
            {phase === 'thinking' && <ThinkingIndicator key="thinking" />}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
