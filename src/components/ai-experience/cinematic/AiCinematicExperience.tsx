'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useCinematicTimeline } from '../introduction/useCinematicTimeline';
import { createSubtitleOnlyVoiceService } from '../voice';
import { AiSceneErrorBoundary } from './AiSceneErrorBoundary';
import { CinematicFadeOverlay } from './CinematicFadeOverlay';
import { CinematicFallbackIntro } from './CinematicFallbackIntro';
import { CinematicScene } from './CinematicScene';
import { CinematicSubtitles } from './CinematicSubtitles';

export interface AiCinematicExperienceProps {
  mode?: '3d' | 'fallback';
}

export function AiCinematicExperience({ mode = '3d' }: AiCinematicExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const { cinematicRef, ui } = useCinematicTimeline(Boolean(prefersReducedMotion));
  const voiceServiceRef = useRef(createSubtitleOnlyVoiceService());

  const subtitlesVisible = ui.phase === 'speaking' || ui.phase === 'frozen';

  useEffect(() => {
    return () => {
      voiceServiceRef.current.dispose();
    };
  }, []);

  if (mode === 'fallback') {
    return <CinematicFallbackIntro ui={ui} cinematicRef={cinematicRef} />;
  }

  return (
    <AiSceneErrorBoundary fallback={<CinematicFallbackIntro ui={ui} cinematicRef={cinematicRef} />}>
      <div className="relative h-svh w-full overflow-hidden bg-[#020617]">
        <CinematicScene cinematicRef={cinematicRef} />

        <CinematicSubtitles
          lineIndex={ui.subtitleIndex}
          visible={subtitlesVisible && ui.subtitleIndex >= 0}
        />

        <CinematicFadeOverlay opacity={ui.fadeOpacity} />

        <div className="sr-only" aria-live="polite">
          {ui.phase === 'frozen'
            ? 'Introduction complete. Conversation interface coming soon.'
            : 'AI introduction in progress.'}
        </div>
      </div>
    </AiSceneErrorBoundary>
  );
}
