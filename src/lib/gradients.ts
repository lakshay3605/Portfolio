/**
 * Gradient utility functions for consistent, reusable gradients
 */

export const gradients = {
  primary: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  accent: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
  subtle: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  reverse: 'linear-gradient(315deg, var(--secondary) 0%, var(--primary) 100%)'
} as const;

export function getGradientStyle(type: keyof typeof gradients) {
  return { background: gradients[type] };
}

export function getGradientClass(type: keyof typeof gradients): string {
  const classMap = {
    primary: 'gradient-primary',
    accent: 'gradient-accent',
    subtle: 'gradient-subtle',
    reverse: 'gradient-primary'
  };
  return classMap[type];
}
