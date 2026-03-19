import type { Config } from 'tailwindcss';

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
        // Material Design 3 — Dark Theme Tokens
        primary: '#89d89e',
        'primary-container': '#1a6b3c',
        'on-primary': '#00391b',
        'on-primary-container': '#a5f4b8',
        'inverse-primary': '#1b6c3d',

        secondary: '#f6be39',
        'secondary-container': '#c59300',
        'on-secondary': '#3e2e00',
        'on-secondary-container': '#ffdea6',

        tertiary: '#ffb2b9',
        'tertiary-container': '#73333e',
        'on-tertiary': '#5c1225',

        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        background: '#101415',
        'on-background': '#e0e3e5',

        surface: '#101415',
        'on-surface': '#e0e3e5',
        'on-surface-variant': '#bfc9be',

        'surface-container-lowest': '#0b0f10',
        'surface-container-low': '#191c1e',
        'surface-container': '#1d2022',
        'surface-container-high': '#272a2c',
        'surface-container-highest': '#323537',

        outline: '#899389',
        'outline-variant': '#404940',

        // Semantic aliases
        border: '#404940',
        foreground: '#e0e3e5',
        'muted-foreground': '#899389',
        card: '#1d2022',
        'card-foreground': '#e0e3e5',
        destructive: '#ffb4ab',
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
