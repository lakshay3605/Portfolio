'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { AiTwinModalHeader } from './AiTwinModalHeader';
import { AiTwinModalInput } from './AiTwinModalInput';
import { AiTwinModalPromptCards } from './AiTwinModalPromptCards';
import { FeedbackCard } from './FeedbackCard';
import { AI_TWIN_MODAL_FOOTER } from './constants';
import { useAiTwinChat } from './AiTwinChatProvider';
import { AssistantMessage } from './messages/AssistantMessage';
import { ThinkingIndicator } from './messages/ThinkingIndicator';
import { UserMessage } from './messages/UserMessage';
import { useFloatingAssistant } from './FloatingAssistantProvider';

const MODAL_TRANSITION = { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const };

export function AiTwinModal() {
  const { isOpen, close, minimize, consumePendingPrompt, consumeSkipScrollReset } =
    useFloatingAssistant();
  const {
    messages,
    phase,
    hasConversation,
    isBusy,
    sessionId,
    showFeedback,
    sendMessage,
    sendHiddenPrompt,
    dismissFeedback
  } = useAiTwinChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrolledAssistantIdRef = useRef<string | null>(null);
  const pendingPromptHandledRef = useRef(false);

  const welcomeMessage = messages[0];
  const conversationMessages = messages.slice(1);

  const handleSend = (text: string) => {
    void sendMessage(text);
  };

  useEffect(() => {
    if (!isOpen) {
      pendingPromptHandledRef.current = false;
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        minimize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, minimize]);

  useEffect(() => {
    if (!isOpen || pendingPromptHandledRef.current) {
      return;
    }

    const pendingPrompt = consumePendingPrompt();
    if (pendingPrompt) {
      pendingPromptHandledRef.current = true;
      void sendHiddenPrompt(pendingPrompt);
      return;
    }

    if (consumeSkipScrollReset()) {
      return;
    }

    const container = scrollRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [consumePendingPrompt, consumeSkipScrollReset, isOpen, sendHiddenPrompt]);

  useEffect(() => {
    if (!isOpen || !hasConversation) {
      return;
    }

    const container = scrollRef.current;
    if (!container) {
      return;
    }

    if (phase === 'thinking' || phase === 'streaming') {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [hasConversation, isOpen, messages, phase]);

  useEffect(() => {
    if (!isOpen) {
      lastScrolledAssistantIdRef.current = null;
      return;
    }

    if (!hasConversation) {
      return;
    }

    const lastMessage = messages.at(-1);
    const container = scrollRef.current;

    if (
      !container ||
      !lastMessage ||
      lastMessage.role !== 'assistant' ||
      lastMessage.status !== 'complete' ||
      phase !== 'idle' ||
      lastScrolledAssistantIdRef.current === lastMessage.id
    ) {
      return;
    }

    lastScrolledAssistantIdRef.current = lastMessage.id;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, [hasConversation, isOpen, messages, phase]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="ai-twin-modal-root"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={MODAL_TRANSITION}
        >
          <motion.button
            type="button"
            aria-label="Minimize Lakshay AI"
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[24px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MODAL_TRANSITION}
            onClick={minimize}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-twin-modal-title"
            layoutId="ai-twin-shell"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              'relative z-10 flex w-[min(900px,92vw)] flex-col overflow-hidden rounded-[28px] border border-white/10',
              'h-[min(750px,88vh)] max-h-[calc(100vh-2rem)]',
              'bg-[rgba(10,15,30,0.75)] shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_0_80px_rgba(59,130,246,0.16),0_0_120px_rgba(139,92,246,0.12)]',
              'backdrop-blur-[24px]'
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.1),transparent_40%)]" />

            <AiTwinModalHeader onClose={close} onMinimize={minimize} />

            <div
              ref={scrollRef}
              className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 py-5 sm:px-8"
            >
              <div className="flex flex-col items-stretch justify-start">
                {welcomeMessage ? <AssistantMessage message={welcomeMessage} /> : null}

                {!hasConversation ? (
                  <AiTwinModalPromptCards onSelect={handleSend} disabled={isBusy} />
                ) : null}

                {conversationMessages.length > 0 ? (
                  <div className="mt-5 flex flex-col gap-5" role="log" aria-live="polite">
                    {conversationMessages.map((message) =>
                      message.role === 'user' ? (
                        <UserMessage key={message.id} message={message} />
                      ) : (
                        <AssistantMessage key={message.id} message={message} />
                      )
                    )}
                  </div>
                ) : null}

                <AnimatePresence>
                  {phase === 'thinking' ? (
                    <ThinkingIndicator key="thinking" className="mt-5" />
                  ) : null}
                </AnimatePresence>

                {showFeedback ? (
                  <div className="mt-5">
                    <FeedbackCard sessionId={sessionId} onDismiss={dismissFeedback} />
                  </div>
                ) : null}
              </div>
            </div>

            <footer className="relative shrink-0 border-t border-white/[0.08] px-6 py-4 sm:px-8 sm:py-5">
              <AiTwinModalInput onSend={handleSend} disabled={isBusy} autoFocus={isOpen} />
              <p className="mt-3 text-center text-[11px] text-text-tertiary sm:text-xs">
                {AI_TWIN_MODAL_FOOTER}
              </p>
            </footer>

            <span id="ai-twin-modal-title" className="sr-only">
              Lakshay AI
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
