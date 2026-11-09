/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--color-canvas)',
          warm: 'var(--color-canvas-warm)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          secondary: 'var(--color-ink-secondary)',
          muted: 'var(--color-ink-muted)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          pressed: 'var(--color-primary-pressed)',
          tint: 'var(--color-primary-tint)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        focus: {
          DEFAULT: 'var(--color-focus)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          tint: 'var(--color-info-tint)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          tint: 'var(--color-warning-tint)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          tint: 'var(--color-danger-tint)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          tint: 'var(--color-success-tint)',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
      },
      maxWidth: {
        'content': '1200px',
        'reading': '720px',
      },
      transitionTimingFunction: {
        'custom-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

