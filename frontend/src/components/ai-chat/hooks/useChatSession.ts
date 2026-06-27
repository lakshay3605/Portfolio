'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { getSessionId } from '@/lib/session';
import { streamChatMessage } from '../api/streamChat';
import { FRIENDLY_ERROR_MESSAGE } from '../constants';
import type { ChatMessage, ChatPhase } from '../types';

const FEEDBACK_INTERVAL = 5;

function createMessage(
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status']
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    status,
    createdAt: Date.now(),
    avatarState: role === 'assistant' ? 'speaking' : undefined
  };
}

export interface ChatSession {
  messages: ChatMessage[];
  phase: ChatPhase;
  hasMessages: boolean;
  isBusy: boolean;
  sessionId: string;
  showFeedback: boolean;
  sendMessage: (text: string) => Promise<void>;
  cancelRequest: () => void;
  dismissFeedback: () => void;
}

/** Session-scoped conversation state with beta analytics hooks. */
export function useChatSession(): ChatSession {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const [showFeedback, setShowFeedback] = useState(false);
  const sessionId = useMemo(() => getSessionId(), []);
  const abortRef = useRef<AbortController | null>(null);
  const conversationNumberRef = useRef(0);
  const assistantResponsesRef = useRef(0);
  const dismissedFeedbackAtRef = useRef(0);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const dismissFeedback = useCallback(() => {
    dismissedFeedbackAtRef.current = assistantResponsesRef.current;
    setShowFeedback(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || phase !== 'idle') return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      conversationNumberRef.current += 1;
      const conversationNumber = conversationNumberRef.current;

      const userMessage = createMessage('user', trimmed, 'complete');
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [...prev, userMessage]);
      setPhase('thinking');

      let assistantStarted = false;

      try {
        await streamChatMessage(
          trimmed,
          {
            onStart: () => {
              assistantStarted = true;
              setPhase('streaming');
              setMessages((prev) => [
                ...prev,
                {
                  id: assistantId,
                  role: 'assistant',
                  content: '',
                  status: 'streaming',
                  createdAt: Date.now(),
                  avatarState: 'speaking'
                }
              ]);
            },
            onDelta: (delta) => {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId
                    ? { ...message, content: message.content + delta }
                    : message
                )
              );
            }
          },
          controller.signal,
          { sessionId, conversationNumber }
        );

        assistantResponsesRef.current += 1;
        const shouldPromptFeedback =
          assistantResponsesRef.current % FEEDBACK_INTERVAL === 0 &&
          assistantResponsesRef.current > dismissedFeedbackAtRef.current;

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, status: 'complete', avatarState: 'idle' }
              : message
          )
        );
        setPhase('idle');

        if (shouldPromptFeedback) {
          setShowFeedback(true);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          setPhase('idle');
          return;
        }

        const errorMessage = FRIENDLY_ERROR_MESSAGE;

        if (!assistantStarted) {
          setMessages((prev) => [...prev, createMessage('assistant', errorMessage, 'complete')]);
        } else {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    status: 'complete',
                    content: message.content || errorMessage,
                    avatarState: 'idle'
                  }
                : message
            )
          );
        }

        setPhase('idle');
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [phase, sessionId]
  );

  return {
    messages,
    phase,
    hasMessages: messages.length > 0,
    isBusy: phase !== 'idle',
    sessionId,
    showFeedback,
    sendMessage,
    cancelRequest,
    dismissFeedback
  };
}
