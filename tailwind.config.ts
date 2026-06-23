const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        mono: ['var(--font-mono)', 'monospace']
      },
      colors: {
        boot: {
          bg: 'var(--boot-bg)',
          'glass-bg': 'var(--boot-glass-bg)',
          'glass-border': 'var(--boot-glass-border)'
        },
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        surface: 'var(--surface)',
        'surface-secondary': 'var(--surface-secondary)',
        hover: 'var(--hover-surface)',
        focus: 'var(--focus-ring)',
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)',
          light: 'var(--accent-light)'
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)'
        },
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)'
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)'
      },
      spacing: {
        'section-sm': '4rem',
        'section-md': '6rem',
        'section-lg': '8rem',
        'content-xs': '0.5rem',
        'content-sm': '1rem',
        'content-md': '1.5rem',
        'content-lg': '2rem',
        'content-xl': '3rem'
      },
      maxWidth: {
        'container-sm': '42rem',
        'container-md': '56rem',
        'container-lg': '72rem',
        'container-xl': '80rem'
      },
      borderRadius: {
        card: '0.875rem',
        button: '0.625rem'
      },
      backdropBlur: {
        glass: '10px'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)'
          }
        },
        'boot-grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '72px 72px' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        glow: 'glow 3s infinite',
        'boot-grid-drift': 'boot-grid-drift 28s linear infinite'
      },
      boxShadow: {
        'boot-glass':
          '0 24px 80px var(--boot-glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'boot-progress-glow':
          '0 0 24px rgba(34, 211, 238, 0.35), 0 0 48px rgba(34, 211, 238, 0.12)',
        'boot-button-glow':
          '0 0 32px rgba(56, 189, 248, 0.28), 0 0 64px rgba(34, 211, 238, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'boot-status-glow': '0 0 8px rgba(52, 211, 153, 0.8)',
        'experience-card-cyan':
          '0 20px 60px rgba(0, 0, 0, 0.35), 0 0 48px rgba(34, 211, 238, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'experience-card-violet':
          '0 20px 60px rgba(0, 0, 0, 0.35), 0 0 48px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        card: '0 1px 2px rgba(0, 0, 0, 0.24), 0 8px 24px rgba(0, 0, 0, 0.18)',
        'card-hover':
          '0 4px 12px rgba(0, 0, 0, 0.28), 0 16px 40px rgba(0, 0, 0, 0.22)',
        nav: '0 1px 0 rgba(255, 255, 255, 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
