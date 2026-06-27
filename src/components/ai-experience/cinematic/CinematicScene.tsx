'use client';

import { memo, Suspense, useEffect, useState, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { CAMERA_START } from '../constants';
import type { CinematicState } from '../types';
import { AvatarPlaceholder } from './AvatarPlaceholder';
import { CinematicCameraRig } from './CinematicCameraRig';
import { CinematicEnvironment } from './CinematicEnvironment';

export interface CinematicSceneProps {
  cinematicRef: MutableRefObject<CinematicState>;
}

function SceneContent({ cinematicRef }: CinematicSceneProps) {
  return (
    <>
      <CinematicEnvironment />
      <CinematicCameraRig cinematicRef={cinematicRef} />
      <AvatarPlaceholder cinematicRef={cinematicRef} />
    </>
  );
}

function CinematicSceneInner({ cinematicRef }: CinematicSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#020617]" aria-hidden="true" />;
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
        failIfMajorPerformanceCaveat: false
      }}
      camera={{ fov: 42, near: 0.1, far: 40, position: CAMERA_START }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContent cinematicRef={cinematicRef} />
      </Suspense>
    </Canvas>
  );
}

export const CinematicScene = memo(CinematicSceneInner);
