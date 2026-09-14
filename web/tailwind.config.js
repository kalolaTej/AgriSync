/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534',
          hover: '#14532d',
          active: '#052e16',
          container: '#166534',
          'on-container': '#93e0a2',
          fixed: '#a6f4b5',
        },
        secondary: {
          DEFAULT: '#475569',
          container: '#d5e3fc',
          'on-container': '#57657a',
        },
        tertiary: {
          DEFAULT: '#0369a1',
          container: '#005d90',
          'on-container': '#a7d4ff',
        },
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          container: '#eaedff',
          'container-low': '#f2f3ff',
          'container-lowest': '#ffffff',
          'container-high': '#e2e7ff',
          'container-highest': '#dae2fd',
        },
        'on-surface': {
          DEFAULT: '#131b2e',
          variant: '#404940',
        },
        outline: {
          DEFAULT: '#707a6f',
          variant: '#bfc9bd',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
