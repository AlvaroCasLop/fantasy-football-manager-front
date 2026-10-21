import type { Config } from 'tailwindcss'

export default <Config>{
  darkMode: ['class'],
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#e02424',
          600: '#c81e1e',
          700: '#9b1c1c',
          800: '#8b0000',
          900: '#5c0000',
          950: '#380000',
        },
        parchment: {
          50: '#fcfbf7',
          100: '#f8f5ed',
          200: '#f4e4c1',
          300: '#e8cb93',
          400: '#d9ad60',
          500: '#c69138',
          600: '#a37126',
        },
        charcoal: {
          800: '#1e1e24',
          850: '#18181c',
          900: '#121215',
          950: '#0a0a0c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        header: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(220, 20, 60, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(244, 228, 193, 0.3)',
      }
    },
  },
  plugins: [],
}
