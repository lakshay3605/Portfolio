/**
 * Design system tokens — single source of truth for colors, spacing, and motion timing.
 * CSS variables in globals.css remain the runtime source; these mirror them for TS usage.
 */

export const colors = {
  background: {
    primary: 'var(--background)',
    secondary: 'var(--background-secondary)',
    surface: 'var(--surface)',
    surfaceSecondary: 'var(--surface-secondary)'
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    muted: 'var(--text-disabled)'
  },
  border: {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-secondary)',
    subtle: 'rgba(255, 255, 255, 0.08)'
  },
  accent: {
    primary: 'var(--primary)',
    primaryDark: 'var(--primary-dark)',
    primaryLight: 'var(--primary-light)',
    secondary: 'var(--secondary)',
    highlight: 'var(--accent)'
  },
  interactive: {
    hover: 'var(--hover-surface)',
    focus: 'var(--focus-ring)',
    focusOffset: 'var(--background)'
  },
  status: {
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)'
  }
} as const;

/** Semantic spacing scale — use Tailwind classes mapped in tailwind.config.ts */
export const spacing = {
  /** 4px */
  xs: '0.25rem',
  /** 8px */
  sm: '0.5rem',
  /** 16px */
  md: '1rem',
  /** 24px */
  lg: '1.5rem',
  /** 32px */
  xl: '2rem',
  /** 48px */
  '2xl': '3rem',
  /** 64px */
  '3xl': '4rem',
  /** 96px */
  '4xl': '6rem',
  /** 128px */
  '5xl': '8rem',
  section: {
    sm: '4rem',
    md: '6rem',
    lg: '8rem'
  },
  container: {
    px: '1rem',
    pxSm: '1.5rem',
    pxLg: '2rem'
  }
} as const;

export const motion = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    page: 0.5
  }
} as const;

export const layout = {
  container: {
    sm: '42rem',
    md: '56rem',
    lg: '72rem',
    xl: '80rem'
  }
} as const;
