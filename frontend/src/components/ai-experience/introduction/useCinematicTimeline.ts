import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import {
  AVATAR_END,
  AVATAR_START,
  CAMERA_END,
  CAMERA_START,
  CINEMATIC_TIMING
} from '../constants';
import { INTRODUCTION_LINES } from './dialogue';
import type { AvatarAnimationState, CinematicPhase, CinematicState } from '../types';

export interface CinematicUiState {
  phase: CinematicPhase;
  subtitleIndex: number;
  fadeOpacity: number;
}

export interface CinematicTimeline {
  cinematicRef: MutableRefObject<CinematicState>;
  ui: CinematicUiState;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function getSpeakStartMs() {
  const { fadeInMs, preWalkPauseMs, walkDurationMs, settleMs, subtitleLeadInMs } =
    CINEMATIC_TIMING;
  return fadeInMs + preWalkPauseMs + walkDurationMs + settleMs + subtitleLeadInMs;
}

function getTotalDurationMs() {
  const speakStart = getSpeakStartMs();
  const subtitleDuration =
    INTRODUCTION_LINES.length * CINEMATIC_TIMING.subtitleGapMs + CINEMATIC_TIMING.finalHoldMs;
  return speakStart + subtitleDuration;
}

function computeState(elapsed: number, reducedMotion: boolean): CinematicState {
  const {
    fadeInMs,
    preWalkPauseMs,
    walkDurationMs,
    settleMs,
    subtitleGapMs,
    finalHoldMs
  } = CINEMATIC_TIMING;

  const speakStart = getSpeakStartMs();
  const totalDuration = getTotalDurationMs();

  if (reducedMotion) {
    const fadeOpacity = Math.max(0, 1 - elapsed / fadeInMs);
    const speakElapsed = Math.max(0, elapsed - fadeInMs - 600);
    const subtitleIndex = Math.min(
      INTRODUCTION_LINES.length - 1,
      Math.floor(speakElapsed / subtitleGapMs)
    );
    const frozen = elapsed >= totalDuration - walkDurationMs - preWalkPauseMs;

    return {
      phase: frozen ? 'frozen' : speakElapsed > 0 ? 'speaking' : 'fade-in',
      elapsed,
      fadeOpacity,
      walkProgress: 1,
      avatarPosition: AVATAR_END,
      cameraPosition: CAMERA_END,
      cameraLookAt: [AVATAR_END[0], 1.55, AVATAR_END[2]],
      subtitleIndex: frozen ? INTRODUCTION_LINES.length - 1 : subtitleIndex,
      avatarAnimation: frozen ? 'idle' : 'speaking'
    };
  }

  const fadeOpacity = Math.max(0, 1 - easeInOutCubic(Math.min(elapsed / fadeInMs, 1)));

  let phase: CinematicPhase = 'fade-in';
  let walkProgress = 0;
  let avatarAnimation: AvatarAnimationState = 'idle';

  const walkStart = fadeInMs + preWalkPauseMs;
  const walkEnd = walkStart + walkDurationMs;
  const settleEnd = walkEnd + settleMs;

  if (elapsed >= totalDuration) {
    phase = 'frozen';
    walkProgress = 1;
    avatarAnimation = 'idle';
  } else if (elapsed >= speakStart) {
    phase = 'speaking';
    walkProgress = 1;
    avatarAnimation = 'speaking';
  } else if (elapsed >= settleEnd) {
    phase = 'settling';
    walkProgress = 1;
    avatarAnimation = 'idle';
  } else if (elapsed >= walkStart) {
    phase = 'walking';
    walkProgress = easeInOutCubic((elapsed - walkStart) / walkDurationMs);
    avatarAnimation = 'walking';
  } else if (elapsed >= fadeInMs) {
    phase = 'pre-walk';
  }

  const avatarPosition = lerp3(AVATAR_START, AVATAR_END, walkProgress);
  const cameraPosition = lerp3(CAMERA_START, CAMERA_END, walkProgress);
  const cameraLookAt: [number, number, number] = [
    avatarPosition[0],
    1.52 + walkProgress * 0.03,
    avatarPosition[2]
  ];

  let subtitleIndex = -1;
  if (elapsed >= speakStart) {
    const speakElapsed = elapsed - speakStart;
    if (speakElapsed >= INTRODUCTION_LINES.length * subtitleGapMs + finalHoldMs) {
      subtitleIndex = INTRODUCTION_LINES.length - 1;
    } else {
      subtitleIndex = Math.min(
        INTRODUCTION_LINES.length - 1,
        Math.floor(speakElapsed / subtitleGapMs)
      );
    }
  }

  return {
    phase,
    elapsed,
    fadeOpacity,
    walkProgress,
    avatarPosition,
    cameraPosition,
    cameraLookAt,
    subtitleIndex,
    avatarAnimation
  };
}

function toUiState(state: CinematicState): CinematicUiState {
  return {
    phase: state.phase,
    subtitleIndex: state.subtitleIndex,
    fadeOpacity: state.fadeOpacity
  };
}

/** Drives cinematic motion via ref (for R3F) and minimal React state (for UI overlays). */
export function useCinematicTimeline(reducedMotion: boolean): CinematicTimeline {
  const cinematicRef = useRef<CinematicState>(computeState(0, reducedMotion));
  const [ui, setUi] = useState<CinematicUiState>(() => toUiState(cinematicRef.current));

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = computeState(elapsed, reducedMotion);
      cinematicRef.current = next;

      setUi((prev) => {
        const phaseChanged = prev.phase !== next.phase;
        const subtitleChanged = prev.subtitleIndex !== next.subtitleIndex;
        const fadeChanged = Math.abs(prev.fadeOpacity - next.fadeOpacity) >= 0.015;

        if (!phaseChanged && !subtitleChanged && !fadeChanged) {
          return prev;
        }

        return toUiState(next);
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return { cinematicRef, ui };
}

export { INTRODUCTION_LINES, getSpeakStartMs, getTotalDurationMs };
