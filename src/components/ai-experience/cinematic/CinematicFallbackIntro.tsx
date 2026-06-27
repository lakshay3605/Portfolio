'use client';

import type { MutableRefObject } from 'react';
import type { CinematicUiState } from '../introduction/useCinematicTimeline';
import type { CinematicState } from '../types';
import { CinematicFadeOverlay } from './CinematicFadeOverlay';
import { CinematicSubtitles } from './CinematicSubtitles';

export interface CinematicFallbackIntroProps {
  ui: CinematicUiState;
  cinematicRef: MutableRefObject<CinematicState>;
}

/** CSS-only intro when WebGL is unavailable or the 3D scene fails. */
export function CinematicFallbackIntro({ ui }: CinematicFallbackIntroProps) {
  const subtitlesVisible = ui.phase === 'speaking' || ui.phase === 'frozen';

  return (
    <div className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#020617]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,141,239,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

      <div
        className="relative flex flex-col items-center transition-transform duration-[4800ms] ease-out"
        style={{
          transform:
            ui.phase === 'fade-in' || ui.phase === 'pre-walk'
              ? 'scale(0.72) translateY(12px)'
              : 'scale(1) translateY(0)'
        }}
      >
        <div className="h-40 w-24 rounded-full bg-gradient-to-b from-[#c9a88a] to-[#141b2d] opacity-90 shadow-[0_30px_80px_rgba(0,0,0,0.45)]" />
        <div className="mt-[-1.5rem] h-28 w-36 rounded-t-[2rem] bg-[#141b2d] opacity-95" />
      </div>

      <CinematicSubtitles
        lineIndex={ui.subtitleIndex}
        visible={subtitlesVisible && ui.subtitleIndex >= 0}
      />

      <CinematicFadeOverlay opacity={ui.fadeOpacity} />
    </div>
  );
}
