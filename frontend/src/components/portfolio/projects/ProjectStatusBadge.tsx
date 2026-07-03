import { cn } from '@/lib/cn';
import type { ProjectStatus, ProjectStatusVariant } from './types';

export interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const variantStyles: Record<ProjectStatusVariant, string> = {
  'under-development':
    'border-amber-400/20 bg-amber-400/[0.06] text-amber-100/80',
  planning: 'border-sky-400/20 bg-sky-400/[0.06] text-sky-100/75',
  live: 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-100/80'
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 rounded-full border px-3 py-1.5 text-xs font-mono tracking-wide',
        'border-border-primary/70 bg-background/40 text-text-secondary',
        className
      )}
      title={status.description}
      aria-label={`${status.label}: ${status.description}`}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-sm text-[12px]'
        )}
      >
        {status.emoji}
      </span>

      <span className="text-xs font-mono text-text-primary">{status.label}</span>
    </span>
  );
}
