'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { CinematicState } from '../types';

export interface CinematicCameraRigProps {
  cinematicRef: MutableRefObject<CinematicState>;
}

export function CinematicCameraRig({ cinematicRef }: CinematicCameraRigProps) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredLookAt = useRef(new THREE.Vector3());

  useFrame((_state, delta) => {
    const cinematic = cinematicRef.current;
    desiredPosition.current.set(...cinematic.cameraPosition);
    desiredLookAt.current.set(...cinematic.cameraLookAt);

    camera.position.lerp(desiredPosition.current, 1 - Math.exp(-4 * delta));
    lookTarget.current.lerp(desiredLookAt.current, 1 - Math.exp(-5 * delta));
    camera.lookAt(lookTarget.current);
  });

  return null;
}
