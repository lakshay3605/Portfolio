'use client';

import { SCENE_COLORS } from '../constants';

export function CinematicEnvironment() {
  return (
    <>
      <color attach="background" args={[SCENE_COLORS.background]} />
      <fog attach="fog" args={[SCENE_COLORS.fog, 6, 22]} />

      <ambientLight intensity={0.22} color={SCENE_COLORS.fillLight} />
      <spotLight
        position={[2.5, 6, 4.5]}
        angle={0.42}
        penumbra={0.85}
        intensity={1.15}
        color={SCENE_COLORS.keyLight}
      />
      <spotLight
        position={[-3, 4, -2]}
        angle={0.55}
        penumbra={1}
        intensity={0.35}
        color={SCENE_COLORS.rimLight}
      />
      <directionalLight position={[0, 2, -6]} intensity={0.12} color="#334155" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial
          color={SCENE_COLORS.floor}
          metalness={0.35}
          roughness={0.55}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[4.5, 14, 48]} />
        <meshStandardMaterial
          color={SCENE_COLORS.floorReflect}
          metalness={0.65}
          roughness={0.35}
          transparent
          opacity={0.35}
        />
      </mesh>
    </>
  );
}
