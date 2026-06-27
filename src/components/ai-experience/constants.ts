/** Avatar spawn and destination (world space). */
export const AVATAR_START: [number, number, number] = [0, 0, -6];
export const AVATAR_END: [number, number, number] = [0, 0, 0];

/** Camera wide → medium chest-up framing. */
export const CAMERA_START: [number, number, number] = [0, 1.35, 9];
export const CAMERA_END: [number, number, number] = [0, 1.58, 2.35];

export const CINEMATIC_TIMING = {
  fadeInMs: 2200,
  preWalkPauseMs: 900,
  walkDurationMs: 4800,
  settleMs: 500,
  subtitleLeadInMs: 400,
  subtitleGapMs: 3000,
  finalHoldMs: 2400
} as const;

export const SCENE_COLORS = {
  background: '#020617',
  fog: '#020617',
  floor: '#0a0f1e',
  floorReflect: '#121827',
  keyLight: '#e8eef8',
  rimLight: '#5b8def',
  fillLight: '#1e293b'
} as const;
