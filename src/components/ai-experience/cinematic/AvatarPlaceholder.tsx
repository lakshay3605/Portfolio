'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { CinematicState } from '../types';

export interface AvatarPlaceholderProps {
  cinematicRef: MutableRefObject<CinematicState>;
}

export function AvatarPlaceholder({ cinematicRef }: AvatarPlaceholderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    const cinematic = cinematicRef.current;
    const { avatarPosition, avatarAnimation, walkProgress, phase } = cinematic;
    const isFrozen = phase === 'frozen';

    if (isFrozen) {
      timeRef.current += delta * 0.55;
    } else {
      timeRef.current += delta;
    }

    const t = timeRef.current;

    if (groupRef.current) {
      groupRef.current.position.set(...avatarPosition);
      groupRef.current.rotation.y = Math.PI;
    }

    const breath = Math.sin(t * 1.6) * 0.012;
    if (torsoRef.current) {
      torsoRef.current.scale.y = 1 + breath;
    }

    if (headRef.current) {
      const headSway = Math.sin(t * 0.9) * 0.035;
      const speakNod = avatarAnimation === 'speaking' ? Math.sin(t * 2.4) * 0.015 : 0;
      headRef.current.rotation.y = headSway;
      headRef.current.rotation.x = speakNod - 0.04;
    }

    const walkCycle = walkProgress * Math.PI * 2 * 3.2;
    const swing =
      avatarAnimation === 'walking' ? Math.sin(walkCycle) * 0.42 : Math.sin(t * 1.2) * 0.03;

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.55;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.55;
  });

  const skin = '#c9a88a';
  const jacket = '#141b2d';
  const pants = '#0f1628';

  return (
    <group ref={groupRef}>
      <group ref={torsoRef} position={[0, 1.05, 0]}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
          <meshStandardMaterial color={jacket} roughness={0.72} metalness={0.08} />
        </mesh>

        <group ref={headRef} position={[0, 0.62, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.19, 24, 24]} />
            <meshStandardMaterial color={skin} roughness={0.62} metalness={0.05} />
          </mesh>
        </group>

        <group ref={leftArmRef} position={[-0.36, 0.18, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
            <meshStandardMaterial color={jacket} roughness={0.75} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.36, 0.18, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
            <meshStandardMaterial color={jacket} roughness={0.75} />
          </mesh>
        </group>
      </group>

      <group ref={leftLegRef} position={[-0.14, 0.62, 0]}>
        <mesh castShadow position={[0, -0.34, 0]}>
          <capsuleGeometry args={[0.09, 0.48, 6, 12]} />
          <meshStandardMaterial color={pants} roughness={0.78} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.14, 0.62, 0]}>
        <mesh castShadow position={[0, -0.34, 0]}>
          <capsuleGeometry args={[0.09, 0.48, 6, 12]} />
          <meshStandardMaterial color={pants} roughness={0.78} />
        </mesh>
      </group>
    </group>
  );
}
