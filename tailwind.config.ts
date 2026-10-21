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
        // Dark fantasy sports management palette
        ground: '#111318',     // Main background
        sidebar: '#171A21',    // Left sidebar
        surface: {
          DEFAULT: '#1D212B',  // Panels, cards
          hover: '#242936',    // Card/row hover state
          active: '#2A303F',   // Active element state
          muted: '#151820',    // Secondary inset panels
        },
        border: {
          DEFAULT: '#303644',  // Subtle borders
          light: '#3E4657',    // Focus/highlight borders
          dark: '#232732',     // Dark borders
        },
        content: {
          primary: '#F1F3F5',  // Primary typography
          secondary: '#A1A8B5',// Secondary text/labels
          muted: '#6C7584',    // Disabled/placeholder text
        },
        crimson: {
          DEFAULT: '#B8323C',  // Brand accent
          hover: '#CD3A45',
          active: '#9E2730',
          dark: '#58171C',
          subtle: 'rgba(184, 50, 60, 0.15)',
        },
        // Indicators
        status: {
          win: '#3FA26C',      // Muted green
          draw: '#E5A43B',     // Amber
          loss: '#B8323C',     // Crimson
          active: '#3FA26C',
          pending: '#3B82F6',   // Steel blue
          finished: '#6C7584', // Neutral
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': '0.6875rem', // 11px
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px #303644',
      },
    },
  },
}
