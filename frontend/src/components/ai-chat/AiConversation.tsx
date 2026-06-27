'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { BETA_MODE } from '@/lib/beta';
import { BetaBanner } from './BetaBanner';
import { ChatInput } from './ChatInput';
import { ConversationHeader } from './ConversationHeader';
import { FeedbackCard } from './FeedbackCard';
import { ReportIssueButton } from './ReportIssueButton';
import { SUGGESTED_QUESTIONS, BETA_IMPROVEMENT_FOOTER } from './constants';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useChatSession } from './hooks/useChatSession';
import { MessageList } from './MessageList';

export interface AiConversationProps {
  className?: string;
}

export function AiConversation({ className }: AiConversationProps) {
  const {
    messages,
    phase,
    hasMessages,
    isBusy,
    sessionId,
    showFeedback,
    sendMessage,
    dismissFeedback
  } = useChatSession();
  const scrollKey = `${messages.length}:${phase}:${messages.at(-1)?.content.length ?? 0}:${showFeedback ? 1 : 0}`;
  const scrollRef = useAutoScroll<HTMLDivElement>(scrollKey, true);

  const handleSend = (text: string) => {
    void sendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex h-svh w-full flex-col overflow-hidden bg-[#020617]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {BETA_MODE ? <BetaBanner /> : null}
      <ConversationHeader />

      <div
        ref={scrollRef}
        className="relative flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <MessageList
            messages={messages}
            phase={phase}
            suggestedQuestions={SUGGESTED_QUESTIONS}
            onSelectQuestion={handleSend}
            isBusy={isBusy}
          />

          {showFeedback ? (
            <div className="mt-6">
              <FeedbackCard sessionId={sessionId} onDismiss={dismissFeedback} />
            </div>
          ) : null}
        </div>
      </div>

      <ReportIssueButton sessionId={sessionId} />

      <footer className="relative shrink-0 border-t border-white/8 bg-[#020617]/85 px-4 py-4 backdrop-blur-xl sm:px-6">
        <ChatInput onSend={handleSend} disabled={isBusy} />

        <div className="mx-auto mt-3 flex max-w-3xl flex-col gap-2 text-[11px] text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center sm:text-left">{BETA_IMPROVEMENT_FOOTER}</span>
          <span className="hidden text-right sm:inline">
            {hasMessages ? 'Conversation saved for beta analytics' : 'Start with a suggested question'}
          </span>
          {!BETA_MODE ? (
            <Link
              href="/portfolio"
              className="text-center transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:ml-auto sm:text-right"
            >
              Browse traditional portfolio
            </Link>
          ) : null}
        </div>
      </footer>
    </motion.div>
  );
}
