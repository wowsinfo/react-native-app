/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: 'var(--color-app)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        line: 'var(--color-line)',
        'line-soft': 'var(--color-line-soft)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        'accent-surface': 'var(--color-accent-surface)',
        pressed: 'var(--color-pressed)',
        'warning-surface': 'var(--color-warning-surface)',
        'warning-border': 'var(--color-warning-border)',
        inverse: 'var(--color-inverse)',
      },
    },
  },
  plugins: [],
};
