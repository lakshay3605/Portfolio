'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { getSessionId, isFeedbackPromptHandled, markFeedbackPromptHandled } from '@/lib/session';
import { streamChatMessage } from '../api/streamChat';
import { FRIENDLY_ERROR_MESSAGE } from '../constants';
import type { ChatMessage, ChatPhase } from '../types';

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
    avatarState:
      role === 'assistant' ? (status === 'complete' ? 'idle' : 'speaking') : undefined
  };
}

export interface UseChatSessionOptions {
  welcomeMessage?: string;
}

/** Ask for feedback once per session after this many completed exchanges. */
const FEEDBACK_AFTER_TURN = 3;
const MAX_HISTORY_MESSAGES = 12;

function buildConversationHistory(messages: ChatMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((message) => message.status === 'complete' && message.content.trim())
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim()
    }));
}

function createInitialMessages(welcomeMessage?: string): ChatMessage[] {
  if (!welcomeMessage) {
    return [];
  }

  return [createMessage('assistant', welcomeMessage, 'complete')];
}

export interface ChatSession {
  messages: ChatMessage[];
  phase: ChatPhase;
  hasMessages: boolean;
  hasConversation: boolean;
  isBusy: boolean;
  sessionId: string;
  showFeedback: boolean;
  sendMessage: (text: string) => Promise<void>;
  sendHiddenPrompt: (text: string) => Promise<void>;
  cancelRequest: () => void;
  dismissFeedback: () => void;
}

/** Session-scoped conversation state with beta analytics hooks. */
export function useChatSession(options?: UseChatSessionOptions): ChatSession {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(options?.welcomeMessage)
  );
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasConversation, setHasConversation] = useState(false);
  const sessionId = useMemo(() => getSessionId(), []);
  const abortRef = useRef<AbortController | null>(null);
  const conversationNumberRef = useRef(0);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const dismissFeedback = useCallback(() => {
    setShowFeedback(false);
    markFeedbackPromptHandled();
  }, []);

  const runAssistantTurn = useCallback(
    async (text: string, showUserMessage: boolean) => {
      const trimmed = text.trim();
      if (!trimmed || phase !== 'idle') return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      conversationNumberRef.current += 1;
      const conversationNumber = conversationNumberRef.current;
      const assistantId = crypto.randomUUID();
      const history = buildConversationHistory(messagesRef.current);

      if (showUserMessage) {
        setMessages((prev) => [...prev, createMessage('user', trimmed, 'complete')]);
      }

      setHasConversation(true);
      setPhase('thinking');
      setShowFeedback(false);

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
          { sessionId, conversationNumber, history }
        );

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, status: 'complete', avatarState: 'idle' }
              : message
          )
        );
        setPhase('idle');
        if (conversationNumber >= FEEDBACK_AFTER_TURN && !isFeedbackPromptHandled()) {
          setShowFeedback(true);
          markFeedbackPromptHandled();
        }
      } catch (error) {
        if (controller.signal.aborted) {
          setPhase('idle');
          return;
        }

        const errorMessage =
          error instanceof Error && error.message.trim()
            ? error.message.trim()
            : FRIENDLY_ERROR_MESSAGE;

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

  const sendMessage = useCallback(
    async (text: string) => runAssistantTurn(text, true),
    [runAssistantTurn]
  );

  const sendHiddenPrompt = useCallback(
    async (text: string) => runAssistantTurn(text, false),
    [runAssistantTurn]
  );

  return {
    messages,
    phase,
    hasMessages: messages.length > 0,
    hasConversation,
    isBusy: phase !== 'idle',
    sessionId,
    showFeedback,
    sendMessage,
    sendHiddenPrompt,
    cancelRequest,
    dismissFeedback
  };
}
