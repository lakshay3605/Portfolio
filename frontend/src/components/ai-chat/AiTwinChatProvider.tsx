'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { AI_TWIN_MODAL_WELCOME_MESSAGE } from './constants';
import { useChatSession, type ChatSession } from './hooks/useChatSession';

const AiTwinChatContext = createContext<ChatSession | null>(null);

export function AiTwinChatProvider({ children }: { children: ReactNode }) {
  const session = useChatSession({ welcomeMessage: AI_TWIN_MODAL_WELCOME_MESSAGE });

  return <AiTwinChatContext.Provider value={session}>{children}</AiTwinChatContext.Provider>;
}

export function useAiTwinChat(): ChatSession {
  const context = useContext(AiTwinChatContext);
  if (!context) {
    throw new Error('useAiTwinChat must be used within AiTwinChatProvider');
  }

  return context;
}
