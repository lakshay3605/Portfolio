import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles =
      'backdrop-blur-[10px] rounded-xl transition-all';

    const variants = {
      default: 'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
      bordered:
        'bg-[var(--glass-bg)] border-2 border-[var(--primary)] border-opacity-30 hover:border-opacity-100'
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
