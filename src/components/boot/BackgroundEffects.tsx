'use client';

import { useMemo } from 'react';

const PARTICLE_COUNT = 10;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 4,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 30
  }));
}

export function BackgroundEffects() {
  const particles = useMemo(() => createParticles(PARTICLE_COUNT), []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-boot-bg"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-boot-radial-primary animate-boot-radial-primary" />
      <div className="absolute inset-0 bg-boot-radial-secondary animate-boot-radial-secondary" />
      <div className="absolute inset-0 bg-boot-grid opacity-40 animate-boot-grid-drift" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-boot-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            // CSS custom properties for particle animation
            ['--particle-dx' as string]: `${particle.driftX}px`,
            ['--particle-dy' as string]: `${particle.driftY}px`,
            ['--particle-duration' as string]: `${particle.duration}s`,
            ['--particle-delay' as string]: `${particle.delay}s`
          }}
        />
      ))}

      <div className="absolute inset-0 bg-boot-vignette" />
    </div>
  );
}
