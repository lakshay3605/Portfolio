import { cn } from '@/lib/cn';
import type { LeadershipData } from './types';

export interface LeadershipCardProps {
  leadership: LeadershipData;
  className?: string;
}

export function LeadershipCard({ leadership, className }: LeadershipCardProps) {
  return (
    <div className={cn('lead-card', className)}>
      <div className="lead-org">{leadership.organization}</div>
      <div className="lead-role">{leadership.role}</div>
      <p className="lead-desc">{leadership.description}</p>
    </div>
  );
}
