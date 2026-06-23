'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export function GlowButton({
  children,
  className = '',
  disabled,
  onClick,
  'aria-label': ariaLabel
}: GlowButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        prefersReducedMotion || disabled
          ? undefined
          : {
              scale: 1.02,
              y: -2
            }
      }
      whileTap={prefersReducedMotion || disabled ? undefined : { scale: 0.98 }}
      className={`group relative overflow-hidden rounded-full border border-white/20 bg-white/[0.06] px-8 py-3.5 text-sm font-medium tracking-wide text-text-primary backdrop-blur-sm transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-boot-bg disabled:cursor-not-allowed disabled:opacity-50 sm:px-10 sm:py-4 sm:text-base ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-boot-button-glow transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-boot-button-shine opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
