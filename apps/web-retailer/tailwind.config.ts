import type { Config } from 'tailwindcss';

function rgb(varName: string) {
  return `rgb(var(--color-${varName}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: rgb('primary'),
        'primary-container': rgb('primary-container'),
        'on-primary': rgb('on-primary'),
        'on-primary-container': rgb('on-primary-container'),
        'inverse-primary': rgb('inverse-primary'),

        secondary: rgb('secondary'),
        'secondary-container': rgb('secondary-container'),
        'on-secondary': rgb('on-secondary'),
        'on-secondary-container': rgb('on-secondary-container'),

        tertiary: rgb('tertiary'),
        'tertiary-container': rgb('tertiary-container'),
        'on-tertiary': rgb('on-tertiary'),

        error: rgb('error'),
        'error-container': rgb('error-container'),
        'on-error': rgb('on-error'),
        'on-error-container': rgb('on-error-container'),

        background: rgb('background'),
        'on-background': rgb('on-background'),

        surface: rgb('surface'),
        'on-surface': rgb('on-surface'),
        'on-surface-variant': rgb('on-surface-variant'),

        'surface-container-lowest': rgb('surface-container-lowest'),
        'surface-container-low': rgb('surface-container-low'),
        'surface-container': rgb('surface-container'),
        'surface-container-high': rgb('surface-container-high'),
        'surface-container-highest': rgb('surface-container-highest'),

        outline: rgb('outline'),
        'outline-variant': rgb('outline-variant'),

        border: rgb('border'),
        foreground: rgb('foreground'),
        'muted-foreground': rgb('muted-foreground'),
        card: rgb('card'),
        'card-foreground': rgb('card-foreground'),
        destructive: rgb('destructive'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'subtle-green': '0 4px 20px -2px rgba(137,216,158,0.05)',
        'glow-green': '0 0 20px rgba(137,216,158,0.1)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
      },
    },
  },
  plugins: [],
};

export default config;
