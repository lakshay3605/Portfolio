import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  variant?: 'default' | 'alternate' | 'muted';
  spacing?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-background',
  alternate: 'bg-background-secondary',
  muted: 'bg-surface/40'
} as const;

const spacingStyles = {
  sm: 'py-section-sm',
  md: 'py-section-md',
  lg: 'py-section-lg'
} as const;

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, variant = 'default', spacing = 'md', className, children, ...props }, ref) => (
    <section
      ref={ref}
      id={id}
      className={cn('w-full scroll-mt-24', variantStyles[variant], spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </section>
  )
);

Section.displayName = 'Section';
