import type { Transition, Variants } from 'framer-motion';
import { motion as motionTokens } from '@/lib/design-system/tokens';

const ease = motionTokens.ease;
const { fast, normal, slow, page } = motionTokens.duration;

export const transition = {
  fast: { duration: fast, ease } satisfies Transition,
  normal: { duration: normal, ease } satisfies Transition,
  slow: { duration: slow, ease } satisfies Transition,
  page: { duration: page, ease } satisfies Transition
} as const;

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
};

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transition.slow
  }
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transition.page
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: transition.fast
  }
};

export const navReveal: Variants = {
  initial: { opacity: 0, y: -12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transition.normal
  }
};

export const crossfade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transition.normal },
  exit: { opacity: 0, transition: transition.fast }
};

export const heroReveal: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transition.slow
  }
};

export const pillReveal: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transition.normal
  }
};
