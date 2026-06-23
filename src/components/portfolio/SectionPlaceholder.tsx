import { Typography } from '@/components/ui/Typography';
import { cn } from '@/lib/cn';

export interface SectionPlaceholderProps {
  name: string;
  className?: string;
}

export function SectionPlaceholder({ name, className }: SectionPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[32vh] items-center justify-center rounded-card border border-dashed border-border-primary/50 bg-surface/20 sm:min-h-[40vh]',
        className
      )}
      aria-label={`${name} section placeholder`}
    >
      <Typography variant="h3" className="text-text-tertiary">
        {name}
      </Typography>
    </div>
  );
}
