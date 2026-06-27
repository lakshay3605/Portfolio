'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/mission-control', label: 'Overview' },
  { href: '/mission-control/replay', label: 'Conversation Replay' }
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-full px-4 py-2 text-sm transition-colors',
              active
                ? 'bg-primary/90 font-medium text-black'
                : 'border border-white/10 text-text-secondary hover:bg-white/5 hover:text-text-primary'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function formatDuration(durationMs: number): string {
  if (durationMs <= 0) {
    return '—';
  }

  const totalSeconds = Math.round(durationMs / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function formatReplayDuration(durationMs: number): string {
  return formatDuration(durationMs);
}

export function formatReplayTime(timestamp: string | null): string {
  if (!timestamp) {
    return '—';
  }

  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
}
