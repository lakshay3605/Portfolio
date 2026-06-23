'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  animated?: boolean;
}

const cardStyles =
  'rounded-card border border-border-primary bg-surface/60 p-content-md shadow-card transition-all duration-300';

const hoverStyles =
  'hover:-translate-y-0.5 hover:border-border-secondary hover:shadow-card-hover';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, animated = false, className, children, ...props }, ref) => {
    const classes = cn(cardStyles, hoverable && hoverStyles, className);

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={classes}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
