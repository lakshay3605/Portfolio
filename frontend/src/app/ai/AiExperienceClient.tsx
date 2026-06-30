'use client';

import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AiConversation } from '@/components/ai-chat';
import { CinematicFallbackIntro } from '@/components/ai-experience/cinematic/CinematicFallbackIntro';
import { useCinematicTimeline } from '@/components/ai-experience/introduction/useCinematicTimeline';

function AiCinematicIntro({ onComplete }: { onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const { cinematicRef, ui } = useCinematicTimeline(Boolean(prefersReducedMotion));

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    if (ui.phase === 'frozen') {
      const timer = window.setTimeout(onComplete, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [ui.phase, prefersReducedMotion, onComplete]);

  return <CinematicFallbackIntro ui={ui} cinematicRef={cinematicRef} />;
}

interface AiIntroErrorBoundaryProps {
  children: ReactNode;
}

interface AiIntroErrorBoundaryState {
  hasError: boolean;
}

class AiIntroErrorBoundary extends Component<
  AiIntroErrorBoundaryProps,
  AiIntroErrorBoundaryState
> {
  constructor(props: AiIntroErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AiIntroErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AI experience error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <AiConversation />;
    }

    return this.props.children;
  }
}

function AiExperienceWithIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowConversation(true);
    }
  }, [prefersReducedMotion]);

  if (showConversation) {
    return <AiConversation />;
  }

  return <AiCinematicIntro onComplete={() => setShowConversation(true)} />;
}

export function AiExperienceClient() {
  return (
    <AiIntroErrorBoundary>
      <AiExperienceWithIntro />
    </AiIntroErrorBoundary>
  );
}
