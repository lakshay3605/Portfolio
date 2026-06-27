/**
 * Design system theme and color constants
 */

export const theme = {
  colors: {
    background: 'var(--background)',
    backgroundSecondary: 'var(--background-secondary)',
    surface: 'var(--surface)',
    surfaceSecondary: 'var(--surface-secondary)',
    primary: {
      base: 'var(--primary)',
      dark: 'var(--primary-dark)',
      light: 'var(--primary-light)'
    },
    secondary: {
      base: 'var(--secondary)',
      dark: 'var(--secondary-dark)',
      light: 'var(--secondary-light)'
    },
    accent: {
      base: 'var(--accent)',
      dark: 'var(--accent-dark)',
      light: 'var(--accent-light)'
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      tertiary: 'var(--text-tertiary)',
      disabled: 'var(--text-disabled)'
    },
    status: {
      success: 'var(--success)',
      warning: 'var(--warning)',
      error: 'var(--error)'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  }
} as const;
