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
        // Slate-based custom palette for dark mode
        dark: {
          bg: '#0B0F19',       // Deep slate-black
          card: '#161E2E',     // Lighter glass-slate card
          border: '#242F41',   // Slate borders
          hover: '#1F2A3D',    // Hover states
          accent: '#6366F1',   // Indigo
        },
        // Modern premium light mode
        light: {
          bg: '#F8FAFC',       // Slate 50
          card: '#FFFFFF',     // White card
          border: '#E2E8F0',   // Slate 200
          hover: '#F1F5F9',    // Slate 100
          accent: '#4F46E5',   // Indigo
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
