export type CinematicPhase =
  | 'fade-in'
  | 'pre-walk'
  | 'walking'
  | 'settling'
  | 'speaking'
  | 'frozen';

export type AvatarAnimationState = 'walking' | 'idle' | 'speaking';

export interface CinematicState {
  phase: CinematicPhase;
  elapsed: number;
  fadeOpacity: number;
  walkProgress: number;
  avatarPosition: [number, number, number];
  cameraPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  subtitleIndex: number;
  avatarAnimation: AvatarAnimationState;
}

export interface IntroductionLine {
  id: string;
  text: string;
  /** Reserved for future voice sync (ElevenLabs). */
  durationMs?: number;
}
