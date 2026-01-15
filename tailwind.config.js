/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* primary/15 */
        input: 'var(--color-input)', /* primary/15 */
        ring: 'var(--color-ring)', /* purple-600 */
        background: 'var(--color-background)', /* gray-50 */
        foreground: 'var(--color-foreground)', /* purple-950 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* purple-600 */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* purple-300 */
          foreground: 'var(--color-secondary-foreground)', /* purple-950 */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* rose-300 */
          foreground: 'var(--color-accent-foreground)', /* rose-950 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-400 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* green-600 */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-500 */
          foreground: 'var(--color-warning-foreground)', /* purple-950 */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-400 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* purple-50 */
          foreground: 'var(--color-muted-foreground)', /* purple-700 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* purple-50 */
          foreground: 'var(--color-card-foreground)', /* purple-950 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* purple-50 */
          foreground: 'var(--color-popover-foreground)', /* purple-950 */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Crimson Text', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Karla', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 2px 4px rgba(139, 95, 191, 0.08)',
        DEFAULT: '0 4px 6px rgba(139, 95, 191, 0.1)',
        md: '0 6px 12px rgba(139, 95, 191, 0.12)',
        lg: '0 12px 24px rgba(139, 95, 191, 0.15)',
        xl: '0 20px 40px -8px rgba(139, 95, 191, 0.15)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      zIndex: {
        1: '1',
        50: '50',
        100: '100',
        200: '200',
        300: '300',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'slide-down': 'slide-down 250ms ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};