'use client';

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isWelcomeAutoOpenHandled, markWelcomeAutoOpenHandled } from '@/lib/session';

interface FloatingAssistantContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  minimize: () => void;
  openWithPrompt: (prompt: string) => void;
  consumePendingPrompt: () => string | null;
  consumeSkipScrollReset: () => boolean;
}

const FloatingAssistantContext = createContext<FloatingAssistantContextValue | null>(null);

export function useFloatingAssistant(): FloatingAssistantContextValue {
  const context = useContext(FloatingAssistantContext);
  if (!context) {
    throw new Error('useFloatingAssistant must be used within FloatingAssistantProvider');
  }

  return context;
}

function FloatingAssistantAutoOpen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { open } = useFloatingAssistant();

  useEffect(() => {
    if (searchParams.get('ai') !== 'open') {
      return;
    }

    markWelcomeAutoOpenHandled();
    open();
    router.replace('/portfolio', { scroll: false });
  }, [open, router, searchParams]);

  return null;
}

function PortfolioWelcomeAutoOpen() {
  const searchParams = useSearchParams();
  const { open } = useFloatingAssistant();

  useEffect(() => {
    if (searchParams.get('ai') === 'open') {
      return;
    }

    if (isWelcomeAutoOpenHandled()) {
      return;
    }

    markWelcomeAutoOpenHandled();
    open();
  }, [open, searchParams]);

  return null;
}

export function FloatingAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pendingPromptRef = useRef<string | null>(null);
  const skipScrollResetRef = useRef(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    markWelcomeAutoOpenHandled();
    setIsOpen(false);
  }, []);

  const minimize = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openWithPrompt = useCallback((prompt: string) => {
    pendingPromptRef.current = prompt;
    skipScrollResetRef.current = true;
    setIsOpen(true);
  }, []);

  const consumePendingPrompt = useCallback(() => {
    const prompt = pendingPromptRef.current;
    pendingPromptRef.current = null;
    return prompt;
  }, []);

  const consumeSkipScrollReset = useCallback(() => {
    if (!skipScrollResetRef.current) {
      return false;
    }

    skipScrollResetRef.current = false;
    return true;
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
      minimize,
      openWithPrompt,
      consumePendingPrompt,
      consumeSkipScrollReset
    }),
    [close, consumePendingPrompt, consumeSkipScrollReset, isOpen, minimize, open, openWithPrompt]
  );

  return (
    <FloatingAssistantContext.Provider value={value}>
      <Suspense fallback={null}>
        <FloatingAssistantAutoOpen />
        <PortfolioWelcomeAutoOpen />
      </Suspense>
      {children}
    </FloatingAssistantContext.Provider>
  );
}
