'use client';

import { useEffect, useRef } from 'react';

export function useAutoScroll<T extends HTMLElement>(
  dependency: unknown,
  enabled = true
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [dependency, enabled]);

  return containerRef;
}
