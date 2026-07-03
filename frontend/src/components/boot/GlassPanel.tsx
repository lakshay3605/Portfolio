'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  className?: string;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className = '', children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[24px] border border-white/10 bg-[rgba(9,14,30,0.78)] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10 md:p-12 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
);

GlassPanel.displayName = 'GlassPanel';
